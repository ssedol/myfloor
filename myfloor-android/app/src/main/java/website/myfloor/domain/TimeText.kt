package website.myfloor.domain

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.Locale

/** "오늘 오후 2:34", "어제 오전 9:05", "11월 3일 오후 6:10", "2025년 12월 1일 …" */
object TimeText {
    private val time = DateTimeFormatter.ofPattern("a h:mm", Locale.KOREAN)
    private val monthDay = DateTimeFormatter.ofPattern("M월 d일", Locale.KOREAN)
    private val full = DateTimeFormatter.ofPattern("yyyy년 M월 d일", Locale.KOREAN)

    fun format(at: Instant, now: Instant = Instant.now(), zone: ZoneId = ZoneId.systemDefault()): String {
        val t = at.atZone(zone)
        val today = now.atZone(zone).toLocalDate()
        val date = t.toLocalDate()
        val days = ChronoUnit.DAYS.between(date, today)
        val prefix = when {
            days == 0L -> "오늘"
            days == 1L -> "어제"
            date.year == today.year -> monthDay.format(t)
            else -> full.format(t)
        }
        return "$prefix ${time.format(t)}"
    }
}
