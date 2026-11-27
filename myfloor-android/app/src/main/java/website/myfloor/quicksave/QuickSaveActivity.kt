package website.myfloor.quicksave

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import kotlinx.coroutines.launch
import website.myfloor.R
import website.myfloor.container
import website.myfloor.data.SaveSource
import website.myfloor.data.Settings
import website.myfloor.data.VehicleWithLocation
import website.myfloor.domain.TimeText
import website.myfloor.system.ParkingNotifier
import website.myfloor.ui.MainActivity
import website.myfloor.ui.components.FloorPicker
import website.myfloor.ui.components.VehicleChoice
import website.myfloor.ui.theme.MyFloorTheme

/**
 * 위젯, 알림, 빠른 설정 타일, 앱 아이콘 바로가기가 공통으로 여는 층 선택 팝업.
 * 메인 화면을 열지 않고 투명한 배경 위에 대화상자만 띄운다.
 * 외부에서 열 수 있지만(바로가기 때문), 사용자가 직접 층을 탭해야만 저장된다.
 */
class QuickSaveActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val requestedVehicle = intent.getStringExtra(EXTRA_VEHICLE_ID)?.takeIf { it.length in 1..64 }
        val source = intent.getStringExtra(EXTRA_SOURCE)
            ?.let { s -> SaveSource.entries.firstOrNull { it.name == s } }
            ?: SaveSource.POPUP_WIDGET

        setContent {
            val data by produceState<Pair<List<VehicleWithLocation>, Settings>?>(null) {
                value = container.parking.snapshot() to container.settings.current()
            }
            val loaded = data ?: return@setContent
            val (vehicles, settings) = loaded
            MyFloorTheme(themeMode = settings.themeMode) {
                if (vehicles.isEmpty()) {
                    LaunchedEffect(Unit) { openApp() }
                    return@MyFloorTheme
                }
                QuickSaveDialog(
                    vehicles = vehicles,
                    floors = settings.floorRange.floors,
                    initialVehicleId = requestedVehicle?.takeIf { id -> vehicles.any { it.vehicle.id == id } }
                        ?: vehicles.singleOrNull()?.vehicle?.id,
                    onSave = { vehicleId, floor, memo -> save(vehicleId, floor, memo, source) },
                    onDismiss = { finish() },
                )
            }
        }
    }

    private suspend fun save(vehicleId: String, floor: String, memo: String?, source: SaveSource): Boolean {
        val vehicle = container.parking.vehicle(vehicleId) ?: return false
        val record = container.parking.saveParking(vehicleId, floor, memo, source) ?: return false
        ParkingNotifier.cancel(this, vehicleId)
        val text = if (record.memo != null) {
            getString(R.string.saved_toast_memo, vehicle.name, floor, record.memo)
        } else {
            getString(R.string.saved_toast, vehicle.name, floor)
        }
        Toast.makeText(applicationContext, text, Toast.LENGTH_SHORT).show()
        finish()
        return true
    }

    private fun openApp() {
        startActivity(Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        finish()
    }

    companion object {
        const val ACTION_QUICK_SAVE = "website.myfloor.action.QUICK_SAVE"
        const val EXTRA_VEHICLE_ID = "vehicleId"
        const val EXTRA_SOURCE = "source"

        fun intent(context: Context, vehicleId: String?, source: SaveSource): Intent =
            Intent(context, QuickSaveActivity::class.java)
                .setAction(ACTION_QUICK_SAVE)
                .putExtra(EXTRA_SOURCE, source.name)
                .apply { if (vehicleId != null) putExtra(EXTRA_VEHICLE_ID, vehicleId) }
    }
}

@Composable
fun QuickSaveDialog(
    vehicles: List<VehicleWithLocation>,
    floors: List<String>,
    initialVehicleId: String?,
    onSave: suspend (vehicleId: String, floor: String, memo: String?) -> Boolean,
    onDismiss: () -> Unit,
) {
    var vehicleId by rememberSaveable { mutableStateOf(initialVehicleId) }
    val scope = rememberCoroutineScope()
    val haptic = LocalHapticFeedback.current

    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = MaterialTheme.shapes.extraLarge, tonalElevation = 6.dp, modifier = Modifier.testTag("quick_save")) {
            Column(
                Modifier
                    .verticalScroll(rememberScrollState())
                    .padding(24.dp),
            ) {
                val selected = vehicles.firstOrNull { it.vehicle.id == vehicleId }
                if (selected == null) {
                    Text(stringResource(R.string.quick_pick_vehicle), style = MaterialTheme.typography.titleLarge)
                    Spacer(Modifier.height(16.dp))
                    VehicleChoice(
                        names = vehicles.map { it.vehicle.id to it.vehicle.name },
                        subtitles = vehicles.associate { v ->
                            v.vehicle.id to (v.current?.let { "${it.floor} · ${TimeText.format(it.savedAt)}" } ?: "")
                        }.filterValues { it.isNotEmpty() },
                        onPick = { vehicleId = it },
                    )
                } else {
                    Text(
                        stringResource(R.string.picker_title, selected.vehicle.name),
                        style = MaterialTheme.typography.titleLarge,
                    )
                    selected.current?.let {
                        Text(
                            stringResource(R.string.quick_current, it.floor, TimeText.format(it.savedAt)),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Spacer(Modifier.height(16.dp))
                    FloorPicker(
                        floors = floors,
                        current = selected.current?.floor,
                        onSave = { floor, memo ->
                            haptic.performHapticFeedback(HapticFeedbackType.Confirm)
                            scope.launch { onSave(selected.vehicle.id, floor, memo) }
                        },
                    )
                    if (vehicles.size > 1) {
                        TextButton(onClick = { vehicleId = null }, modifier = Modifier.fillMaxWidth()) {
                            Text(stringResource(R.string.quick_other_vehicle))
                        }
                    }
                }
                TextButton(onClick = onDismiss, modifier = Modifier.fillMaxWidth().testTag("quick_cancel")) {
                    Text(stringResource(R.string.cancel))
                }
            }
        }
    }
}
