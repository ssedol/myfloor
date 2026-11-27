package website.myfloor.data

import androidx.room.withTransaction
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import website.myfloor.domain.Floors
import website.myfloor.domain.Limits
import java.time.Clock
import java.util.UUID

/** 데이터가 바뀌었을 때 위젯, 바로가기, 타일을 갱신하는 쪽에 알린다. */
fun interface DataChangeListener {
    suspend fun onDataChanged()
}

sealed interface AddVehicleResult {
    data class Added(val vehicle: Vehicle) : AddVehicleResult
    data object LimitReached : AddVehicleResult
    data object InvalidName : AddVehicleResult
}

sealed interface LinkBluetoothResult {
    data object Linked : LinkBluetoothResult
    data class AlreadyLinked(val otherVehicleName: String) : LinkBluetoothResult
    data object VehicleNotFound : LinkBluetoothResult
}

class ParkingRepository(
    private val db: MyFloorDatabase,
    private val clock: Clock = Clock.systemUTC(),
    private val listener: DataChangeListener = DataChangeListener { },
) {
    private val vehicles = db.vehicleDao()
    private val records = db.recordDao()

    val vehiclesWithLocation: Flow<List<VehicleWithLocation>> =
        combine(vehicles.observeAll(), records.observeLatestPerVehicle()) { vs, latest ->
            join(vs, latest)
        }

    suspend fun snapshot(): List<VehicleWithLocation> = join(vehicles.getAll(), records.latestPerVehicle())

    private fun join(vs: List<Vehicle>, latest: List<ParkingRecord>): List<VehicleWithLocation> {
        // 같은 시각에 저장된 기록이 둘 이상이면 하나만 쓴다.
        val byVehicle = latest.groupBy { it.vehicleId }.mapValues { (_, list) -> list.maxBy { it.savedAt } }
        return vs.map { VehicleWithLocation(it, byVehicle[it.id]) }
    }

    fun observeVehicle(id: String): Flow<Vehicle?> = vehicles.observe(id)

    fun observeHistory(vehicleId: String): Flow<List<ParkingRecord>> = records.observeHistory(vehicleId)

    suspend fun history(vehicleId: String): List<ParkingRecord> = records.history(vehicleId)

    suspend fun vehicle(id: String): Vehicle? = vehicles.get(id)

    suspend fun vehicleForBluetooth(address: String): Vehicle? = vehicles.findByBluetooth(address)

    suspend fun addVehicle(rawName: String): AddVehicleResult {
        val name = Limits.cleanName(rawName) ?: return AddVehicleResult.InvalidName
        val added = db.withTransaction {
            if (vehicles.count() >= Limits.MAX_VEHICLES) return@withTransaction null
            Vehicle(
                id = UUID.randomUUID().toString(),
                name = name,
                sortOrder = vehicles.maxSortOrder() + 1,
                createdAt = clock.instant(),
            ).also { vehicles.insert(it) }
        } ?: return AddVehicleResult.LimitReached
        listener.onDataChanged()
        return AddVehicleResult.Added(added)
    }

    suspend fun renameVehicle(id: String, rawName: String): Boolean {
        val name = Limits.cleanName(rawName) ?: return false
        val v = vehicles.get(id) ?: return false
        vehicles.update(v.copy(name = name))
        listener.onDataChanged()
        return true
    }

    suspend fun deleteVehicle(id: String) {
        vehicles.delete(id) // 기록은 CASCADE 로 함께 지워진다.
        listener.onDataChanged()
    }

    suspend fun linkBluetooth(vehicleId: String, address: String, deviceName: String?): LinkBluetoothResult {
        val result = db.withTransaction {
            val v = vehicles.get(vehicleId) ?: return@withTransaction LinkBluetoothResult.VehicleNotFound
            val other = vehicles.findByBluetooth(address)
            if (other != null && other.id != vehicleId) {
                return@withTransaction LinkBluetoothResult.AlreadyLinked(other.name)
            }
            vehicles.update(v.copy(btDeviceAddress = address, btDeviceName = deviceName, notifyOnDisconnect = true))
            LinkBluetoothResult.Linked
        }
        if (result == LinkBluetoothResult.Linked) listener.onDataChanged()
        return result
    }

    suspend fun unlinkBluetooth(vehicleId: String) {
        val v = vehicles.get(vehicleId) ?: return
        vehicles.update(v.copy(btDeviceAddress = null, btDeviceName = null))
        listener.onDataChanged()
    }

    suspend fun setNotifyOnDisconnect(vehicleId: String, enabled: Boolean) {
        val v = vehicles.get(vehicleId) ?: return
        vehicles.update(v.copy(notifyOnDisconnect = enabled))
    }

    /** 주차 위치를 저장하고 차량당 최근 기록만 남긴다. 저장한 기록을 돌려준다. */
    suspend fun saveParking(vehicleId: String, floor: String, memo: String?, source: SaveSource): ParkingRecord? {
        if (!Floors.isValid(floor)) return null
        val record = db.withTransaction {
            vehicles.get(vehicleId) ?: return@withTransaction null
            ParkingRecord(
                id = UUID.randomUUID().toString(),
                vehicleId = vehicleId,
                floor = floor,
                memo = Limits.cleanMemo(memo),
                savedAt = clock.instant(),
                source = source,
            ).also {
                records.insert(it)
                records.trim(vehicleId, Limits.HISTORY_PER_VEHICLE)
            }
        } ?: return null
        listener.onDataChanged()
        return record
    }

    suspend fun deleteRecord(recordId: String) {
        records.delete(recordId)
        listener.onDataChanged()
    }

    suspend fun clearHistory(vehicleId: String) {
        records.deleteAllFor(vehicleId)
        listener.onDataChanged()
    }
}
