# Aftershock Android and iPhone app

This is a bundled Capacitor 8 app with Android and iOS projects, plus a hosted home-screen app at `/team-app`. The native app does not load a remote `server.url` wrapper. One canonical team config and the existing Sites/D1 API keep calendar, attendance, and owner permissions consistent.

Included: app navigation, month/agenda calendar, event details/directions, RSVP save/update/remove, private attendance, owner event creation/editing/cancellation, native sharing, optional local reminders, haptics, offline public schedule snapshots, encrypted native sessions, sign-out/revocation, and attendance-data deletion. Trent’s call/email actions use the canonical contact config.

## Build

Install Node 22+, Java 21, and Android Studio with SDK 36. For iOS use a Mac with Xcode 26+.

```sh
cd mobile
npm ci
npm run sync
npm run android
# Or on a Mac:
npm run ios
```

Android terminal build: `cd android && ./gradlew assembleDebug bundleRelease`. The debug APK is a testing build, not a Play release. `bundleRelease` produces an unsigned release AAB until Trent’s upload key is configured. The iOS Xcode project uses Swift Package Manager; set Trent’s Apple development team and signing identity before Archive. The CI workflow builds Android and an unsigned iOS simulator target; it does not automatically publish or use signing secrets.

Brand icons come from the existing monogram using `python scripts/icons.py`. The working Aftershock identity/initial roster/events remain samples; confirm the official team identity before store submission. Change app name/ID before its first store registration if needed, then keep the registered IDs stable.

## Secure account connection

Native sign-in opens the existing Sites-owned ChatGPT sign-in in a system browser. The signed-in user explicitly approves a five-minute, PKCE-bound phone connection. The app exchanges the proof once and stores only its revocable 30-day session in iOS Keychain/Android Keystore. The backend stores a hash, never the plaintext token. Permissions are checked against the current server allowlist on every request. No platform service token or app secret is embedded in the client. Web/PWA mode uses the existing dispatch-owned browser session, never the secure-storage plugin’s insecure web fallback.

Public schedules can be viewed offline, with a visible snapshot time. Private notes are not in the offline cache; attendance mutations require the live API. Reminders are local device preferences and require explicit notification permission. Changes/cancellations reconcile when the user refreshes current events; this build does not claim push delivery of remote schedule changes while the app is closed.

## Store handoff

See `store/RELEASE.md` for developer-account/signing steps, official tool links, privacy fields, and review requirements. The supplied projects and test builds are not claimed to be published in either store. No Apple signing or iOS device execution can be completed on the Linux build host.
