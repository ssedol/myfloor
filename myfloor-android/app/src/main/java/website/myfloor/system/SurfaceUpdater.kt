package website.myfloor.system

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.service.quicksettings.TileService
import android.util.Log
import androidx.core.content.pm.ShortcutInfoCompat
import androidx.core.content.pm.ShortcutManagerCompat
import androidx.core.graphics.drawable.IconCompat
import androidx.glance.appwidget.updateAll
import website.myfloor.AppContainer
import website.myfloor.R
import website.myfloor.data.SaveSource
import website.myfloor.data.Vehicle
import website.myfloor.quicksave.QuickSaveActivity
import website.myfloor.widget.FloorWidget

/** 데이터가 바뀌면 앱 밖에서 보이는 곳(위젯, 바로가기, 빠른 설정 타일)을 갱신한다. */
object SurfaceUpdater {
    private const val TAG = "SurfaceUpdater"

    suspend fun refreshAll(context: Context, container: AppContainer) {
        runCatching { FloorWidget().updateAll(context) }
            .onFailure { Log.w(TAG, "widget update failed", it) }
        runCatching { updateShortcuts(context, container.parking.snapshot().map { it.vehicle }) }
            .onFailure { Log.w(TAG, "shortcut update failed", it) }
        runCatching {
            TileService.requestListeningState(context, ComponentName(context, FloorTileService::class.java))
        }.onFailure { Log.w(TAG, "tile update failed", it) }
    }

    /** 앱 아이콘을 길게 누르면 나오는 차량별 "층 저장" 바로가기 */
    fun updateShortcuts(context: Context, vehicles: List<Vehicle>) {
        val shortcuts = vehicles.take(ShortcutManagerCompat.getMaxShortcutCountPerActivity(context).coerceAtLeast(1))
            .mapIndexed { index, v ->
                val intent = QuickSaveActivity.intent(context, v.id, SaveSource.SHORTCUT)
                    .setAction(QuickSaveActivity.ACTION_QUICK_SAVE)
                    .setData(Uri.parse("myfloor://shortcut/${v.id}"))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                ShortcutInfoCompat.Builder(context, "vehicle_${v.id}")
                    .setShortLabel(context.getString(R.string.shortcut_short, v.name))
                    .setLongLabel(context.getString(R.string.shortcut_long, v.name))
                    .setIcon(IconCompat.createWithResource(context, R.drawable.ic_shortcut_parking))
                    .setRank(index)
                    .setIntent(intent)
                    .build()
            }
        val keepIds = shortcuts.map { it.id }.toSet()
        val stale = ShortcutManagerCompat.getDynamicShortcuts(context).map { it.id }.filter { it !in keepIds }
        if (stale.isNotEmpty()) ShortcutManagerCompat.removeDynamicShortcuts(context, stale)
        ShortcutManagerCompat.setDynamicShortcuts(context, shortcuts)
    }
}
