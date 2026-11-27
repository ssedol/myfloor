package website.myfloor.widget

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.material3.ColorProviders
import androidx.glance.semantics.contentDescription
import androidx.glance.semantics.semantics
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import website.myfloor.R
import website.myfloor.container
import website.myfloor.data.SaveSource
import website.myfloor.data.VehicleWithLocation
import website.myfloor.domain.Floors
import website.myfloor.domain.TimeText
import website.myfloor.quicksave.QuickSaveActivity
import website.myfloor.ui.MainActivity
import website.myfloor.ui.theme.BrandDark
import website.myfloor.ui.theme.BrandLight

/** 홈 화면 위젯: 모든 차량의 층을 보여주고, 차량을 탭하면 층 선택 팝업을 연다. */
class FloorWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val repo = context.container.parking
        val initial = repo.snapshot()
        provideContent {
            // 위젯 세션이 살아 있는 동안 갱신 요청이 오면 provideGlance 가 다시 불리지 않으므로
            // DB 변경을 직접 구독해서 최신 층을 그린다.
            val vehicles by repo.vehiclesWithLocation.collectAsState(initial = initial)
            // 안드로이드 12 이상은 배경화면 색(Material You), 그 아래는 브랜드 그린 테마
            val colors = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                GlanceTheme.colors
            } else {
                ColorProviders(light = BrandLight, dark = BrandDark)
            }
            GlanceTheme(colors = colors) {
                WidgetContent(context, vehicles)
            }
        }
    }
}

@Composable
fun WidgetContent(context: Context, vehicles: List<VehicleWithLocation>) {
    Column(
        GlanceModifier
            .fillMaxSize()
            .background(GlanceTheme.colors.widgetBackground)
            .cornerRadius(20.dp)
            .padding(12.dp),
    ) {
        Text(
            context.getString(R.string.app_name),
            style = TextStyle(color = GlanceTheme.colors.onSurfaceVariant, fontSize = 12.sp, fontWeight = FontWeight.Medium),
        )
        Spacer(GlanceModifier.height(6.dp))
        if (vehicles.isEmpty()) {
            Box(
                GlanceModifier.fillMaxSize().clickable(actionStartActivity(Intent(context, MainActivity::class.java))),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    context.getString(R.string.widget_empty),
                    style = TextStyle(color = GlanceTheme.colors.onSurface, fontSize = 14.sp),
                )
            }
        } else {
            vehicles.forEachIndexed { index, item ->
                if (index > 0) Spacer(GlanceModifier.height(6.dp))
                VehicleRow(context, item)
            }
        }
    }
}

@Composable
private fun VehicleRow(context: Context, item: VehicleWithLocation) {
    val v = item.vehicle
    val r = item.current
    val intent = QuickSaveActivity.intent(context, v.id, SaveSource.POPUP_WIDGET)
        .setData(Uri.parse("myfloor://widget/${v.id}"))
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
    val spoken = if (r == null) {
        context.getString(R.string.a11y_vehicle_empty, v.name)
    } else {
        context.getString(R.string.a11y_vehicle, v.name, Floors.spoken(r.floor), TimeText.format(r.savedAt))
    }
    Row(
        GlanceModifier
            .fillMaxWidth()
            .background(GlanceTheme.colors.secondaryContainer)
            .cornerRadius(14.dp)
            .padding(horizontal = 12.dp, vertical = 8.dp)
            .clickable(actionStartActivity(intent))
            .semantics { contentDescription = spoken },
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(GlanceModifier.defaultWeight()) {
            Text(
                v.name,
                style = TextStyle(color = GlanceTheme.colors.onSecondaryContainer, fontSize = 14.sp, fontWeight = FontWeight.Medium),
                maxLines = 1,
            )
            Text(
                r?.let { rec -> rec.memo ?: TimeText.format(rec.savedAt) } ?: context.getString(R.string.widget_tap_to_save),
                style = TextStyle(color = GlanceTheme.colors.onSecondaryContainer, fontSize = 11.sp),
                maxLines = 1,
            )
        }
        Text(
            r?.floor ?: "—",
            style = TextStyle(color = GlanceTheme.colors.primary, fontSize = 28.sp, fontWeight = FontWeight.Bold),
        )
    }
}

class FloorWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = FloorWidget()
}
