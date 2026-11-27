package website.myfloor.data

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset

/** 시간을 직접 움직일 수 있는 시계 */
class FakeClock(var now: Instant = Instant.parse("2026-11-27T06:00:00Z")) : Clock() {
    override fun getZone() = ZoneOffset.UTC
    override fun withZone(zone: java.time.ZoneId?) = this
    override fun instant(): Instant = now
    fun advance(seconds: Long) {
        now = now.plusSeconds(seconds)
    }
}

@RunWith(AndroidJUnit4::class)
class ParkingRepositoryTest {
    private lateinit var db: MyFloorDatabase
    private lateinit var repo: ParkingRepository
    private val clock = FakeClock()
    private var changes = 0

    @Before
    fun setUp() {
        val ctx = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(ctx, MyFloorDatabase::class.java).allowMainThreadQueries().build()
        repo = ParkingRepository(db, clock) { changes++ }
    }

    @After
    fun tearDown() = db.close()

    private suspend fun add(name: String): Vehicle =
        (repo.addVehicle(name) as AddVehicleResult.Added).vehicle

    @Test
    fun `차량은 최대 3대까지`() = runBlocking {
        add("아빠차"); add("엄마차"); add("캠핑카")
        assertEquals(AddVehicleResult.LimitReached, repo.addVehicle("넷째"))
        assertEquals(listOf("아빠차", "엄마차", "캠핑카"), repo.snapshot().map { it.vehicle.name })
    }

    @Test
    fun `빈 이름과 너무 긴 이름은 거부`() = runBlocking {
        assertEquals(AddVehicleResult.InvalidName, repo.addVehicle("  "))
        assertEquals(AddVehicleResult.InvalidName, repo.addVehicle("가".repeat(21)))
        assertEquals(0, repo.snapshot().size)
    }

    @Test
    fun `저장하면 현재 위치가 가장 최근 기록이 된다`() = runBlocking {
        val v = add("아빠차")
        repo.saveParking(v.id, "B2", null, SaveSource.APP)
        clock.advance(60)
        repo.saveParking(v.id, "B3", "C구역 12번", SaveSource.NOTIFICATION)

        val current = repo.vehiclesWithLocation.first().single().current
        assertEquals("B3", current?.floor)
        assertEquals("C구역 12번", current?.memo)
        assertEquals(SaveSource.NOTIFICATION, current?.source)
        assertEquals(listOf("B3", "B2"), repo.history(v.id).map { it.floor })
    }

    @Test
    fun `차량마다 최근 30개만 남긴다`() = runBlocking {
        val a = add("아빠차")
        val b = add("엄마차")
        repeat(35) { i ->
            clock.advance(60)
            repo.saveParking(a.id, if (i % 2 == 0) "B1" else "B2", "기록 $i", SaveSource.APP)
        }
        repo.saveParking(b.id, "B4", null, SaveSource.APP)

        val history = repo.history(a.id)
        assertEquals(30, history.size)
        assertEquals("기록 34", history.first().memo)
        assertEquals("기록 5", history.last().memo)
        assertEquals(1, repo.history(b.id).size)
    }

    @Test
    fun `잘못된 층이나 없는 차량은 저장하지 않는다`() = runBlocking {
        val v = add("아빠차")
        assertNull(repo.saveParking(v.id, "B99", null, SaveSource.APP))
        assertNull(repo.saveParking("없는차", "B1", null, SaveSource.APP))
        assertTrue(repo.history(v.id).isEmpty())
    }

    @Test
    fun `메모는 30자로 자르고 빈 메모는 없앤다`() = runBlocking {
        val v = add("아빠차")
        assertNull(repo.saveParking(v.id, "B1", "   ", SaveSource.APP)!!.memo)
        assertEquals(30, repo.saveParking(v.id, "B1", "가".repeat(50), SaveSource.APP)!!.memo!!.length)
    }

    @Test
    fun `차량을 지우면 기록도 지워진다`() = runBlocking {
        val v = add("아빠차")
        repo.saveParking(v.id, "B1", null, SaveSource.APP)
        repo.deleteVehicle(v.id)
        assertTrue(repo.snapshot().isEmpty())
        assertTrue(repo.history(v.id).isEmpty())
    }

    @Test
    fun `블루투스 기기 하나는 차량 하나에만`() = runBlocking {
        val a = add("아빠차")
        val b = add("엄마차")
        assertEquals(LinkBluetoothResult.Linked, repo.linkBluetooth(a.id, "AA:BB", "MY CAR"))
        assertEquals(LinkBluetoothResult.AlreadyLinked("아빠차"), repo.linkBluetooth(b.id, "AA:BB", "MY CAR"))
        // 같은 차량에 다시 연결하는 것은 괜찮다
        assertEquals(LinkBluetoothResult.Linked, repo.linkBluetooth(a.id, "AA:BB", "MY CAR"))
        assertEquals(a.id, repo.vehicleForBluetooth("AA:BB")?.id)

        repo.unlinkBluetooth(a.id)
        assertNull(repo.vehicleForBluetooth("AA:BB"))
        assertEquals(LinkBluetoothResult.Linked, repo.linkBluetooth(b.id, "AA:BB", "MY CAR"))
    }

    @Test
    fun `기록 하나 삭제와 전체 삭제`() = runBlocking {
        val v = add("아빠차")
        val r1 = repo.saveParking(v.id, "B1", null, SaveSource.APP)!!
        clock.advance(60)
        repo.saveParking(v.id, "B2", null, SaveSource.APP)
        repo.deleteRecord(r1.id)
        assertEquals(listOf("B2"), repo.history(v.id).map { it.floor })
        repo.clearHistory(v.id)
        assertTrue(repo.history(v.id).isEmpty())
        assertNull(repo.snapshot().single().current)
    }

    @Test
    fun `데이터가 바뀌면 화면 밖 갱신을 알린다`() = runBlocking {
        val before = changes
        val v = add("아빠차")
        repo.saveParking(v.id, "B1", null, SaveSource.APP)
        repo.renameVehicle(v.id, "새이름")
        assertEquals(before + 3, changes)
        assertNotNull(repo.vehicle(v.id))
        assertEquals("새이름", repo.vehicle(v.id)!!.name)
    }
}
