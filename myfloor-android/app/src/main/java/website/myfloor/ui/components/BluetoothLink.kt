package website.myfloor.ui.components

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import website.myfloor.system.BluetoothSupport
import website.myfloor.system.PairedDevice

/** 블루투스 기기 연결 과정에서 생길 수 있는 문제 */
enum class BluetoothLinkProblem { NO_BLUETOOTH, PERMISSION_DENIED }

class BluetoothLinker internal constructor(val start: () -> Unit)

/**
 * "블루투스 기기 연결" 흐름: 권한 요청(블루투스, 알림) → 페어링된 기기 목록 → 선택.
 * 알림 권한은 거부돼도 연결은 하고, 알림이 안 온다는 안내는 화면에서 따로 보여준다.
 */
@Composable
fun rememberBluetoothLinker(
    onPicked: (PairedDevice) -> Unit,
    onProblem: (BluetoothLinkProblem) -> Unit,
): BluetoothLinker {
    val context = LocalContext.current
    val picked by rememberUpdatedState(onPicked)
    val problem by rememberUpdatedState(onProblem)
    var devices by remember { mutableStateOf<List<PairedDevice>?>(null) }

    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) {
        if (BluetoothSupport.hasPermission(context)) {
            devices = BluetoothSupport.pairedDevices(context)
        } else {
            problem(BluetoothLinkProblem.PERMISSION_DENIED)
        }
    }

    devices?.let { list ->
        BluetoothDevicePickerDialog(
            devices = list,
            onPick = {
                devices = null
                picked(it)
            },
            onDismiss = { devices = null },
        )
    }

    return remember(context) {
        BluetoothLinker {
            if (!BluetoothSupport.isAvailable(context)) {
                problem(BluetoothLinkProblem.NO_BLUETOOTH)
                return@BluetoothLinker
            }
            val wanted = buildList {
                addAll(BluetoothSupport.runtimePermissions)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) add(Manifest.permission.POST_NOTIFICATIONS)
            }
            if (wanted.isEmpty()) {
                devices = BluetoothSupport.pairedDevices(context)
            } else {
                launcher.launch(wanted.toTypedArray())
            }
        }
    }
}
