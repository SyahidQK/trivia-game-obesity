# One-time setup: installs the Android SDK pieces needed to build the APK.
# Run from the project folder:  powershell -ExecutionPolicy Bypass -File scripts\setup-android-sdk.ps1
# You will be asked to review and accept the Android SDK licences (type y).
$ErrorActionPreference = 'Stop'

$jdk = Get-ChildItem 'C:\Program Files\Microsoft' -Directory -Filter 'jdk-17*' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $jdk) { throw 'JDK 17 not found. Install it first:  winget install Microsoft.OpenJDK.17' }
$env:JAVA_HOME = $jdk.FullName
Write-Host "Using Java: $env:JAVA_HOME"

$sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$sdkmanager = Join-Path $sdk 'cmdline-tools\latest\bin\sdkmanager.bat'

if (-not (Test-Path $sdkmanager)) {
    Write-Host 'Downloading Android command-line tools (~150 MB)...'
    New-Item -ItemType Directory -Force (Join-Path $sdk 'cmdline-tools') | Out-Null
    $zip = Join-Path $env:TEMP 'android-cmdline-tools.zip'
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile $zip -UseBasicParsing
    # tar copes with the zip's long paths better than Expand-Archive.
    tar -xf $zip -C (Join-Path $sdk 'cmdline-tools')
    Rename-Item (Join-Path $sdk 'cmdline-tools\cmdline-tools') 'latest'
    Remove-Item $zip
}

Write-Host ''
Write-Host 'Review the Android SDK licences below and type y to accept each one.' -ForegroundColor Yellow
& $sdkmanager "--sdk_root=$sdk" --licenses

Write-Host 'Installing platform-tools, Android 14 platform and build tools...'
& $sdkmanager "--sdk_root=$sdk" 'platform-tools' 'platforms;android-34' 'build-tools;34.0.0'

Write-Host ''
Write-Host "Android SDK ready at $sdk" -ForegroundColor Green
Write-Host 'Next: npm.cmd run apk'
