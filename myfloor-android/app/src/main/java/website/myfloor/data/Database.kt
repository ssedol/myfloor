package website.myfloor.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import androidx.room.Update
import kotlinx.coroutines.flow.Flow
import java.time.Instant

class Converters {
    @TypeConverter
    fun instantToLong(value: Instant?): Long? = value?.toEpochMilli()

    @TypeConverter
    fun longToInstant(value: Long?): Instant? = value?.let(Instant::ofEpochMilli)

    @TypeConverter
    fun sourceToString(value: SaveSource): String = value.name

    @TypeConverter
    fun stringToSource(value: String): SaveSource =
        SaveSource.entries.firstOrNull { it.name == value } ?: SaveSource.APP
}

@Dao
interface VehicleDao {
    @Query("SELECT * FROM vehicles ORDER BY sortOrder, createdAt")
    fun observeAll(): Flow<List<Vehicle>>

    @Query("SELECT * FROM vehicles ORDER BY sortOrder, createdAt")
    suspend fun getAll(): List<Vehicle>

    @Query("SELECT * FROM vehicles WHERE id = :id")
    suspend fun get(id: String): Vehicle?

    @Query("SELECT * FROM vehicles WHERE id = :id")
    fun observe(id: String): Flow<Vehicle?>

    @Query("SELECT * FROM vehicles WHERE btDeviceAddress = :address LIMIT 1")
    suspend fun findByBluetooth(address: String): Vehicle?

    @Query("SELECT COUNT(*) FROM vehicles")
    suspend fun count(): Int

    @Query("SELECT COALESCE(MAX(sortOrder), -1) FROM vehicles")
    suspend fun maxSortOrder(): Int

    @Insert
    suspend fun insert(vehicle: Vehicle)

    @Update
    suspend fun update(vehicle: Vehicle)

    @Query("DELETE FROM vehicles WHERE id = :id")
    suspend fun delete(id: String)
}

@Dao
interface ParkingRecordDao {
    @Query("SELECT * FROM parking_records WHERE vehicleId = :vehicleId ORDER BY savedAt DESC")
    fun observeHistory(vehicleId: String): Flow<List<ParkingRecord>>

    @Query("SELECT * FROM parking_records WHERE vehicleId = :vehicleId ORDER BY savedAt DESC")
    suspend fun history(vehicleId: String): List<ParkingRecord>

    /** 차량별 가장 최근 기록 하나씩 */
    @Query(
        """
        SELECT r.* FROM parking_records r
        WHERE r.savedAt = (SELECT MAX(r2.savedAt) FROM parking_records r2 WHERE r2.vehicleId = r.vehicleId)
        """,
    )
    fun observeLatestPerVehicle(): Flow<List<ParkingRecord>>

    @Query(
        """
        SELECT r.* FROM parking_records r
        WHERE r.savedAt = (SELECT MAX(r2.savedAt) FROM parking_records r2 WHERE r2.vehicleId = r.vehicleId)
        """,
    )
    suspend fun latestPerVehicle(): List<ParkingRecord>

    @Insert
    suspend fun insert(record: ParkingRecord)

    /** 최근 [keep]개만 남기고 오래된 기록을 지운다. */
    @Query(
        """
        DELETE FROM parking_records WHERE vehicleId = :vehicleId AND id NOT IN (
            SELECT id FROM parking_records WHERE vehicleId = :vehicleId ORDER BY savedAt DESC LIMIT :keep
        )
        """,
    )
    suspend fun trim(vehicleId: String, keep: Int)

    @Query("DELETE FROM parking_records WHERE id = :id")
    suspend fun delete(id: String)

    @Query("DELETE FROM parking_records WHERE vehicleId = :vehicleId")
    suspend fun deleteAllFor(vehicleId: String)
}

@Database(entities = [Vehicle::class, ParkingRecord::class], version = 1, exportSchema = true)
@TypeConverters(Converters::class)
abstract class MyFloorDatabase : RoomDatabase() {
    abstract fun vehicleDao(): VehicleDao
    abstract fun recordDao(): ParkingRecordDao

    companion object {
        fun build(context: Context): MyFloorDatabase =
            Room.databaseBuilder(context, MyFloorDatabase::class.java, "myfloor.db").build()
    }
}
