package website.myfloor.twa;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class FloorWidgetConfigActivity extends Activity {
    private int mWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Cancel by default so back button doesn't add widget
        setResult(RESULT_CANCELED);

        mWidgetId = getIntent().getIntExtra(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        );
        if (mWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }

        setContentView(R.layout.activity_widget_config);

        EditText editName = findViewById(R.id.config_edit_name);
        Button btnAdd = findViewById(R.id.config_btn_add);

        btnAdd.setOnClickListener(v -> {
            String name = editName.getText().toString().trim();
            if (name.isEmpty()) name = "내 차";

            WidgetStorage.saveName(this, mWidgetId, name);

            AppWidgetManager mgr = AppWidgetManager.getInstance(this);
            FloorWidget.updateWidget(this, mgr, mWidgetId);

            Intent result = new Intent();
            result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, mWidgetId);
            setResult(RESULT_OK, result);
            finish();
        });
    }
}
