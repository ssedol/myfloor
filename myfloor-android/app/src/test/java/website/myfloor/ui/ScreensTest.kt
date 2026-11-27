package website.myfloor.ui

import androidx.compose.material3.SnackbarHostState
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.assertIsNotEnabled
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import website.myfloor.data.ParkingRecord
import website.myfloor.data.SaveSource
import website.myfloor.data.Vehicle
import website.myfloor.data.VehicleWithLocation
import website.myfloor.domain.FloorRange
import website.myfloor.quicksave.QuickSaveDialog
import website.myfloor.ui.components.FloorPicker
import website.myfloor.ui.screens.HomeScreen
import website.myfloor.ui.screens.OnboardingScreen
import website.myfloor.ui.theme.MyFloorTheme
import java.time.Instant

@RunWith(AndroidJUnit4::class)
class ScreensTest {
    @get:Rule
    val rule = createComposeRule()

    private fun vehicle(id: String, name: String, floor: String? = null, memo: String? = null) = VehicleWithLocation(
        Vehicle(id = id, name = name, sortOrder = 0, createdAt = Instant.EPOCH),
        floor?.let { ParkingRecord("r$id", id, it, memo, Instant.now(), SaveSource.APP) },
    )

    @Test
    fun `층 선택 - 메모 없이 층을 누르면 바로 저장`() {
        var saved: Pair<String, String?>? = null
        rule.setContent {
            MyFloorTheme { FloorPicker(floors = FloorRange.DEFAULT.floors, current = "B2", onSave = { f, m -> saved = f to m }) }
        }
        rule.onNodeWithTag("floor_B4").performClick()
        assertEquals("B4" to null, saved)
    }

    @Test
    fun `층 선택 - 메모를 열면 층을 고른 뒤 저장 버튼으로 저장`() {
        var saved: Pair<String, String?>? = null
        rule.setContent {
            MyFloorTheme { FloorPicker(floors = FloorRange.DEFAULT.floors, current = null, onSave = { f, m -> saved = f to m }) }
        }
        rule.onNodeWithTag("memo_open").performClick()
        rule.onNodeWithTag("memo_save").assertIsNotEnabled()
        rule.onNodeWithTag("floor_B3").performClick()
        assertEquals(null, saved) // 메모 모드에서는 층만 누르면 저장되지 않는다
        rule.onNodeWithTag("memo_field").performTextInput("C구역 12번 기둥")
        rule.onNodeWithTag("memo_save").assertIsEnabled().performClick()
        assertEquals("B3" to "C구역 12번 기둥", saved)
    }

    @Test
    fun `메인 - 차량 카드에 층과 메모를 보여주고 층을 눌러 저장`() {
        var saved: Triple<String, String, String?>? = null
        rule.setContent {
            MyFloorTheme {
                HomeScreen(
                    vehicles = listOf(vehicle("a", "아빠차", "B3", "C구역"), vehicle("b", "엄마차")),
                    floors = FloorRange.DEFAULT.floors,
                    snackbar = SnackbarHostState(),
                    showWidgetTip = false,
                    onSaveFloor = { id, f, m -> saved = Triple(id, f, m) },
                    onAddVehicle = {},
                    onOpenVehicle = {},
                    onOpenSettings = {},
                    onAddWidget = {},
                    onDismissWidgetTip = {},
                )
            }
        }
        // 층 영역은 화면 낭독용 설명 하나로 묶여 있다.
        rule.onNodeWithContentDescription("아빠차, 지하 3층", substring = true).assertIsDisplayed()
        rule.onNodeWithContentDescription("메모 C구역", substring = true).assertIsDisplayed()
        rule.onNodeWithContentDescription("엄마차, 저장된 층 없음", substring = true).assertIsDisplayed()
        rule.onNodeWithText("차량 추가 (2/3)").assertIsDisplayed()

        rule.onNodeWithTag("floor_area_엄마차").performClick()
        rule.onNodeWithText("엄마차, 몇 층에 주차하셨나요?").assertIsDisplayed()
        rule.onNodeWithTag("floor_B5").performClick()
        assertEquals(Triple("b", "B5", null), saved)
    }

