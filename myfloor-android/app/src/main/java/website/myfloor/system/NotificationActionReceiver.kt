package website.myfloor.system

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import kotlinx.coroutines.launch
import website.myfloor.R
import website.myfloor.container
import website.myfloor.data.SaveSource

/** 알림의 층 버튼을 누르면 바로 저장한다. (외부에 공개하지 않는 리시버) */
class NotificationActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != ACTION_SAVE) return
        val vehicleId = intent.getStringExtra(EXTRA_VEHICLE_ID) ?: return
        val floor = intent.getStringExtra(EXTRA_FLOOR) ?: return
        val pending = goAsync()
        context.container.appScope.launch {
            try {
                save(context, vehicleId, floor)
            } catch (e: Exception) {
                Log.w("NotifAction", "save failed", e)
            } finally {
                pending.finish()
            }
        }
    }

    companion object {
        const val ACTION_SAVE = "website.myfloor.action.SAVE_FROM_NOTIFICATION"
        const val EXTRA_VEHICLE_ID = "vehicleId"
        const val EXTRA_FLOOR = "floor"

        fun saveIntent(context: Context, vehicleId: String, floor: String): Intent =
            Intent(context, NotificationActionReceiver::class.java)
                .setAction(ACTION_SAVE)
                .putExtra(EXTRA_VEHICLE_ID, vehicleId)
                .putExtra(EXTRA_FLOOR, floor)

        suspend fun save(context: Context, vehicleId: String, floor: String): Boolean {
            val container = context.container
            val vehicle = container.parking.vehicle(vehicleId)
            val record = container.parking.saveParking(vehicleId, floor, memo = null, source = SaveSource.NOTIFICATION)
            ParkingNotifier.cancel(context, vehicleId)
            if (record != null && vehicle != null) {
                val message = context.getString(R.string.saved_toast, vehicle.name, floor)
                Handler(Looper.getMainLooper()).post {
                    Toast.makeText(context.applicationContext, message, Toast.LENGTH_SHORT).show()
                }
            }
            return record != null
        }
    }
}
