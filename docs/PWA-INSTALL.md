# SDSP — Install as PWA (Phone)

## Android (Chrome)

1. Open https://bhargavsinh.github.io/shri-devdamanlalprabhu-seva-planner/
2. Tap the **menu (⋮)** → **Install app** or **Add to Home screen**
3. Confirm. The app opens full-screen without browser chrome.

## iPhone (Safari)

1. Open the same URL in Safari
2. Tap **Share** → **Add to Home Screen**
3. Name it **SDSP** → Add

## Requirements for install prompt

- Served over HTTPS (GitHub Pages provides this)
- Valid Web App Manifest
- Service worker registered
- Icons present (generated on build)

## After install

- Works offline for cached shell + your local IndexedDB data
- Data stays on the device (local-first)
- Use Settings to enable optional PIN lock (UI only, not encryption)
