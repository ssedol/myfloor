package website.myfloor.system

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import website.myfloor.R
import website.myfloor.data.SaveSource
import website.myfloor.data.Vehicle
import website.myfloor.quicksave.QuickSaveActivity

/** 블루투스가 끊겼을 때 "몇 층에 주차하셨나요?" 알림 */
object ParkingNotifier {
    const val CHANNEL_ID = "parking_prompt"

    fun createChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val channel = NotificationChannel(
            CHANNEL_ID,
            context.getString(R.string.notif_channel_name),
            NotificationManager.IMPORTANCE_HIGH,
        ).apply { description = context.getString(R.string.notif_channel_desc) }
        context.getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }

    fun notificationId(vehicleId: String): Int = vehicleId.hashCode()

    fun canNotify(context: Context): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) !=
            PackageManager.PERMISSION_GRANTED
        ) {
            return false
        }
        return NotificationManagerCompat.from(context).areNotificationsEnabled()
    }

    /** 알림을 보냈으면 true */
    fun showParkingPrompt(context: Context, vehicle: Vehicle, floors: List<String>): Boolean {
        if (!canNotify(context)) return false
        val id = notificationId(vehicle.id)

        val open = PendingIntent.getActivity(
            context,
            id,
            QuickSaveActivity.intent(context, vehicle.id, SaveSource.NOTIFICATION)
                .setData(Uri.parse("myfloor://notification/${vehicle.id}"))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_parking)
            .setContentTitle(context.getString(R.string.notif_title, vehicle.name))
            .setContentText(context.getString(R.string.notif_text))
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(open)
            .setAutoCancel(true)
            .setOnlyAlertOnce(false)

        floors.take(3).forEach { floor ->
            val save = PendingIntent.getBroadcast(
                context,
                (vehicle.id + floor).hashCode(),
                NotificationActionReceiver.saveIntent(context, vehicle.id, floor),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
            )
            builder.addAction(
                NotificationCompat.Action.Builder(null, floor, save)
                    .setContextual(false)
                    .build(),
            )
        }
        @Suppress("MissingPermission") // canNotify 에서 확인함
        NotificationManagerCompat.from(context).notify(id, builder.build())
        return true
    }

    fun cancel(context: Context, vehicleId: String) {
        NotificationManagerCompat.from(context).cancel(notificationId(vehicleId))
    }
}
