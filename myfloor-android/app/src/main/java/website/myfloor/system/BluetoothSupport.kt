package website.myfloor.system

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat
import androidx.core.content.IntentCompat
import kotlinx.coroutines.launch
import website.myfloor.container
import website.myfloor.domain.Floors

data class PairedDevice(val address: String, val name: String)

object BluetoothSupport {
    /** 안드로이드 12 이상에서 필요한 런타임 권한 (없으면 빈 배열) */
    val runtimePermissions: Array<String>
        get() = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            arrayOf(Manifest.permission.BLUETOOTH_CONNECT)
        } else {
            emptyArray()
        }

    fun hasPermission(context: Context): Boolean = runtimePermissions.all {
        ContextCompat.checkSelfPermission(context, it) == PackageManager.PERMISSION_GRANTED
    }

    fun isAvailable(context: Context): Boolean =
        context.getSystemService(BluetoothManager::class.java)?.adapter != null

    /** 이미 페어링된 기기 목록. 권한이 없거나 블루투스가 없으면 빈 목록. */
    @SuppressLint("MissingPermission")
    fun pairedDevices(context: Context): List<PairedDevice> {
        if (!hasPermission(context)) return emptyList()
        val adapter = context.getSystemService(BluetoothManager::class.java)?.adapter ?: return emptyList()
        return try {
            adapter.bondedDevices.orEmpty()
                .map { PairedDevice(it.address, it.name ?: it.address) }
                .sortedBy { it.name.lowercase() }
        } catch (e: SecurityException) {
            emptyList()
        }
    }
}

/**
 * 차에 연결된 블루투스가 끊기면(시동을 끄면) 주차 층을 묻는 알림을 보낸다.
 * ACL_DISCONNECTED 는 암시적 브로드캐스트 제한의 예외라서 앱이 꺼져 있어도 받는다.
 */
class BluetoothDisconnectReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != BluetoothDevice.ACTION_ACL_DISCONNECTED) return
        val device = IntentCompat.getParcelableExtra(intent, BluetoothDevice.EXTRA_DEVICE, BluetoothDevice::class.java)
            ?: return
        val address = try {
            device.address
        } catch (e: SecurityException) {
            return
        } ?: return

        val pending = goAsync()
        val container = context.container
        container.appScope.launch {
            try {
                handleDisconnect(context, address)
            } catch (e: Exception) {
                Log.w("BtDisconnect", "failed to handle disconnect", e)
            } finally {
                pending.finish()
            }
        }
    }

    companion object {
        /** 테스트에서도 쓰는 실제 처리. 알림을 보냈으면 true. */
        suspend fun handleDisconnect(context: Context, address: String): Boolean {
            val container = context.container
            val vehicle = container.parking.vehicleForBluetooth(address) ?: return false
            if (!vehicle.notifyOnDisconnect) return false
            val range = container.settings.current().floorRange
            val floors = Floors.suggestions(container.parking.history(vehicle.id), range)
            return ParkingNotifier.showParkingPrompt(context, vehicle, floors)
        }
    }
}
