# App build verification — 2 October 2026

Working identity: Aftershock. Trent is the confirmed team owner/contact: 720-292-6603, trent@kerrpanel.com. The roster, original events, and working team name remain clearly marked samples until approved team content is supplied.

## Published companion

The public companion is available at https://travel-softball-team.becky-herbie-6815.chatgpt.site/team-app. The website and app share the same durable schedule and attendance API. Privacy and deletion pages are published. Sites deployment `appgdep_6ac01c503688819197e6ec9ad13a817e` succeeded with environment revision 2. Production D1 contains `events`, `rsvps`, `app_connections`, and `app_sessions`.

## Verified behavior

Real D1 integration tests pass for persistence across restart, signed-in response ownership, manager authorization, private attendance, CSRF/unsafe origins, validation, stale schedule edits, cancellations/deadlines, calendar exports, PKCE connection approval/proof, native sessions, revocation, and data deletion.

Real Chromium exercises the bundled phone interface: all four tabs, month navigation/date/event dialogs, Trent’s phone/email links, authorized event creation, RSVP save/update/reload/removal, failed-write input retention, drafts surviving connection loss, PWA shell/offline restart, and private names/notes excluded from browser storage. Layouts pass at 320, 390, and 768 pixels with normal and 200% text. No JavaScript errors were observed. Dedicated timezone tests verify 24-hour timed reminders and 9 AM previous-day all-day reminders across both Mountain-time daylight-saving changes.

## Android artifacts

The actual Android project successfully compiles with Java 21, Android SDK 36, and Gradle 8.14.3. The APK signature verifies. Package ID is `com.travelsoftball.team`, version 1.0.0/build 1, minimum SDK 24, target/compile SDK 36. Packaged app/config bytes match the final bundled frontend.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| Aftershock-Android-Test.apk | 4,353,795 | 3ba44efd420eebeaadde0894b76ccd067c22b08fd9f29ac8d838990eb280882d |
| Aftershock-Android-Unsigned.aab | 3,139,022 | 7faf586517b27f6db9d4123d6271317f2a62ef4586da25b3802030bbb2492cbe |

The APK uses a development signing key for testing. The AAB is verified unsigned; configure Trent’s upload key before Play submission. A successful build is not an Android device runtime test.

## iPhone artifact

The genuine Xcode project successfully compiles for the iOS Simulator on the GitHub macOS runner. The final reminder-fix build also passes the Xcode simulator target. Final successful job: https://github.com/Herbertofury/Travel-Softball-Team/actions/runs/37066075545/job/111034063586. Its uploaded simulator artifact is https://github.com/Herbertofury/Travel-Softball-Team/actions/runs/37066075545/artifacts/11252309295. This is a simulator app, not an installable phone IPA or a TestFlight release.

## Release requirements

Use Trent’s Apple/Google developer accounts for production signing and store records. Confirm the official team identity, replace sample content, test the browser approval/encrypted session/reminders/sharing/deletion on real Android and iPhone devices, complete store privacy/age-rating disclosures, and resolve Apple’s applicable login-services review requirements. See [the complete release handoff](RELEASE.md). Neither store publication nor platform Site ownership transfer is claimed.

## Build recovery knowledge

An Android bootclasspath/provider failure came from an SDK payload installed one directory below its expected location. The installed platform folder lacked its top-level `android.jar`; copying the verified API 36 payload into the correct SDK layout repaired the environment, and the complete APK/AAB build passed. No project SDK level or features were reduced. Validate the platform file before compiling rather than repeating the same failed build.

CI no longer requests Google’s removed `tools` package or assumes `sdkmanager` is on PATH. It uses the verified SDK manager location from the hosted runner and current official build actions. App-store signing credentials remain outside the repository.

The final full CI run passes all three jobs (shared API, Android APK/AAB, and iOS Simulator): https://github.com/Herbertofury/Travel-Softball-Team/actions/runs/37066075545. Final Android CI artifact: https://github.com/Herbertofury/Travel-Softball-Team/actions/runs/37066075545/artifacts/11252344067. An incremental local ART-profile cache failure was repaired by cleaning the generated app build output and rebuilding; the clean final build passed with profile compilation enabled.
