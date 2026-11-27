package website.myfloor.ui.screens

import android.content.Intent
import android.provider.Settings
import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import website.myfloor.R
import website.myfloor.data.ParkingRecord
import website.myfloor.data.Vehicle
import website.myfloor.domain.Limits
import website.myfloor.domain.TimeText
import website.myfloor.ui.components.ConfirmDialog
import website.myfloor.ui.components.FloorPicker
import website.myfloor.ui.components.VehicleNameDialog

/** 블루투스 알림 상태 (화면 밖 권한 상태에서 계산) */
data class NotifyStatus(val notificationsAllowed: Boolean, val bluetoothAllowed: Boolean)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VehicleDetailScreen(
    vehicle: Vehicle,
    history: List<ParkingRecord>,
    floors: List<String>,
    notifyStatus: NotifyStatus,
    snackbar: SnackbarHostState,
    onBack: () -> Unit,
    onSaveFloor: (floor: String, memo: String?) -> Unit,
    onRename: (String) -> Unit,
    onLinkBluetooth: () -> Unit,
    onUnlinkBluetooth: () -> Unit,
    onSetNotify: (Boolean) -> Unit,
    onDeleteRecord: (String) -> Unit,
    onClearHistory: () -> Unit,
    onDeleteVehicle: () -> Unit,
) {
    var picker by rememberSaveable { mutableStateOf(false) }
    var renaming by rememberSaveable { mutableStateOf(false) }
    var confirmDelete by rememberSaveable { mutableStateOf(false) }
    var confirmClear by rememberSaveable { mutableStateOf(false) }
    val current = history.firstOrNull()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(vehicle.name) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = stringResource(R.string.back))
                    }
                },
                actions = {
                    IconButton(onClick = { renaming = true }, modifier = Modifier.testTag("rename_vehicle")) {
                        Icon(Icons.Default.Edit, contentDescription = stringResource(R.string.vehicle_rename_title))
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item {
                Card(
                    Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerHigh),
                ) {
                    Column(Modifier.padding(20.dp)) {
                        Text(stringResource(R.string.detail_current), style = MaterialTheme.typography.labelLarge)
                        Text(
                            current?.floor ?: stringResource(R.string.home_no_floor),
                            fontSize = if (current == null) 22.sp else 56.sp,
                            fontWeight = FontWeight.Black,
                            color = if (current == null) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.primary,
                        )
                        current?.memo?.let { Text(it, style = MaterialTheme.typography.titleMedium) }
                        current?.let {
                            Text(
                                stringResource(R.string.home_saved_at, TimeText.format(it.savedAt)),
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        Spacer(Modifier.height(12.dp))
                        Button(
                            onClick = { picker = true },
                            modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp).testTag("detail_save_floor"),
                        ) { Text(stringResource(R.string.detail_save_floor)) }
                    }
                }
            }

            item {
                BluetoothSection(
                    vehicle = vehicle,
                    status = notifyStatus,
                    onLink = onLinkBluetooth,
                    onUnlink = onUnlinkBluetooth,
                    onSetNotify = onSetNotify,
                )
            }

            item {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 8.dp)) {
                    Text(
                        stringResource(R.string.detail_history, history.size, Limits.HISTORY_PER_VEHICLE),
                        style = MaterialTheme.typography.titleMedium,
                        modifier = Modifier.weight(1f),
                    )
                    if (history.isNotEmpty()) {
                        TextButton(onClick = { confirmClear = true }, modifier = Modifier.testTag("clear_history")) {
                            Text(stringResource(R.string.detail_clear_history))
                        }
                    }
                }
            }
            if (history.isEmpty()) {
                item {
                    Text(
                        stringResource(R.string.detail_history_empty),
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            } else {
                item {
                    Text(
                        stringResource(R.string.detail_swipe_hint),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            items(history, key = { it.id }) { record ->
                HistoryRow(record, onDelete = { onDeleteRecord(record.id) })
            }

            item {
                Spacer(Modifier.height(24.dp))
                OutlinedButton(
                    onClick = { confirmDelete = true },
                    modifier = Modifier.fillMaxWidth().testTag("delete_vehicle"),
                ) {
                    Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                    Spacer(Modifier.width(8.dp))
                    Text(stringResource(R.string.detail_delete_vehicle), color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }

    if (picker) {
        ModalBottomSheet(
            onDismissRequest = { picker = false },
            sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
        ) {
            Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 24.dp)) {
                Text(stringResource(R.string.picker_title, vehicle.name), style = MaterialTheme.typography.titleLarge)
                Spacer(Modifier.height(16.dp))
                FloorPicker(
                    floors = floors,
                    current = current?.floor,
                    onSave = { f, m ->
                        onSaveFloor(f, m)
                        picker = false
                    },
                )
            }
        }
    }
    if (renaming) {
        VehicleNameDialog(
            title = stringResource(R.string.vehicle_rename_title),
            initial = vehicle.name,
            confirmLabel = stringResource(R.string.save),
            onConfirm = {
                onRename(it)
                renaming = false
            },
            onDismiss = { renaming = false },
        )
    }
    if (confirmDelete) {
        ConfirmDialog(
            title = stringResource(R.string.detail_delete_title, vehicle.name),
            message = stringResource(R.string.detail_delete_message),
            confirmLabel = stringResource(R.string.delete),
            onConfirm = {
                confirmDelete = false
                onDeleteVehicle()
            },
            onDismiss = { confirmDelete = false },
        )
    }
    if (confirmClear) {
        ConfirmDialog(
            title = stringResource(R.string.detail_clear_title),
            message = stringResource(R.string.detail_clear_message, vehicle.name),
            confirmLabel = stringResource(R.string.delete),
            onConfirm = {
                confirmClear = false
                onClearHistory()
            },
            onDismiss = { confirmClear = false },
        )
    }
}

@Composable
private fun BluetoothSection(
    vehicle: Vehicle,
    status: NotifyStatus,
    onLink: () -> Unit,
    onUnlink: () -> Unit,
    onSetNotify: (Boolean) -> Unit,
) {
    val context = LocalContext.current
    Card(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(stringResource(R.string.bt_section_title), style = MaterialTheme.typography.titleMedium)
            if (vehicle.btDeviceAddress == null) {
                Text(stringResource(R.string.bt_section_desc), style = MaterialTheme.typography.bodyMedium)
                Button(onClick = onLink, modifier = Modifier.testTag("bt_link")) {
                    Text(stringResource(R.string.bt_link))
                }
            } else {
                Text(
                    stringResource(R.string.bt_linked_to, vehicle.btDeviceName ?: vehicle.btDeviceAddress),
                    style = MaterialTheme.typography.bodyMedium,
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(stringResource(R.string.bt_notify_toggle), modifier = Modifier.weight(1f))
                    Switch(
                        checked = vehicle.notifyOnDisconnect,
                        onCheckedChange = onSetNotify,
                        modifier = Modifier.testTag("bt_notify_switch"),
                    )
                }
                if (!status.bluetoothAllowed || !status.notificationsAllowed) {
                    Surface(color = MaterialTheme.colorScheme.errorContainer, shape = MaterialTheme.shapes.medium) {
                        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = MaterialTheme.colorScheme.onErrorContainer)
                            Spacer(Modifier.width(8.dp))
                            Column(Modifier.weight(1f)) {
                                Text(
                                    stringResource(
                                        if (!status.bluetoothAllowed) R.string.bt_need_bt_permission else R.string.bt_need_notification,
                                    ),
                                    color = MaterialTheme.colorScheme.onErrorContainer,
                                    style = MaterialTheme.typography.bodyMedium,
                                )
                                TextButton(onClick = {
                                    val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                                        .setData(android.net.Uri.fromParts("package", context.packageName, null))
                                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                    context.startActivity(intent)
                                }) { Text(stringResource(R.string.open_settings)) }
                            }
                        }
                    }
                }
                Row {
                    TextButton(onClick = onLink) { Text(stringResource(R.string.bt_change)) }
                    TextButton(onClick = onUnlink, modifier = Modifier.testTag("bt_unlink")) { Text(stringResource(R.string.bt_unlink)) }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun HistoryRow(record: ParkingRecord, onDelete: () -> Unit) {
    val state = rememberSwipeToDismissBoxState()
    val deleteLabel = stringResource(R.string.delete)
    SwipeToDismissBox(
        state = state,
        enableDismissFromStartToEnd = false,
        onDismiss = { if (it == SwipeToDismissBoxValue.EndToStart) onDelete() },
        backgroundContent = {
            Box(
                Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.errorContainer, MaterialTheme.shapes.medium)
                    .padding(horizontal = 20.dp),
                contentAlignment = Alignment.CenterEnd,
            ) {
                Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.onErrorContainer)
            }
        },
        modifier = Modifier.semantics {
            customActions = listOf(CustomAccessibilityAction(deleteLabel) { onDelete(); true })
        },
    ) {
        Surface(
            color = MaterialTheme.colorScheme.surface,
            shape = MaterialTheme.shapes.medium,
            tonalElevation = 1.dp,
        ) {
            Column {
                Row(
                    Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        record.floor,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.width(64.dp),
                    )
                    Column(Modifier.weight(1f)) {
                        Text(TimeText.format(record.savedAt), style = MaterialTheme.typography.bodyMedium)
                        record.memo?.let {
                            Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f))
            }
        }
    }
}
