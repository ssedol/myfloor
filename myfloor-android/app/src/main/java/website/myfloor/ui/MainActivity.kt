package website.myfloor.ui

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.listSaver
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.runtime.toMutableStateList
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LifecycleEventEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.ui.NavDisplay
import kotlinx.coroutines.flow.map
import website.myfloor.R
import website.myfloor.ads.AdBanner
import website.myfloor.ads.Ads
import website.myfloor.data.Vehicle
import website.myfloor.domain.FloorRange
import website.myfloor.system.BluetoothSupport
import website.myfloor.system.ParkingNotifier
import website.myfloor.ui.components.BluetoothLinkProblem
import website.myfloor.ui.components.rememberBluetoothLinker
import website.myfloor.ui.screens.HomeScreen
import website.myfloor.ui.screens.NotifyStatus
import website.myfloor.ui.screens.OnboardingScreen
import website.myfloor.ui.screens.SettingsScreen
import website.myfloor.ui.screens.VehicleDetailScreen
import website.myfloor.ui.theme.MyFloorTheme
import website.myfloor.widget.FloorWidgetReceiver

class MainActivity : ComponentActivity() {
    private val vm: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            val settings by vm.settings.collectAsStateWithLifecycle()
            val mode = settings?.themeMode ?: website.myfloor.data.ThemeMode.SYSTEM
            val dark = website.myfloor.ui.theme.isDark(mode)
            // 앱 테마(시스템과 다를 수 있음)에 맞춰 상태바·내비게이션바 아이콘 색을 바꾼다.
            DisposableEffect(dark) {
                val style = if (dark) {
                    SystemBarStyle.dark(android.graphics.Color.TRANSPARENT)
                } else {
                    SystemBarStyle.light(android.graphics.Color.TRANSPARENT, android.graphics.Color.TRANSPARENT)
                }
                enableEdgeToEdge(statusBarStyle = style, navigationBarStyle = style)
                onDispose { }
            }
            MyFloorTheme(themeMode = mode) {
                Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    AppRoot(vm, onReadyForAds = { Ads.start(this@MainActivity) })
                }
            }
        }
    }
}

/** 화면 이동 경로 */
sealed interface Route {
    data object Home : Route
    data object Settings : Route
    data class Detail(val vehicleId: String) : Route
}

private fun Route.encode(): String = when (this) {
    Route.Home -> "home"
    Route.Settings -> "settings"
    is Route.Detail -> "detail:$vehicleId"
}

private fun decodeRoute(s: String): Route = when {
    s == "settings" -> Route.Settings
    s.startsWith("detail:") -> Route.Detail(s.removePrefix("detail:"))
    else -> Route.Home
}

private val backStackSaver = listSaver<SnapshotStateList<Route>, String>(
    save = { list -> list.map { it.encode() } },
    restore = { saved -> saved.map(::decodeRoute).toMutableStateList() },
)

@Composable
fun AppRoot(vm: MainViewModel, onReadyForAds: () -> Unit) {
    val settings by vm.settings.collectAsStateWithLifecycle()
    val vehicles by vm.vehicles.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        vm.messages.collect { snackbar.showSnackbar(it) }
    }

    val s = settings ?: return
    val list = vehicles ?: return

    if (!s.onboardingDone) {
        var addedId by rememberSaveable { mutableStateOf<String?>(null) }
        val added = list.firstOrNull { it.vehicle.id == addedId }?.vehicle
        val linker = rememberBluetoothLinker(
            onPicked = { device -> added?.let { vm.linkBluetooth(it.id, device) } },
            onProblem = { vm.showMessage(problemText(context, it)) },
        )
        OnboardingScreen(
            range = s.floorRange,
            addedVehicle = added,
            snackbar = snackbar,
            onRangeChange = vm::setFloorRange,
            onAddVehicle = { name -> vm.addVehicle(name) { v -> addedId = v.id } },
            onLinkBluetooth = linker.start,
            onFinish = vm::finishOnboarding,
        )
        return
    }

    LaunchedEffect(Unit) { onReadyForAds() }
    val adReady by Ads.ready.collectAsStateWithLifecycle()

    val backStack = rememberSaveable(saver = backStackSaver) { mutableListOf<Route>(Route.Home).toMutableStateList() }
    val goBack: () -> Unit = { if (backStack.size > 1) backStack.removeAt(backStack.lastIndex) }

    NavDisplay(
        backStack = backStack,
        onBack = { goBack() },
        entryProvider = entryProvider {
            entry<Route.Home> {
                var hasWidget by remember { mutableStateOf(hasWidget(context)) }
                LifecycleEventEffect(Lifecycle.Event.ON_RESUME) { hasWidget = hasWidget(context) }
                HomeScreen(
                    vehicles = list,
                    floors = s.floorRange.floors,
                    snackbar = snackbar,
                    showWidgetTip = !s.widgetTipDismissed && !hasWidget && canPinWidget(context),
                    onSaveFloor = vm::saveFloor,
                    onAddVehicle = { vm.addVehicle(it) },
                    onOpenVehicle = { backStack.add(Route.Detail(it)) },
                    onOpenSettings = { backStack.add(Route.Settings) },
                    onAddWidget = { requestPinWidget(context) },
                    onDismissWidgetTip = vm::dismissWidgetTip,
                    bottomBar = { AdBanner(ready = adReady) },
                )
            }
            entry<Route.Settings> {
                SettingsScreen(
                    range = s.floorRange,
                    themeMode = s.themeMode,
                    onBack = goBack,
                    onRangeChange = vm::setFloorRange,
                    onThemeChange = vm::setThemeMode,
                )
            }
            entry<Route.Detail> { route ->
                DetailRoute(vm, route.vehicleId, s.floorRange, snackbar, goBack)
            }
        },
    )
}

