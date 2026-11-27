package website.myfloor

import android.Manifest
import android.os.Build
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.By
import androidx.test.uiautomator.UiDevice
import androidx.test.uiautomator.Until
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import website.myfloor.data.AddVehicleResult
import website.myfloor.data.SaveSource
import website.myfloor.system.BluetoothDisconnectReceiver

/**
 * 실제 기기/에뮬레이터에서: 블루투스 끊김 처리 → 시스템 알림 → 알림의 층 버튼 탭 → 저장.
 * (ACL_DISCONNECTED 는 시스템만 보낼 수 있어 수신 이후 처리부터 검증한다.)
 */
@RunWith(AndroidJUnit4::class)
class NotificationE2ETest {
    private val instrumentation = InstrumentationRegistry.getInstrumentation()
    private val context = instrumentation.targetContext
    private val device = UiDevice.getInstance(instrumentation)
    private val address = "00:11:22:33:44:55"
    private var vehicleId: String? = null

    @Before
    fun setUp() = runBlocking {
        if (Build.VERSION.SDK_INT >= 33) {
            instrumentation.uiAutomation.grantRuntimePermission(context.packageName, Manifest.permission.POST_NOTIFICATIONS)
        }
        val added = context.container.parking.addVehicle("E2E") as AddVehicleResult.Added
        vehicleId = added.vehicle.id
        context.container.parking.linkBluetooth(added.vehicle.id, address, "E2E CAR")
        // 기록 기준 추천이 맞는지 보려고 B4를 두 번 저장해둔다.
        repeat(2) { context.container.parking.saveParking(added.vehicle.id, "B4", null, SaveSource.APP) }
    }

    @After
    fun tearDown() {
        runBlocking { vehicleId?.let { context.container.parking.deleteVehicle(it) } }
        device.pressHome()
    }

    @Test
    fun disconnectNotificationSavesFloorFromActionButton() = runBlocking {
        assertTrue(BluetoothDisconnectReceiver.handleDisconnect(context, address))

        device.openNotification()
        val title = device.wait(Until.findObject(By.text("E2E, 몇 층에 주차하셨나요?")), 5_000)
        assertNotNull("알림이 보이지 않음", title)

        // 알림을 펼쳐 버튼이 보이게 한다.
        val b4 = device.wait(Until.findObject(By.text("B4")), 3_000)
            ?: run {
                title.swipe(androidx.test.uiautomator.Direction.DOWN, 0.8f)
                device.wait(Until.findObject(By.text("B4")), 3_000)
            }
        assertNotNull("층 버튼(B4)이 보이지 않음", b4)
        // 기록 기준 첫 번째 추천은 B4, 나머지는 B1, B2
        assertNotNull(device.findObject(By.text("B1")))
        assertNotNull(device.findObject(By.text("B2")))

        device.findObject(By.text("B2")).click()

        // 저장되고 알림이 사라질 때까지 기다린다.
        var saved: String? = null
        for (i in 0 until 20) {
            saved = context.container.parking.history(vehicleId!!).first().floor
            if (saved == "B2") break
            Thread.sleep(250)
        }
        assertEquals("B2", saved)
        assertEquals(SaveSource.NOTIFICATION, context.container.parking.history(vehicleId!!).first().source)
        assertTrue(device.wait(Until.gone(By.text("E2E, 몇 층에 주차하셨나요?")), 5_000))
    }
}
