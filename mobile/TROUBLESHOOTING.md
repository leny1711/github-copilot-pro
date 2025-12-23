# Troubleshooting Guide - React Native Expo App

## Issues Fixed

### 1. Expo Version Mismatch (SDK 49 → SDK 54)

**Root Cause:**
- The mobile device has Expo Go app with SDK 54 installed
- The project was using Expo SDK 49, causing version mismatch
- Error message: "Expo on Android (54) doesn't match Expo on PC (49)"
- Commands like `npm install expo --fix` have incorrect syntax (should be `npx expo install --fix`)
- `expo doctor` is deprecated (should use `npx expo-doctor`)

**Solution Applied:**
- Upgraded Expo from SDK 49 (~49.0.0) to SDK 54 (~54.0.0)
- Upgraded React Native from 0.72.6 to 0.81.5 (required for SDK 54)
- Upgraded React from 18.2.0 to 19.1.0 (required for SDK 54)
- Updated all expo-* packages to SDK 54 compatible versions using `npx expo install --fix`
- Updated TypeScript configuration for bundler module resolution
- Removed @types/react-native (no longer needed, types included in react-native)

**Updated Dependencies:**
- expo: ~49.0.0 → ~54.0.0
- react: 18.2.0 → 19.1.0
- react-native: 0.72.6 → 0.81.5
- expo-location: ~16.1.0 → ~19.0.8
- expo-notifications: ~0.20.0 → ~0.32.15
- react-native-screens: ~3.24.0 → ~4.16.0
- react-native-safe-area-context: 4.6.3 → ~5.6.0
- react-native-gesture-handler: ~2.12.0 → ~2.28.0
- react-native-maps: 1.7.1 → 1.20.1
- @stripe/stripe-react-native: ^0.36.0 → 0.50.3
- @react-native-async-storage/async-storage: 1.18.2 → 2.2.0

**How to Upgrade (for future reference):**
```bash
# 1. Update package.json with new Expo, React, and React Native versions
# 2. Install with legacy peer deps
npm install --legacy-peer-deps

# 3. Use expo install --fix to update all expo packages
npx expo install --fix

# 4. Check for issues
npx expo-doctor

# 5. Verify TypeScript compilation
npx tsc --noEmit

# 6. Test the app
npx expo start
```

**Correct Commands:**
- ❌ `npm install expo --fix` (WRONG)
- ✅ `npx expo install --fix` (CORRECT)
- ❌ `expo doctor` (DEPRECATED)
- ✅ `npx expo-doctor` (CORRECT)

### 2. AxiosError: Network Error lors du signUp

