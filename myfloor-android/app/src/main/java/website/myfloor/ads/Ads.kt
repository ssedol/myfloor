package website.myfloor.ads

import android.app.Activity
import android.util.Log
import android.view.ViewGroup
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import website.myfloor.BuildConfig
import java.util.concurrent.atomic.AtomicBoolean

/** 광고 동의(UMP)와 AdMob 초기화. 광고는 메인 화면 하단 배너에만 쓴다. */
object Ads {
    private const val TAG = "Ads"
    private val initStarted = AtomicBoolean(false)
    private val _ready = MutableStateFlow(false)
    val ready: StateFlow<Boolean> = _ready

    fun start(activity: Activity) {
        runCatching {
            val consent = UserMessagingPlatform.getConsentInformation(activity)
            consent.requestConsentInfoUpdate(
                activity,
                ConsentRequestParameters.Builder().build(),
                {
                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { error ->
                        if (error != null) Log.w(TAG, "consent form: ${error.message}")
                        if (consent.canRequestAds()) initialize(activity)
                    }
                },
                { error ->
                    Log.w(TAG, "consent update: ${error.message}")
                    // 오프라인 등으로 확인하지 못해도 이전에 받은 동의가 있으면 광고를 요청할 수 있다.
                    if (consent.canRequestAds()) initialize(activity)
                },
            )
            if (consent.canRequestAds()) initialize(activity)
        }.onFailure { Log.w(TAG, "ads start failed", it) }
    }

    private fun initialize(activity: Activity) {
        if (!initStarted.compareAndSet(false, true)) return
        Thread {
            runCatching {
                MobileAds.initialize(activity.applicationContext) { _ready.value = true }
            }.onFailure { Log.w(TAG, "MobileAds init failed", it) }
        }.start()
    }
}

/** 메인 화면 하단 배너. 광고를 못 받으면(오프라인 등) 높이 0으로 숨는다. */
@Composable
fun AdBanner(ready: Boolean, modifier: Modifier = Modifier) {
    if (!ready) return
    val widthDp = LocalConfiguration.current.screenWidthDp
    var loaded by remember { mutableStateOf(false) }
    val adView = rememberAdView(widthDp) { loaded = it }
    AndroidView(
        factory = { adView },
        modifier = modifier.fillMaxWidth().testTag(if (loaded) "ad_loaded" else "ad_pending"),
    )
}

@Composable
private fun rememberAdView(widthDp: Int, onLoaded: (Boolean) -> Unit): AdView {
    val context = androidx.compose.ui.platform.LocalContext.current
    val view = remember(widthDp) {
        AdView(context).apply {
            layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            adUnitId = BuildConfig.ADMOB_BANNER_ID
            setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(context, widthDp))
            adListener = object : AdListener() {
                override fun onAdLoaded() = onLoaded(true)
                override fun onAdFailedToLoad(error: LoadAdError) {
                    onLoaded(false)
                    visibility = android.view.View.GONE
                }
            }
            loadAd(AdRequest.Builder().build())
        }
    }
    DisposableEffect(view) { onDispose { view.destroy() } }
    return view
}
