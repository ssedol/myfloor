package website.myfloor.data

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import java.time.Instant

@Entity(
    tableName = "vehicles",
    indices = [Index(value = ["btDeviceAddress"], unique = true)],
)
data class Vehicle(
    @PrimaryKey val id: String,
    val name: String,
    /** 연결한 블루투스 기기 MAC 주소. 기기 하나는 차량 하나에만 연결된다. */
    val btDeviceAddress: String? = null,
    val btDeviceName: String? = null,
    val notifyOnDisconnect: Boolean = true,
    val sortOrder: Int,
    val createdAt: Instant,
)

@Entity(
    tableName = "parking_records",
    foreignKeys = [
        ForeignKey(
            entity = Vehicle::class,
            parentColumns = ["id"],
            childColumns = ["vehicleId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index(value = ["vehicleId", "savedAt"])],
)
data class ParkingRecord(
    @PrimaryKey val id: String,
    val vehicleId: String,
    /** "B3", "2F" 형식 */
    val floor: String,
    val memo: String? = null,
    val savedAt: Instant,
    val source: SaveSource,
)

/** 어떤 경로로 저장했는지. 기기 안에서만 쓰고 밖으로 보내지 않는다. */
enum class SaveSource { APP, POPUP_WIDGET, NOTIFICATION, TILE, SHORTCUT }

/** 차량 + 현재 위치(가장 최근 기록) */
data class VehicleWithLocation(
    val vehicle: Vehicle,
    val current: ParkingRecord?,
)
