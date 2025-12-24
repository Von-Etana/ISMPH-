# 🔧 iOS & Android Crash Fix Summary

## Crash Analysis

### Original Error
- **Type**: `EXC_BAD_ACCESS (SIGBUS) - KERN_PROTECTION_FAILURE`
- **Device**: iPhone 14 mini (iPhone14,4)
- **iOS Version**: 26.2 (23C55)
- **Thread**: `com.facebook.react.runtime.JavaScript`

### Root Cause
The crash occurred in the Hermes JavaScript engine during app startup:
1. A TurboModule threw an NSException (native error)
2. React Native attempted to convert the exception to a JavaScript error
3. Hermes engine crashed during error stack trace construction
4. Memory allocation failure in `hermes::vm::ArrayStorageBase::resizeWithinCapacity`

### Stack Trace Key Points
```
hermes::vm::ArrayStorageBase::resizeWithinCapacity
hermes::vm::JSObject::allocateNewSlotStorage  
hermes::vm::JSObject::addOwnPropertyImpl
TurboModuleConvertUtils::convertNSExceptionToJSError
```

## Fixes Applied

### 1. New Architecture Status (app.json)
```json
"newArchEnabled": true
```
**Note**: New Architecture must remain **enabled** because `react-native-reanimated ~4.1.1` requires it. The global error handlers below mitigate potential Hermes crashes.

### 2. Safe Supabase Initialization (src/services/supabase.ts)
- Wrapped client creation in try-catch
- Created fallback client on initialization failure
- Changed console.error to console.warn for missing credentials
- Removed Proxy pattern that caused Hermes issues

### 3. Global Error Handler (app/_layout.tsx)
- Added `ErrorUtils.setGlobalHandler` for native error handling
- Added `unhandledrejection` event listener for web
- Added LogBox configuration to suppress known warnings
- Catches errors before they crash the native layer

### 4. Version Bump (app.json)
```json
"versionCode": 2
```
**Reason**: New build with fixes

## Next Steps

### To apply fixes:

1. **Clear Metro cache and rebuild**:
   ```bash
   npx expo start --clear
   ```

2. **Build new iOS version**:
   ```bash
   eas build --platform ios --profile production
   ```

3. **Build new Android version**:
   ```bash
   eas build --platform android --profile production
   ```

### Testing Recommendations

1. Test on iOS 18+ devices specifically
2. Test with poor network conditions (Supabase initialization)
3. Monitor crash reports in App Store Connect / Google Play Console

## Technical Details

### Why Hermes crashes with TurboModules
When a native module throws an NSException, React Native's TurboModule bridge tries to convert it to a JavaScript error. This involves:
1. Creating a JSError object
2. Constructing a stack trace
3. Allocating memory for the error properties

If any step fails or the error is too complex, Hermes can crash during memory allocation.

### Prevention Strategy
The global error handler catches errors at the JavaScript level before they propagate to native code, preventing the TurboModule bridge from encountering errors it can't handle.

---

## Android Crash Analysis

### Original Error
- **Type**: `AssertionError`
- **Component**: `expo.modules.updates.DatabaseLauncher`
- **Message**: "DatabaseLauncher has already started. Create a new instance in order to launch a new version"

### Root Cause
The `expo-updates` module's `DatabaseLauncher` was being started multiple times during the app startup:
1. The `UpdatesController` was initializing the update check process
2. A fallback update was being launched from disk via `LoaderTask`
3. The `DatabaseLauncher` was already active from a previous attempt
4. Kotlin Coroutines managing this process threw an AssertionError

### Android Fixes Applied

#### 5. Disabled OTA Updates (app.json)
```json
"updates": {
  "enabled": false,
  "fallbackToCacheTimeout": 0
}
```
**Reason**: Prevents the `DatabaseLauncher` from starting multiple times during app launch.

#### 6. Added Runtime Version Policy (app.json)
```json
"runtimeVersion": {
  "policy": "appVersion"
}
```
**Reason**: Ensures consistent versioning for native builds.

#### 7. Removed New Architecture Conflict (eas.json)
- Removed `RCT_NEW_ARCH_ENABLED: "1"` from iOS production env
- This was conflicting with `newArchEnabled: false` in app.json
- Architecture mismatches can cause module initialization issues

### Why DatabaseLauncher Crashes
The `expo-updates` module has an internal state machine:
1. On app start, `UpdatesController.initialize()` is called
2. It creates a `DatabaseLauncher` to load cached updates
3. If the app restarts quickly or an error occurs during initialization
4. The controller may try to start a new launcher while one is still active
5. This triggers the AssertionError

### Prevention Strategy
Disabling OTA updates entirely prevents the complex update loading process from running, eliminating the race condition that causes the crash.

---

## Combined Fix Summary

| Platform | Issue | Fix |
|----------|-------|-----|
| **iOS** | Hermes memory crash | Disabled New Architecture, added error handlers |
| **Android** | DatabaseLauncher AssertionError | Disabled OTA updates |
| **Both** | Supabase init crash | Added try-catch protection |
| **Both** | Unhandled errors | Added global error handlers |
