# 🆘 SafeSignal — Emergency Communication App
 
A mobile-first, one-tap emergency communication app built with React. Converts button presses into voice alerts, shares your GPS location, and works offline as a PWA.
 
## ✨ Features
 
| Feature | Status |
|---|---|
| One-tap HELP / MEDICAL / POLICE buttons | ✅ |
| Text-to-Speech (Web Speech API) | ✅ |
| Speech-to-Text (voice input) | ✅ |
| GPS Location sharing (Google Maps link) | ✅ |
| Vibration + screen flash alerts | ✅ |
| Emergency contact management | ✅ |
| Custom phrase builder | ✅ |
| Alert history | ✅ |
| Offline mode (PWA + Service Worker) | ✅ |
| Mobile-first, accessible UI | ✅ |
 
---
 
## 🚀 Quick Start
 
```bash
# 1. Install dependencies
npm install
 
# 2. Run dev server
npm run dev
 
# 3. Build for production
npm run build
 
# 4. Preview production build
npm run preview
```
 
---
 
## 📁 Project Structure
 
```
safesignal/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── context/
│   │   └── AppContext.jsx     # Global state (contacts, phrases, history)
│   ├── pages/
│   │   ├── Home.jsx           # Main SOS screen
│   │   ├── Contacts.jsx       # Emergency contacts
│   │   ├── Phrases.jsx        # Custom phrases
│   │   ├── History.jsx        # Alert history
│   │   └── Settings.jsx       # App settings
│   ├── components/
│   │   └── Layout.jsx         # App shell + bottom nav
│   ├── utils/
│   │   └── helpers.js         # TTS, geolocation, vibration, flash
│   ├── App.jsx                # Router setup
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles + design tokens
├── index.html
├── vite.config.js             # Vite + PWA plugin config
└── package.json
```
 
---
 
## 🐙 GitHub Setup — Step by Step
 
### Step 1: Create a GitHub Account
Go to [github.com](https://github.com) → Sign up (free)
 
### Step 2: Install Git on Your Computer
 
**Windows:** Download from [git-scm.com](https://git-scm.com/downloads)  
**Mac:** Run `xcode-select --install` in Terminal  
**Ubuntu/Linux:** `sudo apt install git`
 
Verify: `git --version`
 
### Step 3: Configure Git (one time only)
 
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
 
### Step 4: Create a New Repo on GitHub
 
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `safesignal-emergency-app`
3. Keep it **Public** (or Private)
4. ❌ Do NOT check "Add README" (we already have one)
5. Click **Create repository**
 
### Step 5: Initialize Git in Your Project
 
```bash
# Navigate to your project folder
cd safesignal-emergency-app
 
# Initialize git
git init
 
# Add all files
git add .
 
# First commit
git commit -m "feat: initial SafeSignal emergency app"
```
 
### Step 6: Connect & Push to GitHub
 
Copy the commands from your GitHub repo page, or run:
 
```bash
git remote add origin https://github.com/YOUR_USERNAME/safesignal-emergency-app.git
git branch -M main
git push -u origin main
```
 
### Step 7: Add a .gitignore
 
Create a `.gitignore` file in the root:
 
```
node_modules/
dist/
.env
.DS_Store
*.local
```
 
Then:
```bash
git add .gitignore
git commit -m "chore: add gitignore"
git push
```
 
---
 
## 🌐 Deploy to the Web (Free) — Vercel
 
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `safesignal-emergency-app` repo
4. Framework: **Vite**
5. Click **Deploy** → done!
 
Your app gets a live URL like `https://safesignal.vercel.app`
 
---
 
## 📱 Install as PWA
 
After deploying, visit your URL on mobile:
- **Android (Chrome):** tap ⋮ → "Add to Home Screen"
- **iOS (Safari):** tap Share → "Add to Home Screen"
 
App works **offline** after first load!
 
---
 
## 🔮 Future Enhancements
 
- [ ] Twilio SMS integration (send SMS to contacts)
- [ ] Firebase backend (cloud sync)
- [ ] Multi-language TTS
- [ ] SOS siren sound
- [ ] Shake-to-activate feature
- [ ] Login + cloud contacts sync
 
---
 
## 🛡️ Privacy
 
All data stays on your device. No servers, no tracking, no data collection.
 
---
 
Made with ❤️ for real-world safety.