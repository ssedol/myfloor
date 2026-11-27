package website.myfloor.domain

import website.myfloor.data.ParkingRecord

/** 사용자가 설정한 층 범위. 지하 [basement]개 층, 지상 [above]개 층. */
data class FloorRange(val basement: Int, val above: Int) {
    init {
        require(basement in 0..MAX_FLOORS) { "basement out of range: $basement" }
        require(above in 0..MAX_FLOORS) { "above out of range: $above" }
        require(basement + above >= 1) { "at least one floor required" }
    }

    /** 선택지 순서: B1, B2 … Bn, 그다음 1F, 2F … nF */
    val floors: List<String>
        get() = (1..basement).map { "B$it" } + (1..above).map { "${it}F" }

    companion object {
        const val MAX_FLOORS = 10
        val DEFAULT = FloorRange(basement = 5, above = 0)

        /** 잘못된 저장값이 들어와도 앱이 죽지 않도록 범위 안으로 맞춘다. */
        fun safe(basement: Int, above: Int): FloorRange {
            val b = basement.coerceIn(0, MAX_FLOORS)
            val a = above.coerceIn(0, MAX_FLOORS)
            return if (b + a == 0) DEFAULT else FloorRange(b, a)
        }
    }
}

object Floors {
    private val pattern = Regex("^(B([1-9]|10)|([1-9]|10)F)$")

    fun isValid(floor: String): Boolean = pattern.matches(floor)

    /** 화면 낭독(TalkBack)용 이름: "B3" → "지하 3층", "2F" → "지상 2층" */
    fun spoken(floor: String): String = when {
        floor.startsWith("B") -> "지하 ${floor.drop(1)}층"
        floor.endsWith("F") -> "지상 ${floor.dropLast(1)}층"
        else -> floor
    }

    /**
     * 알림에 띄울 층 버튼.
     * 기록에서 가장 많이 쓴 층부터 고르고, 횟수가 같으면 최근에 쓴 층을 먼저 둔다.
     * 부족하면 현재 층 범위의 앞쪽 층(B1, B2, B3 …)으로 채운다.
     */
    fun suggestions(history: List<ParkingRecord>, range: FloorRange, count: Int = 3): List<String> {
        val byFloor = history.groupBy { it.floor }
        val ranked = byFloor.entries
            .sortedWith(
                compareByDescending<Map.Entry<String, List<ParkingRecord>>> { it.value.size }
                    .thenByDescending { e -> e.value.maxOf { it.savedAt } },
            )
            .map { it.key }
        val result = ranked.take(count).toMutableList()
        for (f in range.floors) {
            if (result.size >= count) break
            if (f !in result) result += f
        }
        return result
    }
}

object Limits {
    const val MAX_VEHICLES = 3
    const val MAX_NAME_LENGTH = 20
    const val MAX_MEMO_LENGTH = 30
    const val HISTORY_PER_VEHICLE = 30

    fun cleanName(raw: String): String? =
        raw.trim().takeIf { it.isNotEmpty() && it.length <= MAX_NAME_LENGTH }

    fun cleanMemo(raw: String?): String? =
        raw?.trim()?.take(MAX_MEMO_LENGTH)?.takeIf { it.isNotEmpty() }
}
