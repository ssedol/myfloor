package website.myfloor.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import website.myfloor.R
import website.myfloor.data.Vehicle
import website.myfloor.domain.FloorRange
import website.myfloor.domain.Limits

/**
 * 첫 실행: 소개(기존 사용자 안내) → 층 범위 → 첫 차량 → 블루투스(선택) → 완료
 * [addedVehicle] 은 3단계에서 등록한 차량 (블루투스 연결 대상).
 */
@Composable
fun OnboardingScreen(
    range: FloorRange,
    addedVehicle: Vehicle?,
    snackbar: SnackbarHostState,
    onRangeChange: (FloorRange) -> Unit,
    onAddVehicle: (String) -> Unit,
    onLinkBluetooth: () -> Unit,
    onFinish: () -> Unit,
) {
    var step by rememberSaveable { mutableIntStateOf(0) }
    var name by rememberSaveable { mutableStateOf("") }

    // 차량 등록이 끝나면 블루투스 단계로 넘어간다.
    LaunchedEffect(addedVehicle?.id) {
        if (step == 2 && addedVehicle != null) step = 3
    }

    Scaffold(snackbarHost = { SnackbarHost(snackbar) }) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text(
                stringResource(R.string.onboarding_step, step + 1, 4),
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary,
            )
            when (step) {
                0 -> {
                    Title(stringResource(R.string.onboarding_intro_title))
                    Body(stringResource(R.string.onboarding_intro_body))
                    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerHighest)) {
                        Text(
                            stringResource(R.string.onboarding_migration_note),
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.bodyMedium,
                        )
                    }
                    Next(stringResource(R.string.next), "onboarding_next") { step = 1 }
                }
                1 -> {
                    Title(stringResource(R.string.onboarding_floors_title))
                    Body(stringResource(R.string.onboarding_floors_body))
                    website.myfloor.ui.components.FloorRangeEditor(range = range, onChange = onRangeChange)
                    Text(
                        range.floors.joinToString("  "),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Next(stringResource(R.string.next), "onboarding_next") { step = 2 }
                }
                2 -> {
                    Title(stringResource(R.string.onboarding_vehicle_title))
                    Body(stringResource(R.string.onboarding_vehicle_body))
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it.take(Limits.MAX_NAME_LENGTH) },
                        singleLine = true,
                        label = { Text(stringResource(R.string.vehicle_name_label)) },
                        placeholder = { Text(stringResource(R.string.vehicle_name_hint)) },
                        modifier = Modifier.fillMaxWidth().testTag("onboarding_name"),
                    )
                    Next(
                        stringResource(R.string.onboarding_register),
                        "onboarding_register",
                        enabled = Limits.cleanName(name) != null,
                    ) { onAddVehicle(name) }
                }
                else -> {
                    Title(stringResource(R.string.onboarding_bt_title))
                    Body(stringResource(R.string.onboarding_bt_body))
                    val linked = addedVehicle?.btDeviceName
                    if (linked != null) {
                        Text(
                            stringResource(R.string.bt_linked_to, linked),
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    } else {
                        Button(
                            onClick = onLinkBluetooth,
                            modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp).testTag("onboarding_bt"),
                        ) { Text(stringResource(R.string.bt_link)) }
                    }
                    Spacer(Modifier.height(8.dp))
                    if (linked != null) {
                        Next(stringResource(R.string.onboarding_done), "onboarding_done", onClick = onFinish)
                    } else {
                        TextButton(onClick = onFinish, modifier = Modifier.fillMaxWidth().testTag("onboarding_skip")) {
                            Text(stringResource(R.string.onboarding_skip))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun Title(text: String) {
    Text(text, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
}

@Composable
private fun Body(text: String) {
    Text(text, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
}

@Composable
private fun Next(label: String, tag: String, enabled: Boolean = true, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp).testTag(tag),
    ) { Text(label) }
}
