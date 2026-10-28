// Builds the Android APK from the synced Capacitor project (run via `npm run apk`, after scripts/setup-android-sdk.ps1).
// Output: release/myth-or-fact.apk, also copied to public/download/ so the next web deploy hosts it for the
// TV's "Downloader" app.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sdk = process.env.ANDROID_HOME ?? join(process.env.LOCALAPPDATA ?? '', 'Android', 'Sdk');
if (!existsSync(join(sdk, 'platforms'))) {
  console.error(`Android SDK not found at ${sdk}. Run: powershell -ExecutionPolicy Bypass -File scripts\\setup-android-sdk.ps1`);
  process.exit(1);
}

let javaHome = process.env.JAVA_HOME;
if (!javaHome) {
  const base = 'C:\\Program Files\\Microsoft';
  const jdk = existsSync(base) && readdirSync(base).find((d) => d.startsWith('jdk-17'));
  if (!jdk) {
    console.error('JDK 17 not found. Install it with: winget install Microsoft.OpenJDK.17');
    process.exit(1);
  }
  javaHome = join(base, jdk);
}

const android = join(root, 'android');
writeFileSync(join(android, 'local.properties'), `sdk.dir=${sdk.replace(/\\/g, '\\\\')}\n`);

// `cap sync` copies all of dist/ into the app — drop the hosted APK so the app never contains an older copy of itself.
rmSync(join(android, 'app', 'src', 'main', 'assets', 'public', 'download'), { recursive: true, force: true });

console.log(`Building APK with Java ${javaHome} and SDK ${sdk} (first build downloads Gradle, ~5 min)...`);
// Called by relative path from inside android/: the project path contains a space ("Trivia Game"), which breaks
// cmd.exe when the full path is passed through a shell. The explicit .\ is needed where Windows doesn't search the
// current folder for programs.
execFileSync('.\\gradlew.bat', ['assembleDebug', '--no-daemon'], {
  cwd: android,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, JAVA_HOME: javaHome, ANDROID_HOME: sdk },
});

const built = join(android, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
for (const dir of ['release', join('public', 'download')]) {
  mkdirSync(join(root, dir), { recursive: true });
  copyFileSync(built, join(root, dir, 'myth-or-fact.apk'));
}
console.log('\nAPK ready: release/myth-or-fact.apk (also public/download/ for hosting)');
