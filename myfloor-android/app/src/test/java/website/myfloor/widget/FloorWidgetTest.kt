package website.myfloor.widget

import androidx.glance.appwidget.testing.unit.runGlanceAppWidgetUnitTest
import androidx.glance.testing.unit.hasText
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith
import website.myfloor.data.ParkingRecord
import website.myfloor.data.SaveSource
import website.myfloor.data.Vehicle
import website.myfloor.data.VehicleWithLocation
import java.time.Instant

@RunWith(AndroidJUnit4::class)
class FloorWidgetTest {
    private val context = ApplicationProvider.getApplicationContext<android.content.Context>()

    @Test
    fun `차량별 층과 메모를 보여준다`() = runGlanceAppWidgetUnitTest {
        val vehicles = listOf(
            VehicleWithLocation(
                Vehicle("a", "아빠차", sortOrder = 0, createdAt = Instant.EPOCH),
                ParkingRecord("r", "a", "B3", "C구역", Instant.now(), SaveSource.APP),
            ),
            VehicleWithLocation(Vehicle("b", "엄마차", sortOrder = 1, createdAt = Instant.EPOCH), null),
        )
        provideComposable { WidgetContent(context, vehicles) }
        onNode(hasText("아빠차")).assertExists()
        onNode(hasText("B3")).assertExists()
        onNode(hasText("C구역")).assertExists()
        onNode(hasText("엄마차")).assertExists()
        onNode(hasText("눌러서 층 저장")).assertExists()
    }

    @Test
    fun `차량이 없으면 등록 안내`() = runGlanceAppWidgetUnitTest {
        provideComposable { WidgetContent(context, emptyList()) }
        onNode(hasText("눌러서 차량을 등록하세요")).assertExists()
    }
}
