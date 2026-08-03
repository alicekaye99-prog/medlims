# MedLIMS — Electron Edition
## Windows 7 x32 Compatible — Direct Install, No Browser Needed

---

## What You Need (One-Time Setup on Your Build PC)

Install these on your **MAIN PC** (not the Win7 PC):

1. **Node.js v18 LTS (64-bit)** — for building only
   → https://nodejs.org/en/download (choose Windows x64)

2. **Git for Windows** (optional but helpful)
   → https://git-scm.com/download/win

---

## Step 1 — Install Dependencies

Open Command Prompt inside this folder and run:

```
npm install
```

---

## Step 2 — Build the Installer

To build a Windows 32-bit installer (.exe) that works on Windows 7:

```
npm run dist:win32
```

This will create:
```
release/
  MedLIMS Setup 1.0.0.exe   ← This is the installer!
```

---

## Step 3 — Install on Windows 7

1. Copy `MedLIMS Setup 1.0.0.exe` to the Windows 7 PC
2. Double-click to install — no Node.js, no browser, no CMD needed!
3. A desktop shortcut will be created automatically
4. Click the shortcut to open MedLIMS

✅ Works completely OFFLINE
✅ Data saved locally on each PC
✅ No internet required after installation

---

## Notes

- The installer bundles Chromium (browser engine) inside — that's why it's ~150MB
- Data is stored in: `C:\Users\[Username]\AppData\Roaming\MedLIMS\`
- To uninstall: Control Panel → Programs → MedLIMS → Uninstall

---

## Development Mode (on your build PC)

To run in development (live reload):
```
npm run dev
```

---

## Troubleshooting

**"electron-builder" error on build:**
→ Run `npm install` again, then retry

**"NSIS" error:**
→ electron-builder downloads NSIS automatically. Make sure you have internet on your build PC.

**App won't open on Win7:**
→ Make sure Windows 7 SP1 is installed with all Windows Updates

---

Created for MedLIMS by Bryce Men Kenk C. Ablir, RMT
