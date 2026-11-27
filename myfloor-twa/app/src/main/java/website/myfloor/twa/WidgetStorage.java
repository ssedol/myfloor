package website.myfloor.twa;

import android.content.Context;
import android.content.SharedPreferences;

class WidgetStorage {
    private static final String PREFS_NAME = "FloorWidgetPrefs";
    private static final String KEY_NAME = "vehicle_name_";
    private static final String KEY_FLOOR = "floor_index_";

    static final String[] FLOORS = {
        "B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1",
        "1F", "2F", "3F", "4F", "5F", "6F", "7F", "8F"
    };
    // Default: B2 (index 6)
    private static final int DEFAULT_INDEX = 6;

    private static SharedPreferences prefs(Context ctx) {
        return ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    static void saveName(Context ctx, int id, String name) {
        prefs(ctx).edit().putString(KEY_NAME + id, name).apply();
    }

    static String getName(Context ctx, int id) {
        return prefs(ctx).getString(KEY_NAME + id, "내 차");
    }

    static void saveFloorIndex(Context ctx, int id, int index) {
        prefs(ctx).edit().putInt(KEY_FLOOR + id, index).apply();
    }

    static int getFloorIndex(Context ctx, int id) {
        return prefs(ctx).getInt(KEY_FLOOR + id, DEFAULT_INDEX);
    }

    static String getFloor(Context ctx, int id) {
        return FLOORS[getFloorIndex(ctx, id)];
    }

    static void cycleFloor(Context ctx, int id, int delta) {
        int next = (getFloorIndex(ctx, id) + delta + FLOORS.length) % FLOORS.length;
        saveFloorIndex(ctx, id, next);
    }

    static void delete(Context ctx, int id) {
        prefs(ctx).edit()
            .remove(KEY_NAME + id)
            .remove(KEY_FLOOR + id)
            .apply();
    }
}
