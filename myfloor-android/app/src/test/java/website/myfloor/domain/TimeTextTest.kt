package website.myfloor.domain

import org.junit.Assert.assertEquals
import org.junit.Test
import java.time.ZoneId
import java.time.ZonedDateTime

class TimeTextTest {
    private val seoul = ZoneId.of("Asia/Seoul")
    private val now = ZonedDateTime.of(2026, 11, 27, 15, 0, 0, 0, seoul).toInstant()

    private fun at(y: Int, m: Int, d: Int, h: Int, min: Int) =
        ZonedDateTime.of(y, m, d, h, min, 0, 0, seoul).toInstant()

    @Test
    fun today() = assertEquals("오늘 오후 2:34", TimeText.format(at(2026, 11, 27, 14, 34), now, seoul))

    @Test
    fun yesterday() = assertEquals("어제 오전 9:05", TimeText.format(at(2026, 11, 26, 9, 5), now, seoul))

    @Test
    fun sameYear() = assertEquals("11월 3일 오후 6:10", TimeText.format(at(2026, 11, 3, 18, 10), now, seoul))

    @Test
    fun otherYear() = assertEquals("2025년 12월 31일 오후 11:59", TimeText.format(at(2025, 12, 31, 23, 59), now, seoul))
}
