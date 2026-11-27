package website.myfloor.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import website.myfloor.R
import website.myfloor.domain.Floors
import website.myfloor.domain.Limits

/**
 * 공통 층 선택 영역.
 * 메모를 열지 않았으면 층을 탭하는 즉시 저장하고,
 * 메모를 열었으면 층을 고른 뒤 [저장] 버튼으로 저장한다.
 */
@Composable
fun FloorPicker(
    floors: List<String>,
    current: String?,
    initialMemo: String? = null,
    onSave: (floor: String, memo: String?) -> Unit,
    modifier: Modifier = Modifier,
    columns: Int = 4,
) {
    var memoOpen by rememberSaveable { mutableStateOf(false) }
    var memo by rememberSaveable { mutableStateOf(initialMemo.orEmpty()) }
    var selected by rememberSaveable { mutableStateOf(current) }

    Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        floors.chunked(columns).forEach { row ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { floor ->
                    val highlighted = if (memoOpen) floor == selected else floor == current
                    val onClick = {
                        if (memoOpen) selected = floor else onSave(floor, null)
                    }
                    val m = Modifier
                        .weight(1f)
                        .heightIn(min = 56.dp)
                        .testTag("floor_$floor")
                        .semantics { contentDescription = Floors.spoken(floor) }
                    val pad = PaddingValues(horizontal = 4.dp, vertical = 8.dp)
                    if (highlighted) {
                        Button(onClick = onClick, modifier = m, contentPadding = pad) { FloorLabel(floor) }
                    } else {
                        FilledTonalButton(onClick = onClick, modifier = m, contentPadding = pad) { FloorLabel(floor) }
                    }
                }
                repeat(columns - row.size) { Spacer(Modifier.weight(1f)) }
            }
        }

        if (!memoOpen) {
            TextButton(onClick = { memoOpen = true }, modifier = Modifier.testTag("memo_open")) {
                Text(stringResource(R.string.picker_add_memo))
            }
        } else {
            OutlinedTextField(
                value = memo,
                onValueChange = { memo = it.take(Limits.MAX_MEMO_LENGTH) },
                modifier = Modifier.fillMaxWidth().testTag("memo_field"),
                label = { Text(stringResource(R.string.picker_memo_label)) },
                placeholder = { Text(stringResource(R.string.picker_memo_hint)) },
                singleLine = true,
                supportingText = { Text("${memo.length}/${Limits.MAX_MEMO_LENGTH}") },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
            )
            Spacer(Modifier.height(4.dp))
            Button(
                onClick = { selected?.let { onSave(it, memo) } },
                enabled = selected != null,
                modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp).testTag("memo_save"),
            ) {
                Text(
                    if (selected == null) stringResource(R.string.picker_choose_floor)
                    else stringResource(R.string.picker_save_with_memo, selected!!),
                )
            }
        }
    }
}

@Composable
private fun FloorLabel(floor: String) {
    Text(floor, fontSize = 20.sp, fontWeight = FontWeight.Bold, maxLines = 1, softWrap = false)
}

/** 차량 고르기 (팝업에서 차량이 2대 이상일 때) */
@Composable
fun VehicleChoice(
    names: List<Pair<String, String>>,
    subtitles: Map<String, String>,
    onPick: (id: String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        names.forEach { (id, name) ->
            OutlinedButton(
                onClick = { onPick(id) },
                modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp).testTag("pick_$id"),
            ) {
                Column(Modifier.fillMaxWidth()) {
                    Text(name, style = MaterialTheme.typography.titleMedium)
                    subtitles[id]?.let {
                        Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}
