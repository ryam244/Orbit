PRE_BUILD_CHECK.md - iOS App Store Submission & Integrity Audit
1. Trigger
Run this audit immediately before executing eas build or npx expo prebuild. You act as an Apple App Store Reviewer and a DevOps Engineer. Be strict.

2. Environment & Secrets Integrity (CRITICAL: Anti-White Screen)
Prevent the "White Screen of Death" caused by missing .env variables.

A. EAS Configuration (eas.json / Secrets)
[ ] Secret Existence: Are all variables (e.g., SUPABASE_URL) added to EAS Secrets on the dashboard? (Local .env is ignored by EAS unless configured).

[ ] EAS Build Profile: Does the production profile in eas.json correctly map the channel or env?

B. Build-Time Validation (app.config.ts)
Ensure the build fails on the server if keys are missing, rather than crashing the app at runtime.

[ ] Validation Logic: Does app.config.ts contain a check like this?

// Example logic to verify inside app.config.ts
const checkEnv = (key: string) => {
  if (!process.env[key]) {
    throw new Error(`CRITICAL BUILD ERROR: Missing env variable: ${key}`);
  }
};
checkEnv('EXPO_PUBLIC_SUPABASE_URL');

[ ] Prefix Check: Do client-side variables start strictly with EXPO_PUBLIC_?

3. Configuration Audit (app.json / app.config.ts)
A. Identity & Versioning
[ ] Bundle Identifier: Is it unique and correct? (e.g., com.company.appname)

[ ] Version: Is it strictly explicitly semantic (e.g., 1.0.0)?

[ ] Build Number: Is ios.buildNumber incremented from the previous build?

[ ] Display Name: Does name match what users expect on the home screen?

B. Privacy & Permissions (Crucial for Rejection Prevention)
Scan ios.infoPlist keys.

[ ] Usage Descriptions: Are ALL requested permissions explained in plain language?

NSCameraUsageDescription: Required if camera is used.

NSPhotoLibraryUsageDescription: Required for image picking.

NSLocationWhenInUseUsageDescription: Required for maps/location.

Fail if generic text like "Need access" is used. Must be specific: "Used to take profile photos."

[ ] Tracking (ATT): If using AdMob or analytics, is NSUserTrackingUsageDescription defined?

[ ] Privacy Policy: Is a valid URL placeholder prepared in the settings or config?

4. Mandatory Feature Compliance (Guideline 5.1.1 & 4.8)
A. Account Management
[ ] Account Deletion: If the app allows Account Creation, does it have an In-App Account Deletion feature? (Mandatory since June 2022).

[ ] Sign in with Apple: If using Google/Facebook login, is Sign in with Apple also implemented? (Mandatory).

B. User Generated Content (If applicable)
[ ] EULA: Is there a Terms of Service agreement screen?

[ ] Reporting: Is there a mechanism to report/block abusive users?

5. Asset & File Integrity
[ ] Icons: Are icon.png (1024x1024) and adaptive-icon.png present?

[ ] Splash Screen: Is splash.png correctly configured?

[ ] AdMob: If using ads, is app-ads.txt content prepared for the website?

6. Logic & Behavior "Red Flags"
[ ] No Infinite Loops: Check useEffect dependencies to ensure no read/write loops.

[ ] No Private APIs: Ensure no unapproved native methods are called.

[ ] Mock Data: Are all "Lorem Ipsum" or placeholder text removed?

[ ] Debug Flags: Are logs (console.log) and dev tools disabled or hidden for production?

7. Audit Report Format
After scanning, provide a report:

## 🚀 Pre-Build Readiness Report

### ✅ PASSED
- Bundle ID: com.example.app
- Permissions: All descriptions present.

### ⚠️ WARNINGS (Fix recommended)
- Console logs are still visible.

### ⛔ CRITICAL FAILURES (Must fix before build)
- [Env] 'EXPO_PUBLIC_API_KEY' is missing in app.config.ts check. Build will fail or screen will be white.
- [Rejection Risk] Account Deletion feature is missing.