    @Test
    fun `메인 - 차량 3대면 추가 버튼이 없다`() {
        rule.setContent {
            MyFloorTheme {
                HomeScreen(
                    vehicles = listOf(vehicle("a", "1호"), vehicle("b", "2호"), vehicle("c", "3호")),
                    floors = FloorRange.DEFAULT.floors,
                    snackbar = SnackbarHostState(),
                    showWidgetTip = false,
                    onSaveFloor = { _, _, _ -> },
                    onAddVehicle = {},
                    onOpenVehicle = {},
                    onOpenSettings = {},
                    onAddWidget = {},
                    onDismissWidgetTip = {},
                )
            }
        }
        assertTrue(rule.onAllNodesWithTagCount("add_vehicle") == 0)
    }

    @Test
    fun `메인 - 차량이 없으면 등록 유도 후 이름 입력으로 추가`() {
        var added: String? = null
        rule.setContent {
            MyFloorTheme {
                HomeScreen(
                    vehicles = emptyList(),
                    floors = FloorRange.DEFAULT.floors,
                    snackbar = SnackbarHostState(),
                    showWidgetTip = false,
                    onSaveFloor = { _, _, _ -> },
                    onAddVehicle = { added = it },
                    onOpenVehicle = {},
                    onOpenSettings = {},
                    onAddWidget = {},
                    onDismissWidgetTip = {},
                )
            }
        }
        rule.onNodeWithText("등록된 차량이 없어요").assertIsDisplayed()
        rule.onNodeWithTag("add_first_vehicle").performClick()
        rule.onNodeWithTag("vehicle_name_confirm").assertIsNotEnabled()
        rule.onNodeWithTag("vehicle_name_field").performTextInput("아빠차")
        rule.onNodeWithTag("vehicle_name_confirm").performClick()
        assertEquals("아빠차", added)
    }

    @Test
    fun `팝업 - 차량이 여러 대면 차량부터 고르고 층을 누르면 저장`() {
        var saved: Pair<String, String>? = null
        rule.setContent {
            MyFloorTheme {
                QuickSaveDialog(
                    vehicles = listOf(vehicle("a", "아빠차", "B2"), vehicle("b", "엄마차")),
                    floors = FloorRange(3, 2).floors,
                    initialVehicleId = null,
                    onSave = { id, f, _ -> saved = id to f; true },
                    onDismiss = {},
                )
            }
        }
        rule.onNodeWithText("어떤 차를 주차하셨나요?").assertIsDisplayed()
        rule.onNodeWithTag("pick_b").performClick()
        rule.onNodeWithText("엄마차, 몇 층에 주차하셨나요?").assertIsDisplayed()
        rule.onNodeWithTag("floor_2F").performClick()
        rule.waitForIdle()
        assertEquals("b" to "2F", saved)
    }

    @Test
    fun `팝업 - 차량이 정해져 있으면 바로 층 선택`() {
        rule.setContent {
            MyFloorTheme {
                QuickSaveDialog(
                    vehicles = listOf(vehicle("a", "아빠차", "B2"), vehicle("b", "엄마차")),
                    floors = FloorRange.DEFAULT.floors,
                    initialVehicleId = "a",
                    onSave = { _, _, _ -> true },
                    onDismiss = {},
                )
            }
        }
        rule.onNodeWithText("아빠차, 몇 층에 주차하셨나요?").assertIsDisplayed()
        rule.onNodeWithText("다른 차량 고르기").assertIsDisplayed()
    }

    @Test
    fun `온보딩 - 소개, 층 범위, 차량 등록 순서`() {
        var range = FloorRange.DEFAULT
        var added: String? = null
        rule.setContent {
            MyFloorTheme {
                OnboardingScreen(
                    range = range,
                    addedVehicle = null,
                    snackbar = SnackbarHostState(),
                    onRangeChange = { range = it },
                    onAddVehicle = { added = it },
                    onLinkBluetooth = {},
                    onFinish = {},
                )
            }
        }
        rule.onNodeWithText("새로워진 몇층").assertIsDisplayed()
        rule.onNodeWithTag("onboarding_next").performClick()
        rule.onNodeWithText("주차장 층 범위").assertIsDisplayed()
        rule.onNodeWithTag("above_plus").performClick()
        assertEquals(FloorRange(5, 1), range)
        rule.onNodeWithTag("onboarding_next").performClick()
        rule.onNodeWithTag("onboarding_register").assertIsNotEnabled()
        rule.onNodeWithTag("onboarding_name").performTextInput("아빠차")
        rule.onNodeWithTag("onboarding_register").performClick()
        assertEquals("아빠차", added)
    }

    private fun androidx.compose.ui.test.junit4.ComposeContentTestRule.onAllNodesWithTagCount(tag: String): Int =
        onAllNodes(androidx.compose.ui.test.hasTestTag(tag)).fetchSemanticsNodes().size
}
