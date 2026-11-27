package website.myfloor

import android.app.Application
import android.content.Context
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import website.myfloor.data.DataChangeListener
import website.myfloor.data.MyFloorDatabase
import website.myfloor.data.ParkingRepository
import website.myfloor.data.SettingsRepository
import website.myfloor.system.SurfaceUpdater

/** 앱 전체에서 하나씩 쓰는 객체들 */
class AppContainer(context: Context) {
    private val appContext = context.applicationContext

    /** 화면 밖(리시버, 위젯 등)에서 쓰는 작업용 스코프 */
    val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    val database: MyFloorDatabase by lazy { MyFloorDatabase.build(appContext) }
    val settings: SettingsRepository by lazy { SettingsRepository(appContext) }

    val parking: ParkingRepository by lazy {
        ParkingRepository(
            db = database,
            listener = DataChangeListener { SurfaceUpdater.refreshAll(appContext, this) },
        )
    }
}

class MyFloorApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
        website.myfloor.system.ParkingNotifier.createChannel(this)
    }
}

val Context.container: AppContainer
    get() = (applicationContext as MyFloorApp).container
