package com.dqnamo.pos;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Color;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        if (window != null) {
            WindowCompat.setDecorFitsSystemWindows(window, true);
            window.setStatusBarColor(Color.parseColor("#090A0F"));
            window.setNavigationBarColor(Color.parseColor("#090A0F"));

            View decorView = window.getDecorView();
            WindowInsetsControllerCompat controller = new WindowInsetsControllerCompat(window, decorView);
            controller.setAppearanceLightStatusBars(false);
            controller.setAppearanceLightNavigationBars(false);
            controller.show(WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.navigationBars());

            View contentView = findViewById(android.R.id.content);
            if (contentView != null) {
                contentView.setBackgroundColor(Color.TRANSPARENT);
                ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, windowInsets) -> {
                    Insets insets = windowInsets.getInsets(
                        WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
                    );
                    v.setPadding(insets.left, insets.top, insets.right, insets.bottom);
                    return WindowInsetsCompat.CONSUMED;
                });
            }
        }

        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.setBackgroundColor(Color.TRANSPARENT);
            WebSettings webSettings = webView.getSettings();
            if (webSettings != null) {
                webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            }
            webView.addJavascriptInterface(new AndroidNativeFileBridge(this), "AndroidNativeFileBridge");
        }
    }

    public static class AndroidNativeFileBridge {
        private final MainActivity activity;

        public AndroidNativeFileBridge(MainActivity activity) {
            this.activity = activity;
        }

        private String sanitizeFileName(String rawName) {
            if (rawName == null || rawName.trim().isEmpty()) {
                return "company-backup.backup";
            }
            return rawName.trim().replaceAll("[\\\\/:*?\"<>|]+", "_");
        }

        private String escapeJson(String value) {
            if (value == null) return "";
            return value.replace("\\", "\\\\").replace("\"", "\\\"");
        }

        @JavascriptInterface
        public String saveFileToDownloads(String fileName, String content, String mimeType) {
            final String safeName = sanitizeFileName(fileName);
            final String safeMime = (mimeType == null || mimeType.trim().isEmpty() || safeName.endsWith(".backup"))
                ? "application/octet-stream"
                : mimeType.trim();
            final byte[] bytes = (content != null ? content : "").getBytes(StandardCharsets.UTF_8);

            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentResolver resolver = activity.getContentResolver();
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, safeName);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, safeMime);
                    values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                    values.put(MediaStore.MediaColumns.IS_PENDING, 1);

                    Uri collection = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
                    Uri itemUri = resolver.insert(collection, values);
                    if (itemUri != null) {
                        try (OutputStream out = resolver.openOutputStream(itemUri)) {
                            if (out != null) {
                                out.write(bytes);
                                out.flush();
                            }
                        }
                        ContentValues completeValues = new ContentValues();
                        completeValues.put(MediaStore.MediaColumns.IS_PENDING, 0);
                        resolver.update(itemUri, completeValues, null, null);

                        activity.runOnUiThread(() ->
                            Toast.makeText(
                                activity,
                                "تم تنزيل وحفظ الملف تلقائياً في التنزيلات (Downloads): " + safeName,
                                Toast.LENGTH_LONG
                            ).show()
                        );

                        return "{\"ok\":true,\"fileName\":\"" + escapeJson(safeName) + "\",\"savedPath\":\"Downloads/" + escapeJson(safeName) + "\"}";
                    }
                }

                // Fallback for Android 9 and below or if MediaStore insert returned null
                File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                if (downloadsDir == null || (!downloadsDir.exists() && !downloadsDir.mkdirs()) || !downloadsDir.canWrite()) {
                    downloadsDir = activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                }
                if (downloadsDir == null) {
                    downloadsDir = activity.getFilesDir();
                }
                if (!downloadsDir.exists()) {
                    downloadsDir.mkdirs();
                }

                File outFile = new File(downloadsDir, safeName);
                try (FileOutputStream fos = new FileOutputStream(outFile)) {
                    fos.write(bytes);
                    fos.flush();
                }

                MediaScannerConnection.scanFile(
                    activity,
                    new String[] { outFile.getAbsolutePath() },
                    new String[] { safeMime },
                    null
                );

                final String finalPath = outFile.getAbsolutePath();
                activity.runOnUiThread(() ->
                    Toast.makeText(
                        activity,
                        "تم تنزيل وحفظ الملف في التنزيلات: " + safeName,
                        Toast.LENGTH_LONG
                    ).show()
                );

                return "{\"ok\":true,\"fileName\":\"" + escapeJson(safeName) + "\",\"savedPath\":\"" + escapeJson(finalPath) + "\"}";
            } catch (Exception e) {
                final String errMsg = e.getMessage() != null ? e.getMessage() : "Failed to write file";
                activity.runOnUiThread(() ->
                    Toast.makeText(
                        activity,
                        "تعذر الحفظ المباشر: " + errMsg,
                        Toast.LENGTH_SHORT
                    ).show()
                );
                return "{\"ok\":false,\"error\":\"" + escapeJson(errMsg) + "\"}";
            }
        }

        @JavascriptInterface
        public String shareFile(String fileName, String content, String mimeType) {
            final String safeName = sanitizeFileName(fileName);
            final String safeMime = (mimeType == null || mimeType.trim().isEmpty())
                ? "application/octet-stream"
                : mimeType.trim();
            final byte[] bytes = (content != null ? content : "").getBytes(StandardCharsets.UTF_8);

            try {
                File cacheDir = new File(activity.getCacheDir(), "backups");
                if (!cacheDir.exists()) {
                    cacheDir.mkdirs();
                }
                File sharedFile = new File(cacheDir, safeName);
                try (FileOutputStream fos = new FileOutputStream(sharedFile)) {
                    fos.write(bytes);
                    fos.flush();
                }

                final Uri contentUri = FileProvider.getUriForFile(
                    activity,
                    activity.getPackageName() + ".fileprovider",
                    sharedFile
                );

                activity.runOnUiThread(() -> {
                    Intent shareIntent = new Intent(Intent.ACTION_SEND);
                    shareIntent.setType(safeMime);
                    shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                    shareIntent.putExtra(Intent.EXTRA_TITLE, safeName);
                    shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    Intent chooser = Intent.createChooser(shareIntent, "حفظ أو مشاركة النسخة الاحتياطية");
                    activity.startActivity(chooser);
                });

                return "{\"ok\":true,\"fileName\":\"" + escapeJson(safeName) + "\"}";
            } catch (Exception e) {
                final String errMsg = e.getMessage() != null ? e.getMessage() : "Share failed";
                return "{\"ok\":false,\"error\":\"" + escapeJson(errMsg) + "\"}";
            }
        }
    }
}
