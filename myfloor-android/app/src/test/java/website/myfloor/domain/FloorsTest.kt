package website.myfloor.domain

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import website.myfloor.data.ParkingRecord
import website.myfloor.data.SaveSource
import java.time.Instant

class FloorsTest {

    @Test
    fun `기본 층 범위는 B1~B5`() {
        assertEquals(listOf("B1", "B2", "B3", "B4", "B5"), FloorRange.DEFAULT.floors)
    }

    @Test
    fun `지하 다음에 지상 층이 온다`() {
        assertEquals(listOf("B1", "B2", "1F", "2F", "3F"), FloorRange(2, 3).floors)
        assertEquals(listOf("1F"), FloorRange(0, 1).floors)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `층이 하나도 없으면 안 된다`() {
        FloorRange(0, 0)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `최대 10층을 넘을 수 없다`() {
        FloorRange(11, 0)
    }

    @Test
    fun `잘못 저장된 값은 안전한 범위로 맞춘다`() {
        assertEquals(FloorRange.DEFAULT, FloorRange.safe(0, 0))
        assertEquals(FloorRange(10, 0), FloorRange.safe(99, -3))
    }

    @Test
    fun `층 이름 검증`() {
        listOf("B1", "B10", "1F", "10F").forEach { assertTrue(it, Floors.isValid(it)) }
        listOf("", "B0", "B11", "0F", "11F", "b1", "B1 ", "3", "F1", "B01").forEach { assertFalse(it, Floors.isValid(it)) }
    }

    @Test
    fun `화면 낭독용 층 이름`() {
        assertEquals("지하 3층", Floors.spoken("B3"))
        assertEquals("지상 2층", Floors.spoken("2F"))
    }

    private fun rec(floor: String, minute: Long) = ParkingRecord(
        id = "$floor-$minute",
        vehicleId = "v",
        floor = floor,
        savedAt = Instant.ofEpochSecond(minute * 60),
        source = SaveSource.APP,
    )

    @Test
    fun `기록이 없으면 범위 앞쪽 층으로 채운다`() {
        assertEquals(listOf("B1", "B2", "B3"), Floors.suggestions(emptyList(), FloorRange.DEFAULT))
        assertEquals(listOf("B1", "1F", "2F"), Floors.suggestions(emptyList(), FloorRange(1, 5)))
    }

    @Test
    fun `가장 많이 쓴 층부터, 같으면 최근 층부터`() {
        val history = listOf(
            rec("B3", 1), rec("B3", 2), rec("B3", 3),
            rec("B2", 4), rec("B2", 5),
            rec("B5", 6),
            rec("B4", 7),
        )
        // B3(3회), B2(2회), 그다음 1회짜리 중 최근인 B4
        assertEquals(listOf("B3", "B2", "B4"), Floors.suggestions(history, FloorRange.DEFAULT))
    }

    @Test
    fun `기록이 부족하면 겹치지 않게 채운다`() {
        val history = listOf(rec("B2", 1))
        assertEquals(listOf("B2", "B1", "B3"), Floors.suggestions(history, FloorRange.DEFAULT))
    }

    @Test
    fun `층이 3개보다 적은 범위`() {
        assertEquals(listOf("B1", "B2"), Floors.suggestions(emptyList(), FloorRange(2, 0)))
    }

    @Test
    fun `이름과 메모 정리`() {
        assertEquals("아빠차", Limits.cleanName("  아빠차 "))
        assertNull(Limits.cleanName("   "))
        assertNull(Limits.cleanName("가".repeat(21)))
        assertEquals("가".repeat(20), Limits.cleanName("가".repeat(20)))
        assertNull(Limits.cleanMemo("  "))
        assertNull(Limits.cleanMemo(null))
        assertEquals(30, Limits.cleanMemo("가".repeat(40))!!.length)
    }
}
