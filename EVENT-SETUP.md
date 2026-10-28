# Event setup — running Myth or Fact without internet

The game works **fully offline** once it has been loaded on the TV one time. Questions, settings, the leaderboard
and uploaded images are stored on the TV itself, and the game files (pages, pictures, music — about 9 MB) are saved
by the browser on first visit. Internet is only needed **before** the event.

There are two ways to run it. Do the rehearsal test (step 3) whichever you choose.

---

## Option A — Offline web app (main plan)

### 1. Install a browser on the Android TV
Many Android TVs come without a browser. Install **Google Chrome** — it fully supports offline web apps.
- If Chrome is in the TV's Play Store, install it from there.
- If not, install the **Downloader** app (by AFTVnews) from the Play Store and use it to install Chrome, or use
  Option B below instead.

Other TV browsers (TV Bro, Puffin TV, …) may or may not support offline mode — only use one if the rehearsal test
in step 3 passes.

### 2. Load the game once, with internet
Connect the TV to any internet (office Wi-Fi, or a **phone hotspot** — it only uses about 9 MB):
1. Open **https://myth-or-fact-eight.vercel.app** in Chrome.
2. Leave it on the start screen for about **1 minute** (it saves all files in the background).
3. Open Admin (hold the top-left corner for 3 s, PIN `1234`) and check:
   - **Settings → Screen rotation** — if the TV is mounted upright but the game is sideways, pick the rotation
     that makes it read correctly, then Save.
   - **Settings → Questions per game**, sound/music, and change the **PIN**.
   - **Backup → Restore built-in questions** if the question list looks out of date.

### 3. Rehearsal test (do this before the event day)
1. Turn the TV's **Wi-Fi off** (or switch off the hotspot).
2. Close Chrome completely, then open it again and go to the same address.
3. Play one full game: check the pictures, music, answer screens and leaderboard.

If the game loads and plays with Wi-Fi off, the TV is **event-ready**.

### 4. At the event
- No internet needed. Just open Chrome (it remembers the page) and tap START.
- **Do not clear the browser's data or cache** — that erases the offline copy, questions and leaderboard.
- Tip: in Chrome's menu use "Add to Home screen" (if offered) so it opens full screen like an app.

### Updating the game later
The TV only picks up new versions when it is online. After any update, connect it to internet, open the game,
wait a minute, and reload once.

---

## Option B — Android app (backup, needs no browser and no internet at all)

`release/myth-or-fact.apk` is the game packaged as an Android TV app, with everything built in.

### Install on the TV
1. On the TV: **Settings → Device Preferences → Security & restrictions → Unknown sources** — allow the app you
   will install from (File manager or Downloader).
2. Copy `myth-or-fact.apk` to a **USB stick**, plug it into the TV and open it with a file manager, **or** in the
   Downloader app enter: `https://myth-or-fact-eight.vercel.app/download/myth-or-fact.apk`
3. Install. "Myth or Fact" appears on the TV's home screen / apps row.

### Notes
- The app keeps the screen awake, runs full screen and plays the start-screen music without a tap.
- It keeps its **own** questions, settings and leaderboard (separate from the Chrome version) — set the rotation,
  PIN and questions in its Admin page once.
- To update it, install a newer APK over the old one (questions and scores are kept).
