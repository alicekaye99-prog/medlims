# MedLIMS — Build Guide
### Created by Bryce Men Kenk C. Ablir, RMT

---

## Prerequisites
Make sure these are installed:
- Node.js (https://nodejs.org)
- Run `npm install` once before building

---

## Build Commands

Open CMD in the `medlims-electron` folder and run:

---

### Windows 7 (32-bit only)
```
npm run dist:win7-x86
```
Output: `release/win7-x86/MedLIMS-Setup-Win7-x86.exe`
Use this for: Old PCs, Windows 7 32-bit

---

### Windows 10/11 — 32-bit (x86)
```
npm run dist:win10-x86
```
Output: `release/win10/MedLIMS-Setup-Win10-ia32.exe`
Use this for: Windows 10/11 older/32-bit PCs

---

### Windows 10/11 — 64-bit (x64)
```
npm run dist:win10-x64
```
Output: `release/win10/MedLIMS-Setup-Win10-x64.exe`
Use this for: Modern Windows 10/11 PCs (most common)

---

### Windows 10/11 — Both x86 AND x64 at once
```
npm run dist:win10-both
```
Output: Both files above in `release/win10/`

---

## Which one should I use?

| Computer | Use this installer |
|---|---|
| Windows 7 | MedLIMS-Setup-Win7-x86.exe |
| Windows 10/11 older PC | MedLIMS-Setup-Win10-ia32.exe |
| Windows 10/11 modern PC | MedLIMS-Setup-Win10-x64.exe |
| Not sure (Win10/11) | Use x64 — most PCs today are 64-bit |

---

## How to check if a PC is 32 or 64 bit (Windows 10)
1. Right-click **This PC** → Properties
2. Look for **System type**
3. It will say "32-bit operating system" or "64-bit operating system"
