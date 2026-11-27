package website.myfloor.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import website.myfloor.R
import website.myfloor.data.VehicleWithLocation
import website.myfloor.domain.Floors
import website.myfloor.domain.Limits
import website.myfloor.domain.TimeText
import website.myfloor.ui.components.FloorPicker
import website.myfloor.ui.components.VehicleNameDialog

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    vehicles: List<VehicleWithLocation>,
    floors: List<String>,
    snackbar: SnackbarHostState,
    showWidgetTip: Boolean,
    onSaveFloor: (vehicleId: String, floor: String, memo: String?) -> Unit,
    onAddVehicle: (String) -> Unit,
    onOpenVehicle: (String) -> Unit,
    onOpenSettings: () -> Unit,
    onAddWidget: () -> Unit,
    onDismissWidgetTip: () -> Unit,
    bottomBar: @Composable () -> Unit = {},
) {
    var pickerFor by rememberSaveable { mutableStateOf<String?>(null) }
    var adding by rememberSaveable { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.app_name), fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onOpenSettings, modifier = Modifier.testTag("open_settings")) {
                        Icon(Icons.Default.Settings, contentDescription = stringResource(R.string.settings_title))
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
        bottomBar = { Box(Modifier.navigationBarsPadding()) { bottomBar() } },
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            if (vehicles.isEmpty()) {
                item { EmptyVehicles(onAdd = { adding = true }) }
            }
            items(vehicles, key = { it.vehicle.id }) { item ->
                VehicleCard(
                    item = item,
                    onFloorClick = { pickerFor = item.vehicle.id },
                    onOpen = { onOpenVehicle(item.vehicle.id) },
                )
            }
            if (vehicles.isNotEmpty() && vehicles.size < Limits.MAX_VEHICLES) {
                item {
                    OutlinedButton(
                        onClick = { adding = true },
                        modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp).testTag("add_vehicle"),
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null)
                        Spacer(Modifier.padding(4.dp))
                        Text(stringResource(R.string.home_add_vehicle, vehicles.size, Limits.MAX_VEHICLES))
                    }
                }
            }
            if (showWidgetTip && vehicles.isNotEmpty()) {
                item { WidgetTip(onAddWidget = onAddWidget, onDismiss = onDismissWidgetTip) }
            }
        }
    }

    pickerFor?.let { id ->
        val target = vehicles.firstOrNull { it.vehicle.id == id }
        if (target == null) {
            pickerFor = null
        } else {
            ModalBottomSheet(
                onDismissRequest = { pickerFor = null },
                sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
            ) {
                Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 24.dp)) {
                    Text(
                        stringResource(R.string.picker_title, target.vehicle.name),
                        style = MaterialTheme.typography.titleLarge,
                    )
                    Spacer(Modifier.height(16.dp))
                    FloorPicker(
                        floors = floors,
                        current = target.current?.floor,
                        onSave = { floor, memo ->
                            onSaveFloor(id, floor, memo)
                            pickerFor = null
                        },
                    )
                }
            }
        }
    }

    if (adding) {
        VehicleNameDialog(
            title = stringResource(R.string.vehicle_add_title),
            confirmLabel = stringResource(R.string.add),
            onConfirm = {
                onAddVehicle(it)
                adding = false
            },
            onDismiss = { adding = false },
        )
    }
}

@Composable
fun VehicleCard(item: VehicleWithLocation, onFloorClick: () -> Unit, onOpen: () -> Unit) {
    val v = item.vehicle
    val r = item.current
    val memoText = r?.memo?.let { stringResource(R.string.a11y_memo, it) }
    val spoken = if (r == null) {
        stringResource(R.string.a11y_vehicle_empty, v.name)
    } else {
        stringResource(R.string.a11y_vehicle, v.name, Floors.spoken(r.floor), TimeText.format(r.savedAt)) +
            (memoText?.let { ". $it" } ?: "")
    }
    Card(
        modifier = Modifier.fillMaxWidth().testTag("vehicle_card_${v.name}"),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerHigh),
    ) {
        Column(Modifier.clickable(onClick = onOpen).padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    v.name,
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.weight(1f),
                )
                if (v.btDeviceAddress != null) {
                    Text(
                        stringResource(R.string.home_bt_badge),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            }
            Spacer(Modifier.height(8.dp))
            // 층 영역을 탭하면 층 선택 시트가 열린다.
            Column(
                Modifier
                    .fillMaxWidth()
                    .clickable(onClick = onFloorClick)
                    .semantics { contentDescription = spoken }
                    .testTag("floor_area_${v.name}")
                    .padding(vertical = 4.dp),
            ) {
                Text(
                    r?.floor ?: stringResource(R.string.home_no_floor),
                    fontSize = if (r == null) 22.sp else 64.sp,
                    fontWeight = FontWeight.Black,
                    color = if (r == null) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.primary,
                    modifier = Modifier.clearAndSetSemantics { },
                )
                if (r?.memo != null) {
                    Text(r.memo, style = MaterialTheme.typography.titleMedium, modifier = Modifier.clearAndSetSemantics { })
                }
                Text(
                    if (r == null) stringResource(R.string.home_tap_to_save)
                    else stringResource(R.string.home_saved_at, TimeText.format(r.savedAt)),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.clearAndSetSemantics { },
                )
            }
        }
    }
}

@Composable
private fun EmptyVehicles(onAdd: () -> Unit) {
    Column(
        Modifier.fillMaxWidth().padding(vertical = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(stringResource(R.string.home_empty_title), style = MaterialTheme.typography.titleLarge, textAlign = TextAlign.Center)
        Spacer(Modifier.height(8.dp))
        Text(
            stringResource(R.string.home_empty_desc),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
        Spacer(Modifier.height(20.dp))
        FilledTonalButton(onClick = onAdd, modifier = Modifier.heightIn(min = 52.dp).testTag("add_first_vehicle")) {
            Icon(Icons.Default.Add, contentDescription = null)
            Spacer(Modifier.padding(4.dp))
            Text(stringResource(R.string.vehicle_add_title))
        }
    }
}

@Composable
private fun WidgetTip(onAddWidget: () -> Unit, onDismiss: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerHighest),
    ) {
        Row(Modifier.padding(start = 16.dp, top = 8.dp, bottom = 8.dp, end = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(stringResource(R.string.widget_tip_title), style = MaterialTheme.typography.titleSmall)
                Text(
                    stringResource(R.string.widget_tip_desc),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Button(onClick = onAddWidget, modifier = Modifier.padding(top = 8.dp).testTag("add_widget")) {
                    Text(stringResource(R.string.widget_tip_add))
                }
            }
            IconButton(onClick = onDismiss) {
                Icon(Icons.Default.Close, contentDescription = stringResource(R.string.close))
            }
        }
    }
}