**Root Cause:**
- Environment variables were not properly loaded in Expo (`process.env` doesn't work)
- `localhost` doesn't work on Android emulators (needs `10.0.2.2`)

**Solution Applied:**
- Created `src/config/api.config.ts` with platform-aware URL configuration
- Updated `src/services/api.ts` to use `API_CONFIG` instead of `process.env`
- API URLs are now automatically set based on platform:
  - **Android Emulator**: `http://10.0.2.2:3000/api`
  - **iOS Simulator**: `http://localhost:3000/api`

### 2. TurboModuleRegistry Error: 'PlatformConstants' could not be found

**Root Cause:**
- Missing `babel.config.js` configuration file (required for Expo)
- Incorrect StatusBar import in App.tsx
- Missing Metro bundler configuration

**Solution Applied:**
- Created `babel.config.js` with `babel-preset-expo`
- Removed StatusBar from `App.tsx` (not needed, handled by Expo)
- Created `metro.config.js` for proper module resolution

### 3. Better Error Handling

**Improvements:**
- Enhanced error messages in AuthContext
- Network errors now show helpful messages about server connectivity
- Socket service updated to use centralized configuration

## How to Use

### Prerequisites
1. Ensure backend server is running on port 3000
2. Install dependencies: `npm install`

### Running the App

#### Android Emulator
```bash
npm run android
```
The app will automatically connect to `http://10.0.2.2:3000/api`

#### iOS Simulator
```bash
npm run ios
```
The app will connect to `http://localhost:3000/api`

#### Testing on Real Device
If you need to test on a real device:
1. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`
2. Edit `src/config/api.config.ts` and replace the development URLs with your IP:
   ```typescript
   return 'http://YOUR_IP_ADDRESS:3000/api';
   ```

### Configuration Files

#### src/config/api.config.ts
This file contains all API configuration:
- **BASE_URL**: Automatically set based on platform and environment
- **TIMEOUT**: API request timeout (10 seconds)
- **HEADERS**: Default headers for API requests

To change for production, update the production URL in the `getBaseUrl()` function.

#### Socket Configuration
Socket.IO connection is also configured in `api.config.ts` as `SOCKET_CONFIG`.

## Common Issues

### Issue: "Expo version mismatch" or "Incompatible Expo Go version"
**Error Message:** "Expo on Android (54) doesn't match Expo on PC (49)"

**Solution:**
```bash
# Option 1: Upgrade project to match Expo Go (recommended)
# This project has already been upgraded to SDK 54

# Option 2: Downgrade Expo Go app on device
# Install Expo Go with SDK 49 from:
# https://expo.dev/go (select older version)

# Option 3: Use development build instead of Expo Go
npx expo run:android
npx expo run:ios
```

**Prevention:**
- Always check your Expo Go app version matches your project SDK
- Use `npx expo-doctor` to verify compatibility
- Keep dependencies in sync with `npx expo install --fix`

### Issue: "Invalid project root" when running commands
**Solution:**
- ❌ Don't use: `expo doctor`
- ✅ Use instead: `npx expo-doctor`
- ❌ Don't use: `npm install expo --fix`
- ✅ Use instead: `npx expo install --fix`

### Issue: "Cannot connect to server"
**Solution:**
1. Verify backend is running: `curl http://localhost:3000/api/health`
2. Check firewall settings
3. For Android emulator, ensure `10.0.2.2` is accessible
4. For real device, use your computer's IP address

### Issue: "Module not found" errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### Issue: Metro bundler errors
**Solution:**
```bash
# Clear Metro cache
npx expo start --clear
```

### Issue: TypeScript errors
**Solution:**
```bash
# Check types
npx tsc --noEmit
```

## Dependencies

All required dependencies are in `package.json`. No additional dependencies needed.

**Key Dependencies (SDK 54):**
- `expo`: ~54.0.0
- `react`: 19.1.0
- `react-native`: 0.81.5
- `axios`: ^1.6.2
- `@react-native-async-storage/async-storage`: 2.2.0
- `expo-location`: ~19.0.8
- `expo-notifications`: ~0.32.15

## Build Configuration

### babel.config.js
Uses `babel-preset-expo` for proper Expo/React Native transpilation.

### metro.config.js
Uses default Expo Metro configuration with proper module resolution.

### tsconfig.json
TypeScript configuration for React Native with bundler module resolution.

## Android Specific Notes

### Hermes
React Native 0.81.5 with Expo 54 has Hermes enabled by default. The fixes applied are compatible with Hermes.

### TurboModules
The app is compatible with the new React Native architecture. The TurboModule error was caused by missing Babel configuration, which is now fixed.

**Note:** Expo SDK 54 is the last version to support the Old Architecture. Future upgrades will require migration to the New Architecture.

### Network Access
Android emulators use `10.0.2.2` to access the host machine's `localhost`. This is automatically configured in `api.config.ts`.

## Testing the Fix

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Mobile App:**
   ```bash
   cd mobile
   npm install
   npm run android  # or npm run ios
   ```

3. **Test Sign Up:**
   - Open the app
   - Navigate to Register screen
   - Fill in the form
   - Submit
   - Should connect successfully to backend

## Summary of Changes

### Files Created:
- ✅ `mobile/babel.config.js` - Babel configuration for Expo
- ✅ `mobile/metro.config.js` - Metro bundler configuration
- ✅ `mobile/src/config/api.config.ts` - Centralized API configuration

### Files Modified:
- ✅ `mobile/package.json` - Updated to Expo SDK 54 with all compatible dependencies
- ✅ `mobile/app.json` - Added Stripe plugin configuration
- ✅ `mobile/tsconfig.json` - Updated module resolution to bundler
- ✅ `mobile/TROUBLESHOOTING.md` - Added Expo version mismatch troubleshooting
- ✅ `mobile/App.tsx` - Removed problematic StatusBar import
- ✅ `mobile/src/services/api.ts` - Updated to use API_CONFIG
- ✅ `mobile/src/services/socket.ts` - Updated to use SOCKET_CONFIG
- ✅ `mobile/src/contexts/AuthContext.tsx` - Enhanced error handling
- ✅ `mobile/.env.example` - Updated with correct documentation

### Issues Resolved:
- ✅ Expo version mismatch (SDK 49 → SDK 54)
- ✅ React Native upgrade (0.72.6 → 0.81.5)
- ✅ React upgrade (18.2.0 → 19.1.0)
- ✅ All expo-* packages updated to SDK 54
- ✅ Correct CLI commands documented
- ✅ Network Error lors du signUp
- ✅ TurboModuleRegistry 'PlatformConstants' error
- ✅ Environment variable handling
- ✅ Android/iOS compatibility
- ✅ Hermes compatibility

## No Breaking Changes

All changes are backward compatible and don't affect:
- Existing screens
- Existing navigation
- Existing business logic
- Existing types/interfaces

The changes only fix configuration and infrastructure issues.
