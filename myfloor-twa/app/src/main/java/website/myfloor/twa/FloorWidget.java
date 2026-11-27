package website.myfloor.twa;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class FloorWidget extends AppWidgetProvider {
    static final String ACTION_UP   = "website.myfloor.twa.FLOOR_UP";
    static final String ACTION_DOWN = "website.myfloor.twa.FLOOR_DOWN";
    static final String EXTRA_ID    = "widget_id";

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) updateWidget(ctx, mgr, id);
    }

    @Override
    public void onReceive(Context ctx, Intent intent) {
        super.onReceive(ctx, intent);
        String action = intent.getAction();
        if (!ACTION_UP.equals(action) && !ACTION_DOWN.equals(action)) return;

        int id = intent.getIntExtra(EXTRA_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        if (id == AppWidgetManager.INVALID_APPWIDGET_ID) return;

        WidgetStorage.cycleFloor(ctx, id, ACTION_UP.equals(action) ? 1 : -1);
        updateWidget(ctx, AppWidgetManager.getInstance(ctx), id);
    }

    @Override
    public void onDeleted(Context ctx, int[] ids) {
        for (int id : ids) WidgetStorage.delete(ctx, id);
    }

    static void updateWidget(Context ctx, AppWidgetManager mgr, int id) {
        RemoteViews views = new RemoteViews(ctx.getPackageName(), R.layout.widget_floor);

        views.setTextViewText(R.id.widget_vehicle_name, WidgetStorage.getName(ctx, id));
        views.setTextViewText(R.id.widget_floor, WidgetStorage.getFloor(ctx, id));

        views.setOnClickPendingIntent(R.id.widget_btn_up,   floorPending(ctx, id, ACTION_UP,   1));
        views.setOnClickPendingIntent(R.id.widget_btn_down, floorPending(ctx, id, ACTION_DOWN, 2));
        views.setOnClickPendingIntent(R.id.widget_btn_open, openAppPending(ctx, id));

        mgr.updateAppWidget(id, views);
    }

    private static PendingIntent floorPending(Context ctx, int id, String action, int reqOffset) {
        Intent intent = new Intent(ctx, FloorWidget.class);
        intent.setAction(action);
        intent.putExtra(EXTRA_ID, id);
        return PendingIntent.getBroadcast(
            ctx, id * 10 + reqOffset, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static PendingIntent openAppPending(Context ctx, int id) {
        Intent intent = new Intent(ctx, LauncherActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return PendingIntent.getActivity(
            ctx, id * 10 + 3, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }
}
