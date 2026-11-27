package website.myfloor.system

import android.Manifest
import android.app.Application
import android.app.NotificationManager
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Shadows.shadowOf
import website.myfloor.container
import website.myfloor.data.AddVehicleResult
import website.myfloor.data.SaveSource

/** 블루투스 끊김 → 알림 → 알림 버튼으로 저장 흐름 */
@RunWith(AndroidJUnit4::class)
class NotificationFlowTest {
    private val app = ApplicationProvider.getApplicationContext<Application>()
    private val nm get() = app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    @Before
    fun setUp() {
        shadowOf(app).grantPermissions(Manifest.permission.POST_NOTIFICATIONS, Manifest.permission.BLUETOOTH_CONNECT)
    }

    @After
    fun tearDown() {
        app.container.database.close()
    }

    private suspend fun vehicleWithBt(name: String, address: String): String {
        val v = (app.container.parking.addVehicle(name) as AddVehicleResult.Added).vehicle
        app.container.parking.linkBluetooth(v.id, address, "$name 블루투스")
        return v.id
    }

    @Test
    fun `연결한 기기가 끊기면 자주 쓴 층 버튼 3개로 알림`() = runBlocking {
        val id = vehicleWithBt("아빠차", "11:22:33:44:55:66")
        repeat(3) { app.container.parking.saveParking(id, "B4", null, SaveSource.APP) }

        assertTrue(BluetoothDisconnectReceiver.handleDisconnect(app, "11:22:33:44:55:66"))

        val posted = shadowOf(nm).allNotifications.single()
        assertEquals("아빠차, 몇 층에 주차하셨나요?", shadowOf(posted).contentTitle.toString())
        assertEquals(listOf("B4", "B1", "B2"), posted.actions.map { it.title.toString() })
    }

    @Test
    fun `모르는 기기나 알림을 끈 차량은 알림 없음`() = runBlocking {
        val id = vehicleWithBt("엄마차", "AA:AA:AA:AA:AA:AA")
        assertFalse(BluetoothDisconnectReceiver.handleDisconnect(app, "BB:BB:BB:BB:BB:BB"))

        app.container.parking.setNotifyOnDisconnect(id, false)
        assertFalse(BluetoothDisconnectReceiver.handleDisconnect(app, "AA:AA:AA:AA:AA:AA"))
        assertTrue(shadowOf(nm).allNotifications.isEmpty())
    }

    @Test
    fun `알림 권한이 없으면 보내지 않는다`() = runBlocking {
        shadowOf(app).denyPermissions(Manifest.permission.POST_NOTIFICATIONS)
        vehicleWithBt("아빠차", "11:22:33:44:55:66")
        assertFalse(BluetoothDisconnectReceiver.handleDisconnect(app, "11:22:33:44:55:66"))
    }

    @Test
    fun `알림의 층 버튼을 누르면 저장되고 알림이 닫힌다`() = runBlocking {
        val id = vehicleWithBt("아빠차", "11:22:33:44:55:66")
        BluetoothDisconnectReceiver.handleDisconnect(app, "11:22:33:44:55:66")
        assertEquals(1, shadowOf(nm).allNotifications.size)

        assertTrue(NotificationActionReceiver.save(app, id, "B2"))

        val current = app.container.parking.snapshot().single().current
        assertEquals("B2", current?.floor)
        assertEquals(SaveSource.NOTIFICATION, current?.source)
        assertTrue(shadowOf(nm).allNotifications.isEmpty())
    }

    @Test
    fun `잘못된 층 값이 들어오면 저장하지 않는다`() = runBlocking {
        val id = vehicleWithBt("아빠차", "11:22:33:44:55:66")
        assertFalse(NotificationActionReceiver.save(app, id, "B99'; DROP"))
        assertEquals(null, app.container.parking.snapshot().single().current)
    }
}
