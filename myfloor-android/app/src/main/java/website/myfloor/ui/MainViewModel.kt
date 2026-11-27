package website.myfloor.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import website.myfloor.R
import website.myfloor.container
import website.myfloor.data.AddVehicleResult
import website.myfloor.data.LinkBluetoothResult
import website.myfloor.data.ParkingRecord
import website.myfloor.data.SaveSource
import website.myfloor.data.Settings
import website.myfloor.data.ThemeMode
import website.myfloor.data.Vehicle
import website.myfloor.data.VehicleWithLocation
import website.myfloor.domain.FloorRange
import website.myfloor.system.PairedDevice

class MainViewModel(app: Application) : AndroidViewModel(app) {
    private val parking = app.container.parking
    private val settingsRepo = app.container.settings

    /** null = 아직 읽는 중 */
    val settings: StateFlow<Settings?> =
        settingsRepo.settings.stateIn(viewModelScope, SharingStarted.Eagerly, null)

    val vehicles: StateFlow<List<VehicleWithLocation>?> =
        parking.vehiclesWithLocation.stateIn(viewModelScope, SharingStarted.Eagerly, null)

    private val messageChannel = Channel<String>(Channel.BUFFERED)
    val messages: Flow<String> = messageChannel.receiveAsFlow()

    private fun str(id: Int, vararg args: Any): String = getApplication<Application>().getString(id, *args)

    private fun say(text: String) {
        messageChannel.trySend(text)
    }

    fun history(vehicleId: String): Flow<List<ParkingRecord>> = parking.observeHistory(vehicleId)

    fun vehicle(vehicleId: String): Flow<Vehicle?> = parking.observeVehicle(vehicleId)

    fun addVehicle(name: String, onAdded: (Vehicle) -> Unit = {}) = viewModelScope.launch {
        when (val r = parking.addVehicle(name)) {
            is AddVehicleResult.Added -> {
                say(str(R.string.msg_vehicle_added, r.vehicle.name))
                onAdded(r.vehicle)
            }
            AddVehicleResult.LimitReached -> say(str(R.string.msg_vehicle_limit))
            AddVehicleResult.InvalidName -> say(str(R.string.msg_vehicle_invalid))
        }
    }

    fun renameVehicle(id: String, name: String) = viewModelScope.launch {
        if (!parking.renameVehicle(id, name)) say(str(R.string.msg_vehicle_invalid))
    }

    fun deleteVehicle(id: String) = viewModelScope.launch {
        val name = parking.vehicle(id)?.name
        parking.deleteVehicle(id)
        if (name != null) say(str(R.string.msg_vehicle_deleted, name))
    }

    fun saveFloor(vehicleId: String, floor: String, memo: String?) = viewModelScope.launch {
        val v = parking.vehicle(vehicleId) ?: return@launch
        if (parking.saveParking(vehicleId, floor, memo, SaveSource.APP) != null) {
            say(str(R.string.saved_toast, v.name, floor))
        }
    }

    fun linkBluetooth(vehicleId: String, device: PairedDevice) = viewModelScope.launch {
        when (val r = parking.linkBluetooth(vehicleId, device.address, device.name)) {
            LinkBluetoothResult.Linked -> say(str(R.string.msg_bt_linked, device.name))
            is LinkBluetoothResult.AlreadyLinked -> say(str(R.string.msg_bt_already_linked, r.otherVehicleName))
            LinkBluetoothResult.VehicleNotFound -> Unit
        }
    }

    fun unlinkBluetooth(vehicleId: String) = viewModelScope.launch {
        parking.unlinkBluetooth(vehicleId)
        say(str(R.string.msg_bt_unlinked))
    }

    fun setNotify(vehicleId: String, enabled: Boolean) = viewModelScope.launch {
        parking.setNotifyOnDisconnect(vehicleId, enabled)
    }

    fun deleteRecord(recordId: String) = viewModelScope.launch { parking.deleteRecord(recordId) }

    fun clearHistory(vehicleId: String) = viewModelScope.launch {
        parking.clearHistory(vehicleId)
        say(str(R.string.msg_history_cleared))
    }

    fun setFloorRange(range: FloorRange) = viewModelScope.launch { settingsRepo.setFloorRange(range) }

    fun setThemeMode(mode: ThemeMode) = viewModelScope.launch { settingsRepo.setThemeMode(mode) }

    fun dismissWidgetTip() = viewModelScope.launch { settingsRepo.setWidgetTipDismissed() }

    fun finishOnboarding() = viewModelScope.launch { settingsRepo.setOnboardingDone(true) }

    fun showMessage(text: String) = say(text)
}
