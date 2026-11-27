package website.myfloor.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import website.myfloor.data.ThemeMode

// 기존 브랜드 그린 #9BC72E 를 시드로 만든 고정 색 (안드로이드 11 이하용)
val BrandLight = lightColorScheme(
    primary = Color(0xFF4C6700),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFB8F04A),
    onPrimaryContainer = Color(0xFF141F00),
    secondary = Color(0xFF586249),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFDCE7C8),
    onSecondaryContainer = Color(0xFF151E0B),
    tertiary = Color(0xFF386660),
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFFBBECE4),
    onTertiaryContainer = Color(0xFF00201D),
    background = Color(0xFFFAFAEE),
    onBackground = Color(0xFF1A1C15),
    surface = Color(0xFFFAFAEE),
    onSurface = Color(0xFF1A1C15),
    surfaceVariant = Color(0xFFE1E4D4),
    onSurfaceVariant = Color(0xFF45483C),
    surfaceContainer = Color(0xFFEEEFE2),
    surfaceContainerHigh = Color(0xFFE8E9DC),
    outline = Color(0xFF75796B),
    outlineVariant = Color(0xFFC5C8B8),
    error = Color(0xFFBA1A1A),
    onError = Color(0xFFFFFFFF),
)

val BrandDark = darkColorScheme(
    primary = Color(0xFF9CD330),
    onPrimary = Color(0xFF253600),
    primaryContainer = Color(0xFF384E00),
    onPrimaryContainer = Color(0xFFB8F04A),
    secondary = Color(0xFFC0CBAD),
    onSecondary = Color(0xFF2A331E),
    secondaryContainer = Color(0xFF404A33),
    onSecondaryContainer = Color(0xFFDCE7C8),
    tertiary = Color(0xFFA0D0C8),
    onTertiary = Color(0xFF003732),
    tertiaryContainer = Color(0xFF1E4E48),
    onTertiaryContainer = Color(0xFFBBECE4),
    background = Color(0xFF12140D),
    onBackground = Color(0xFFE3E3D7),
    surface = Color(0xFF12140D),
    onSurface = Color(0xFFE3E3D7),
    surfaceVariant = Color(0xFF45483C),
    onSurfaceVariant = Color(0xFFC5C8B8),
    surfaceContainer = Color(0xFF1E2019),
    surfaceContainerHigh = Color(0xFF292B23),
    outline = Color(0xFF8F9284),
    outlineVariant = Color(0xFF45483C),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
)

@Composable
fun isDark(mode: ThemeMode): Boolean = when (mode) {
    ThemeMode.SYSTEM -> isSystemInDarkTheme()
    ThemeMode.LIGHT -> false
    ThemeMode.DARK -> true
}

@Composable
fun MyFloorTheme(
    themeMode: ThemeMode = ThemeMode.SYSTEM,
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit,
) {
    val dark = isDark(themeMode)
    val colors = if (dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val ctx = LocalContext.current
        if (dark) dynamicDarkColorScheme(ctx) else dynamicLightColorScheme(ctx)
    } else {
        if (dark) BrandDark else BrandLight
    }
    MaterialTheme(colorScheme = colors, content = content)
}
