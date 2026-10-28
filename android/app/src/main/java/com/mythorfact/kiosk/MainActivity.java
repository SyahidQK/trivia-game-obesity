package com.mythorfact.kiosk;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

/** Kiosk tweaks: screen never sleeps, full screen without system bars, music can start without a tap. */
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
        hideSystemBars();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // System bars come back after dialogs or a swipe; hide them again.
        if (hasFocus) hideSystemBars();
    }

    private void hideSystemBars() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }
}
