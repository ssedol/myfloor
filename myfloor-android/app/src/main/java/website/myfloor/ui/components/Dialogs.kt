package website.myfloor.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import website.myfloor.R
import website.myfloor.domain.FloorRange
import website.myfloor.domain.Limits
import website.myfloor.system.PairedDevice

@Composable
fun VehicleNameDialog(
    title: String,
    initial: String = "",
    confirmLabel: String,
    onConfirm: (String) -> Unit,
    onDismiss: () -> Unit,
) {
    var name by rememberSaveable { mutableStateOf(initial) }
    val valid = Limits.cleanName(name) != null
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it.take(Limits.MAX_NAME_LENGTH) },
                singleLine = true,
                label = { Text(stringResource(R.string.vehicle_name_label)) },
                placeholder = { Text(stringResource(R.string.vehicle_name_hint)) },
                supportingText = { Text("${name.length}/${Limits.MAX_NAME_LENGTH}") },
                modifier = Modifier.fillMaxWidth().testTag("vehicle_name_field"),
            )
        },
        confirmButton = {
            TextButton(
                onClick = { onConfirm(name) },
                enabled = valid,
                modifier = Modifier.testTag("vehicle_name_confirm"),
            ) { Text(confirmLabel) }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text(stringResource(R.string.cancel)) } },
    )
}

@Composable
fun ConfirmDialog(
    title: String,
    message: String,
    confirmLabel: String,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = { Text(message) },
        confirmButton = {
            TextButton(onClick = onConfirm, modifier = Modifier.testTag("confirm_ok")) {
                Text(confirmLabel, color = MaterialTheme.colorScheme.error)
            }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text(stringResource(R.string.cancel)) } },
    )
}

@Composable
fun BluetoothDevicePickerDialog(
    devices: List<PairedDevice>,
    onPick: (PairedDevice) -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(stringResource(R.string.bt_pick_title)) },
        text = {
            if (devices.isEmpty()) {
                Text(stringResource(R.string.bt_pick_empty))
            } else {
                Column {
                    Text(
                        stringResource(R.string.bt_pick_desc),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    LazyColumn(Modifier.heightIn(max = 320.dp).padding(top = 8.dp)) {
                        items(devices, key = { it.address }) { d ->
                            Column(
                                Modifier
                                    .fillMaxWidth()
                                    .heightIn(min = 56.dp)
                                    .clickable { onPick(d) }
                                    .padding(vertical = 10.dp),
                            ) {
                                Text(d.name, style = MaterialTheme.typography.titleMedium)
                                Text(d.address, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text(stringResource(R.string.close)) } },
    )
}

/** 지하/지상 층 수를 고르는 영역 (온보딩, 설정에서 공통) */
@Composable
fun FloorRangeEditor(range: FloorRange, onChange: (FloorRange) -> Unit, modifier: Modifier = Modifier) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Stepper(
            label = stringResource(R.string.range_basement),
            value = range.basement,
            valueText = if (range.basement == 0) stringResource(R.string.range_none) else "B1 ~ B${range.basement}",
            canDecrease = range.basement > 0 && range.basement + range.above > 1,
            canIncrease = range.basement < FloorRange.MAX_FLOORS,
            onChange = { onChange(FloorRange(it, range.above)) },
            tag = "basement",
        )
        Stepper(
            label = stringResource(R.string.range_above),
            value = range.above,
            valueText = if (range.above == 0) stringResource(R.string.range_none) else "1F ~ ${range.above}F",
            canDecrease = range.above > 0 && range.basement + range.above > 1,
            canIncrease = range.above < FloorRange.MAX_FLOORS,
            onChange = { onChange(FloorRange(range.basement, it)) },
            tag = "above",
        )
    }
}

@Composable
private fun Stepper(
    label: String,
    value: Int,
    valueText: String,
    canDecrease: Boolean,
    canIncrease: Boolean,
    onChange: (Int) -> Unit,
    tag: String,
) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Column(Modifier.weight(1f)) {
            Text(label, style = MaterialTheme.typography.titleMedium)
            Text(valueText, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        val minus = stringResource(R.string.range_decrease, label)
        val plus = stringResource(R.string.range_increase, label)
        FilledTonalIconButton(
            onClick = { onChange(value - 1) },
            enabled = canDecrease,
            modifier = Modifier.testTag("${tag}_minus").semantics { contentDescription = minus },
        ) { Text("−", fontWeight = FontWeight.Bold) }
        Text(
            value.toString(),
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(horizontal = 12.dp).testTag("${tag}_value"),
        )
        FilledTonalIconButton(
            onClick = { onChange(value + 1) },
            enabled = canIncrease,
            modifier = Modifier.testTag("${tag}_plus").semantics { contentDescription = plus },
        ) { Text("+", fontWeight = FontWeight.Bold) }
    }
}
