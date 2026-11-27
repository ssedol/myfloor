package website.myfloor.system

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Intent
import android.os.Build
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import website.myfloor.R
import website.myfloor.container
import website.myfloor.data.SaveSource
import website.myfloor.quicksave.QuickSaveActivity

/** 상단 알림창의 "몇층" 타일. 탭하면 층 선택 팝업이 뜬다. */
class FloorTileService : TileService() {
    private var scope: CoroutineScope? = null

    override fun onStartListening() {
        super.onStartListening()
        val s = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate).also { scope = it }
        s.launch {
            val first = container.parking.snapshot().firstOrNull()
            val tile = qsTile ?: return@launch
            tile.label = getString(R.string.tile_label)
            tile.state = Tile.STATE_INACTIVE
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                tile.subtitle = when {
                    first == null -> getString(R.string.tile_no_vehicle)
                    first.current == null -> getString(R.string.tile_subtitle_empty, first.vehicle.name)
                    else -> getString(R.string.tile_subtitle, first.vehicle.name, first.current.floor)
                }
            }
            tile.updateTile()
        }
    }

    override fun onStopListening() {
        scope?.cancel()
        scope = null
        super.onStopListening()
    }

    @SuppressLint("StartActivityAndCollapseDeprecated")
    override fun onClick() {
        super.onClick()
        val intent = QuickSaveActivity.intent(this, vehicleId = null, source = SaveSource.TILE)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startActivityAndCollapse(
                PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT),
            )
        } else {
            @Suppress("DEPRECATION")
            startActivityAndCollapse(intent)
        }
    }
}
