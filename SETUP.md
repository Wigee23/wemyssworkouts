# WemyssWorkouts — Setup Guide
## Get the app on your iPhone and Android in 15 minutes

---

## WHAT YOU NEED
- A Google account (Gmail)
- A phone with Safari (iPhone) or Chrome (Android)
- The files from this folder

---

## PART 1 — SET UP GOOGLE SHEETS SYNC (10 min)

### Step 1 — Create a new Google Sheet
1. Go to **sheets.google.com** on any browser
2. Click the big **+** button to create a blank spreadsheet
3. Name it **WemyssWorkouts** (click "Untitled spreadsheet" at the top)

### Step 2 — Open Apps Script
1. In your Google Sheet, click **Extensions** in the top menu
2. Click **Apps Script**
3. A new tab will open with a code editor

### Step 3 — Paste the script
1. Delete everything currently in the editor (Ctrl+A then Delete)
2. Open the file **apps-script.gs** from this folder in any text editor (Notepad on Windows, TextEdit on Mac)
3. Copy everything (Ctrl+A then Ctrl+C)
4. Paste it into the Apps Script editor (Ctrl+V)

### Step 4 — Set your secret API key
1. In the script, find this line near the top:
   ```
   var API_KEY = 'CHANGE_THIS_TO_YOUR_SECRET_KEY';
   ```
2. Replace **CHANGE_THIS_TO_YOUR_SECRET_KEY** with something memorable, e.g.:
   ```
   var API_KEY = 'WemyssW2026';
   ```
   Write this down — you'll need it later.

### Step 5 — Deploy the script
1. Click **Deploy** (top right) → **New deployment**
2. Click the gear icon next to "Type" → Select **Web app**
3. Set **Execute as:** → **Me**
4. Set **Who has access:** → **Anyone**
5. Click **Deploy**
6. Click **Authorize access** → Choose your Google account → Click **Allow**
7. Copy the **Web app URL** (it starts with `https://script.google.com/macros/s/...`)
   **Save this URL — you need it in the app**

---

## PART 2 — HOST THE APP (5 min)

### Step 6 — Create a free Netlify account
1. Go to **netlify.com**
2. Click **Sign up** → Sign up with your Google account (easiest)

### Step 7 — Deploy the app
1. After signing in, you'll see a big area that says **"Drag and drop your site folder here"**
2. Open your file manager / Finder
3. Find the **wemyssworkouts** folder (this folder you're reading from)
4. Drag the entire **wemyssworkouts** folder onto the Netlify page
5. Wait about 30 seconds — Netlify will give you a URL like `https://random-name-123.netlify.app`
6. Click **Site settings** → **Change site name** → Type **wemyssworkouts** → Save
   Your URL will now be: **https://wemyssworkouts.netlify.app**

---

## PART 3 — INSTALL ON iPHONE (2 min)

1. Open **Safari** on your iPhone (must be Safari, not Chrome)
2. Go to your Netlify URL: **https://wemyssworkouts.netlify.app**
3. Wait for the app to fully load (you'll see the WEMYSSWORKOUTS screen)
4. Tap the **Share button** (the box with an arrow pointing up, at the bottom of Safari)
5. Scroll down and tap **"Add to Home Screen"**
6. Change the name to **WemyssWorkouts** if needed → Tap **Add**
7. The app icon will appear on your home screen

---

## PART 4 — INSTALL ON ANDROID (2 min)

1. Open **Chrome** on your Android phone
2. Go to your Netlify URL
3. Chrome will show a small **"Add to Home Screen"** banner at the bottom — tap it
4. If no banner appears: tap the **three-dot menu** (top right) → **Add to Home screen** → **Add**
5. The app icon appears on your home screen

---

## PART 5 — CONNECT TO GOOGLE SHEETS (2 min)

1. Open the WemyssWorkouts app on your phone
2. Tap **☁️ Sync** at the bottom
3. Paste your **Apps Script URL** (from Step 5) into the URL field
4. Enter your **API Key** (what you set in Step 4)
5. Tap **Save Settings**
6. Tap **Send All Historical Data to Sheets** — this sends your existing sessions to the spreadsheet
7. Go back to your Google Sheet and check — you should see **Strength** and **Cardio** tabs with your data

---

## UPDATING THE APP IN FUTURE

If you receive an updated version of the app:
1. Replace the files in your wemyssworkouts folder with the new ones
2. Go to **Netlify** → Your site → **Deploys** → Drag the updated folder
3. The app on your phone will update automatically within a minute

---

## TROUBLESHOOTING

**App won't install on iPhone:**
- Make sure you're using Safari (not Chrome or Firefox) on iPhone
- Make sure the app has fully loaded before tapping Share

**Sync not working:**
- Double-check the URL — it must start with `https://script.google.com/macros/s/`
- Make sure the API key in the app matches exactly what's in the script (case sensitive)
- Check you're connected to the internet
- In Apps Script: click Deploy → Manage deployments → make sure "Anyone" has access

**Data is gone after phone restart:**
- This shouldn't happen, but if it does: go to Sync → Send All Historical Data to Sheets, then rebuild from there
- This is why the Google Sheets backup exists

**"Error: Unauthorized" in sync:**
- Your API key doesn't match. Re-check Step 4 and Part 5.

---

## HOW SYNCING WORKS

- Every time you log a session, it saves to your phone first (works offline)
- When you're online, it automatically sends to Google Sheets in the background
- If you were offline, it syncs as soon as you open the app with internet
- Google Sheets is your permanent backup — the app is your daily interface

---

## YOUR GOOGLE SHEET TABS

After syncing, your sheet will have:
- **Strength** — Every set from every session (date, exercise, weight, reps, volume)
- **Cardio** — Every cardio session (distance, HR, pace, kcal, effort)
- **Cardio Splits** — Per-kilometre data from each cardio session
- **Biofeedback** — Weekly check-in scores (logged from the Plan screen)

---

*Built for SGT WEMYSS // DFTC // 12-Week Recomp Mesocycle*
