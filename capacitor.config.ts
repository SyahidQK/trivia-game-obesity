import type { CapacitorConfig } from '@capacitor/cli';

// Packages the built web game (dist/) as an offline Android TV app. Build with `npm run apk`.
const config: CapacitorConfig = {
  appId: 'com.mythorfact.kiosk',
  appName: 'Myth or Fact',
  webDir: 'dist',
  android: {
    // Everything is bundled in the APK; no network access is needed at runtime.
    allowMixedContent: false,
  },
};

export default config;
