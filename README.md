# Myth or Fact — Touchscreen Trivia Kiosk

A Kahoot-style health "Myth or Fact" quiz for a **portrait** touchscreen TV. One visitor plays at a time; scores go
on a local leaderboard. Runs fully offline once loaded.

## Quick start

```bash
npm install
npm run dev        # development at http://localhost:5173
npm test           # unit tests (game logic, scoring, storage)
npm run kiosk      # production build served at http://localhost:4173
```

## Hosting (Vercel)

Live at **https://myth-or-fact-eight.vercel.app**. To publish changes:

```bash
npx.cmd vercel deploy --prod
```

## Venue without internet

See **[EVENT-SETUP.md](EVENT-SETUP.md)**. In short: load the site once on the TV while online (it then runs fully
offline), or install the Android app `release/myth-or-fact.apk`
(download: https://myth-or-fact-eight.vercel.app/download/myth-or-fact.apk).

To rebuild the APK after changes (one-time setup first:
`powershell -ExecutionPolicy Bypass -File scripts\setup-android-sdk.ps1`):

```bash
npm.cmd run apk
```

Then redeploy so the download link serves the new APK.

## Running on the TV

1. Rotate the TV to portrait in Windows display settings (the game is designed at 1080 × 1920 and scales to fit).
2. Start the app with `npm run kiosk` (or copy `dist/` to any static web server).
3. Open Chrome/Edge in kiosk mode so visitors can't leave the game:

   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=https://myth-or-fact-eight.vercel.app --autoplay-policy=no-user-gesture-required --overscroll-history-navigation=0 --disable-pinch
   ```

   `--autoplay-policy=no-user-gesture-required` lets the lobby music start on the start screen before anyone has
   touched it. Without it, the music starts on the first tap.

   To exit kiosk mode press `Alt+F4`.

Add `?noanim` to the URL to disable animations on slow TV browsers.

## Game flow

Start → name (on-screen keyboard) → "QUESTION n" → question with timer → (Time's up) → answer reveal → … →
results → leaderboard → back to start. If nobody touches the screen for 60 s (configurable) it returns to start.

**Music:** `public/assets/welcome.mp3` loops on the start and name screens; `public/assets/bgm.mp3` plays while a
question is on screen; `public/assets/lobby.mp3` loops in between (question intro, reveal, results, leaderboard) and
resumes where it left off. Only one track ever plays at a time. Replace either file (same name) to change a track, and
turn music on/off in Admin → Settings. Volumes are in `src/config.ts` (`MUSIC`).

**Scoring:** correct answers earn 500–1000 points depending on speed (Kahoot formula) plus +100 per answer in a
streak (max +500). Wrong or timed-out answers score 0.

## Admin page

Press and hold the **top-left corner** of the start screen for 3 seconds, then enter the PIN (default **1234** —
change it in Settings). Or go to `#/admin`.

- **Questions** — add, edit, reorder, delete; answer, explanation, optional time limit and reveal image.
- **Settings** — questions per game, shuffle, timer, idle timeout, sound, PIN, and the character images on the
  start/answer screens (replace the placeholder illustrations with your real photos — transparent PNGs look best).
- **Leaderboard** — view all scores or clear them.
- **Backup** — export/import everything (questions, settings, images) as a JSON file, e.g. to set up a second TV.

Data is stored in the browser on that device (localStorage + IndexedDB). Clearing browser data erases it, so keep
a backup.

## Project layout

```
src/game/gameMachine.ts   pure state machine for the whole game (unit tested)
src/game/scoring.ts       speed + streak scoring (unit tested)
src/data/storage.ts       questions, settings, leaderboard, images, backup (unit tested)
src/screens/              one component per game screen
src/admin/                admin page
src/components/           KioskStage (portrait scaling), Ribbon, TimerRing, Logo
src/config.ts             stage size, default PIN, screen timings
public/assets/            placeholder character illustrations
```
