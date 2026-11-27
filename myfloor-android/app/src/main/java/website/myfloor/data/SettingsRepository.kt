package website.myfloor.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import website.myfloor.domain.FloorRange

enum class ThemeMode { SYSTEM, LIGHT, DARK }

data class Settings(
    val floorRange: FloorRange = FloorRange.DEFAULT,
    val themeMode: ThemeMode = ThemeMode.SYSTEM,
    val onboardingDone: Boolean = false,
    val widgetTipDismissed: Boolean = false,
)

private val Context.settingsStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class SettingsRepository(private val store: DataStore<Preferences>) {

    constructor(context: Context) : this(context.applicationContext.settingsStore)

    private object Keys {
        val basement = intPreferencesKey("basement_floors")
        val above = intPreferencesKey("above_floors")
        val theme = stringPreferencesKey("theme_mode")
        val onboarding = booleanPreferencesKey("onboarding_done")
        val widgetTip = booleanPreferencesKey("widget_tip_dismissed")
    }

    val settings: Flow<Settings> = store.data.map { p ->
        Settings(
            floorRange = FloorRange.safe(
                p[Keys.basement] ?: FloorRange.DEFAULT.basement,
                p[Keys.above] ?: FloorRange.DEFAULT.above,
            ),
            themeMode = ThemeMode.entries.firstOrNull { it.name == p[Keys.theme] } ?: ThemeMode.SYSTEM,
            onboardingDone = p[Keys.onboarding] ?: false,
            widgetTipDismissed = p[Keys.widgetTip] ?: false,
        )
    }

    suspend fun current(): Settings = settings.first()

    suspend fun setFloorRange(range: FloorRange) {
        store.edit {
            it[Keys.basement] = range.basement
            it[Keys.above] = range.above
        }
    }

    suspend fun setThemeMode(mode: ThemeMode) {
        store.edit { it[Keys.theme] = mode.name }
    }

    suspend fun setWidgetTipDismissed() {
        store.edit { it[Keys.widgetTip] = true }
    }

    suspend fun setOnboardingDone(done: Boolean = true) {
        store.edit { it[Keys.onboarding] = done }
    }
}