@Composable
private fun DetailRoute(
    vm: MainViewModel,
    vehicleId: String,
    range: FloorRange,
    snackbar: SnackbarHostState,
    onBack: () -> Unit,
) {
    val context = LocalContext.current
    val vehicleFlow = remember(vehicleId) { vm.vehicle(vehicleId) }
    val historyFlow = remember(vehicleId) { vm.history(vehicleId) }
    val loaded by remember(vehicleId) { vehicleFlow.map { Loaded(it) } }.collectAsStateWithLifecycle(null)
    val history by historyFlow.collectAsStateWithLifecycle(emptyList())

    var status by remember { mutableStateOf(notifyStatus(context)) }
    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) { status = notifyStatus(context) }

    val linker = rememberBluetoothLinker(
        onPicked = { vm.linkBluetooth(vehicleId, it) },
        onProblem = { vm.showMessage(problemText(context, it)) },
    )

    val state = loaded ?: return
    val vehicle = state.vehicle
    if (vehicle == null) {
        // 삭제된 차량이면 이전 화면으로 돌아간다.
        LaunchedEffect(Unit) { onBack() }
        return
    }
    VehicleDetailScreen(
        vehicle = vehicle,
        history = history,
        floors = range.floors,
        notifyStatus = status,
        snackbar = snackbar,
        onBack = onBack,
        onSaveFloor = { f, m -> vm.saveFloor(vehicleId, f, m) },
        onRename = { vm.renameVehicle(vehicleId, it) },
        onLinkBluetooth = {
            linker.start()
            status = notifyStatus(context)
        },
        onUnlinkBluetooth = { vm.unlinkBluetooth(vehicleId) },
        onSetNotify = { vm.setNotify(vehicleId, it) },
        onDeleteRecord = vm::deleteRecord,
        onClearHistory = { vm.clearHistory(vehicleId) },
        onDeleteVehicle = {
            vm.deleteVehicle(vehicleId)
            onBack()
        },
    )
}

private data class Loaded(val vehicle: Vehicle?)

private fun notifyStatus(context: android.content.Context) = NotifyStatus(
    notificationsAllowed = ParkingNotifier.canNotify(context),
    bluetoothAllowed = BluetoothSupport.hasPermission(context),
)

private fun problemText(context: android.content.Context, p: BluetoothLinkProblem): String = when (p) {
    BluetoothLinkProblem.NO_BLUETOOTH -> context.getString(R.string.bt_unavailable)
    BluetoothLinkProblem.PERMISSION_DENIED -> context.getString(R.string.bt_permission_denied)
}

private fun widgetProvider(context: android.content.Context) = ComponentName(context, FloorWidgetReceiver::class.java)

private fun hasWidget(context: android.content.Context): Boolean =
    runCatching { AppWidgetManager.getInstance(context).getAppWidgetIds(widgetProvider(context)).isNotEmpty() }
        .getOrDefault(false)

private fun canPinWidget(context: android.content.Context): Boolean =
    runCatching { AppWidgetManager.getInstance(context).isRequestPinAppWidgetSupported }.getOrDefault(false)

private fun requestPinWidget(context: android.content.Context) {
    runCatching { AppWidgetManager.getInstance(context).requestPinAppWidget(widgetProvider(context), null, null) }
}
