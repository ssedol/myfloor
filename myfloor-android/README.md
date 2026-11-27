# 몇층 (MyFloor) 안드로이드 앱

주차한 층을 저장하는 네이티브 안드로이드 앱입니다. 요구사항은 [PRD_android_v1.0.md](../PRD_android_v1.0.md)에 있습니다.
기존 Play 스토어 TWA 앱(`website.myfloor.twa`)을 **같은 패키지명으로 교체**하는 버전 4.0.0입니다(versionCode 10).

## 기능 (1차 버전)

| 기능 | 구현 위치 |
|------|-----------|
| 온보딩 (소개, 층 범위, 첫 차량, 블루투스) | `ui/screens/OnboardingScreen.kt` |
| 차량 관리 (최대 3대, 이름 변경, 삭제) | `ui/screens/HomeScreen.kt`, `VehicleDetailScreen.kt` |
| 층 범위 설정 (지하 0~10, 지상 0~10) | `ui/components/Dialogs.kt` `FloorRangeEditor` |
| 층 + 메모(30자) 저장, 차량별 기록 30개 | `data/ParkingRepository.kt` |
| 공통 층 선택 팝업 | `quicksave/QuickSaveActivity.kt` |
| 홈 화면 위젯 (Glance) | `widget/FloorWidget.kt` |
| 블루투스 끊김 알림 (층 버튼 3개) | `system/BluetoothSupport.kt`, `ParkingNotifier.kt`, `NotificationActionReceiver.kt` |
| 빠른 설정 타일 | `system/FloorTileService.kt` |
| 앱 아이콘 길게 누르기 바로가기 | `system/SurfaceUpdater.kt` |
| AdMob 배너 (메인 화면 하단만) + UMP 동의 | `ads/Ads.kt` |
| Material You + 다크모드, 안드로이드 11 이하는 브랜드 그린 | `ui/theme/Theme.kt` |

데이터 흐름: 어디서 저장하든 `ParkingRepository` → Room DB → `SurfaceUpdater`가 위젯, 바로가기, 타일을 갱신합니다.
위젯은 DB 변경을 직접 구독해서 세션 중에도 최신 층을 보여줍니다.

## 빌드

필요한 것: JDK 17, Android SDK(platform 36, build-tools 35). Gradle은 wrapper가 내려받습니다.

```powershell
cd myfloor-android
.\gradlew.bat :app:assembleDebug        # 디버그 APK (테스트 광고)
.\gradlew.bat :app:assembleRelease      # 릴리스 APK (R8 축소 적용)
.\gradlew.bat :app:bundleRelease        # Play 스토어용 AAB
```

### 서명과 실제 광고 ID

`myfloor-android/key.properties`(커밋 금지, .gitignore 처리됨)를 만들면 릴리스 빌드에 쓰입니다.

```properties
storeFile=../myfloor-twa/android.keystore
storePassword=…
keyAlias=…
keyPassword=…
admobAppId=ca-app-pub-XXXXXXXX~YYYYYYYY
admobBannerId=ca-app-pub-XXXXXXXX/ZZZZZZZZ
```

- 파일이 없으면 릴리스 APK는 **서명 없이** 만들어지고, 광고는 **Google 테스트 ID**를 씁니다.
- 기존 앱을 교체하려면 반드시 **기존 TWA와 같은 키**로 서명해야 합니다(Play 앱 서명을 쓰는 경우 업로드 키).

## 테스트

```powershell
.\gradlew.bat :app:testDebugUnitTest    # JVM + Robolectric 41개
.\gradlew.bat :app:lintDebug
```

| 테스트 | 내용 |
|--------|------|
| `FloorsTest` | 층 범위, 층 이름 검증, 알림 층 추천(빈도 → 최근 → 기본 채우기), 이름·메모 정리 |
| `TimeTextTest` | "오늘/어제/날짜" 시각 표시 |
| `ParkingRepositoryTest` | 3대 제한, 30개 기록 유지, 삭제 연쇄, 블루투스 1:1 연결, 잘못된 층 거부 |
| `NotificationFlowTest` | 블루투스 끊김 → 알림(버튼 3개) → 버튼 저장 → 알림 닫힘, 권한 없음 처리 |
| `ScreensTest` | 층 선택(즉시 저장 / 메모 모드), 메인, 팝업, 온보딩 화면 |
| `FloorWidgetTest` | 위젯 내용 |
| `androidTest/NotificationE2ETest` | 실제 기기에서 시스템 알림 버튼을 눌러 저장 (UiAutomator) |

계측 테스트는 앱 데이터를 지우지 않도록 직접 실행했습니다:

```powershell
.\gradlew.bat :app:assembleDebug :app:assembleDebugAndroidTest
adb install -r app\build\outputs\apk\debug\app-debug.apk
adb install -r app\build\outputs\apk\androidTest\debug\app-debug-androidTest.apk
adb shell am instrument -w -e class website.myfloor.NotificationE2ETest website.myfloor.twa.test/androidx.test.runner.AndroidJUnitRunner
```

## 에뮬레이터에서 확인한 것 (Android 15, 2026-11-27)

온보딩 → 층 범위 변경 → 차량 등록 → 블루투스·알림 권한 요청 → 메인에서 저장 → 메모 포함 저장 →
위젯 추가(핀 요청) → 위젯에서 팝업으로 저장 시 위젯 즉시 갱신 → 빠른 설정 타일로 저장 →
바로가기 등록 확인 → 기록 밀어서 삭제 → 다크 모드 → 테스트 광고 표시 → 릴리스(R8) 빌드 동작.
화면은 [docs/screenshots](docs/screenshots)에 있습니다.

## 출시 전에 남은 일

- [ ] **실제 차 블루투스로 끊김 알림 확인** (에뮬레이터는 페어링 기기가 없어 시스템 브로드캐스트 이후 처리만 검증함)
- [ ] `key.properties` 작성: 기존 키스토어 경로·비밀번호, 실제 AdMob 앱 ID·배너 ID
- [ ] 개인정보처리방침 페이지 `https://myfloor.website/privacy` 게시 (설정 화면에서 링크함)
- [ ] Play Console: 데이터 보안 양식(광고 ID 수집), "광고 포함" 표시, 스토어 이름·설명·스크린샷 교체
- [ ] 내부 테스트 트랙으로 기존 TWA 설치 기기에 업데이트해서 홈 화면 아이콘이 유지되는지 확인
  (기존 런처 Activity 이름 `website.myfloor.twa.LauncherActivity`를 activity-alias로 남겨둠)
- [ ] 실제 기기 여러 대(삼성 One UI 등)에서 위젯·타일 모양 확인

## 알려진 한계

- 시각 표시(`TimeText`)는 한국어로 고정돼 있습니다. 영어를 추가할 때 리소스로 옮겨야 합니다.
- 빠른 설정 타일 문구는 알림창을 열 때 비동기로 읽어서 아주 잠깐 이전 층이 보일 수 있습니다.
- 라이브러리는 이 PC의 SDK(platform 36)와 맞는 2025년 말 버전으로 고정했습니다. 최신(AGP 9, compileSdk 37 등)으로 올리는 것은 별도 작업입니다.
