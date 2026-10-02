# Store release handoff for Trent

Contact: Trent — 720-292-6603 — trent@kerrpanel.com. Working app identity: Aftershock, bundle/application ID `com.travelsoftball.team`, version 1.0.0, build 1. Confirm the team name, branding, real roster/schedule, and final unique bundle IDs before creating store records. The current illustrative team data is intentionally labeled and should be replaced before a public team release.

## Accounts and tools

- Apple Developer enrollment: https://developer.apple.com/programs/enroll/
- App Store Connect: https://appstoreconnect.apple.com/
- Google Play Console: https://play.google.com/console/
- Android Studio: https://developer.android.com/studio
- Xcode: https://developer.apple.com/xcode/
- Capacitor environment requirements: https://capacitorjs.com/docs/getting-started/environment-setup

Use Trent’s developer accounts or organization account, not a personal assistant account. Signing keys, certificates, provisioning profiles, and store API credentials stay outside source. This repository supplies a debug APK build and an unsigned AAB build path; production signatures and store submission require those accounts.

## Android

Open `mobile/android` in Android Studio. Install Android SDK 36 and Java 21, run `npm ci` and `npm run sync` from `mobile`, then generate a signed Android App Bundle through Build → Generate Signed Bundle / APK. Preserve the upload key securely and enable Play App Signing. Upload first to internal testing. Complete contact details, target audience/age rating, privacy policy, data safety, and required tester/review checks. Do not describe the app as an official confirmed team before the sample content is replaced.

## iPhone

On a Mac with Xcode 26+, run `npm ci` and `npm run sync`, then open `mobile/ios/App/App.xcodeproj`. Select Trent’s team and the registered bundle ID. Build/run on real iPhone and iPad, test system-browser sign-in, keychain session, reminders with denied/granted permissions, sharing, phone/email links, offline restart, and data deletion. Archive for distribution, upload to TestFlight, then submit the tested build through App Store Connect. Signing and an IPA are not claimed from the Linux build environment.

## Review and identity

Review Apple’s current login-services rule (4.8) for the ChatGPT-connected companion-account flow before submission. If Apple requires an equivalent privacy-preserving login option for this account model, configure Sign in with Apple under Trent’s developer account and integrate it before submission; do not claim the current flow automatically meets that exception or that approval is guaranteed. Reviewers need access to account-based features through a valid test account or an approved fully functional demonstration mode. This build has no fake production sign-in/demo bypass.

Official review requirements: https://developer.apple.com/app-store/review/guidelines/

## Privacy and listing

Privacy URL: https://travel-softball-team.becky-herbie-6815.chatgpt.site/privacy

External data-deletion URL: https://travel-softball-team.becky-herbie-6815.chatgpt.site/delete-data

Support URL: https://travel-softball-team.becky-herbie-6815.chatgpt.site/#contact

Data to disclose accurately: user-entered player/family name, attendance, guests, optional notes, update time, site-specific account identifier, and account email used for app connection/authorization. These support app functionality; no ads, analytics SDKs, background location, or contacts-address-book access are included. Notifications are optional local device reminders. Inspect provider logging and privacy requirements with Trent before submitting final data-safety/App Privacy answers. The live privacy page describes collection, visibility, storage, retention, deletion, and providers.

App description draft: “Keep the team’s schedule close. View games, practices, and tournament weekends; save your attendance; check field directions; set an optional reminder; and contact Trent. Team schedule managers can update events and review private attendance.”

Create store screenshots from the actual app with confirmed content. No fabricated store badges, download counts, reviews, or availability claims are included.
