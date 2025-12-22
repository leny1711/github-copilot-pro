# Troubleshooting Guide - React Native Expo App

## Issues Fixed

### 1. AxiosError: Network Error lors du signUp

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

**Key Dependencies:**
- `expo`: ~49.0.0
- `react-native`: 0.72.6
- `axios`: ^1.6.2
- `@react-native-async-storage/async-storage`: 1.18.2

## Build Configuration

### babel.config.js
Uses `babel-preset-expo` for proper Expo/React Native transpilation.

### metro.config.js
Uses default Expo Metro configuration with proper module resolution.

### tsconfig.json
Standard TypeScript configuration for React Native.

## Android Specific Notes

### Hermes
React Native 0.72.6 with Expo 49 has Hermes enabled by default. The fixes applied are compatible with Hermes.

### TurboModules
The app is compatible with the new React Native architecture. The TurboModule error was caused by missing Babel configuration, which is now fixed.

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
- ✅ `mobile/App.tsx` - Removed problematic StatusBar import
- ✅ `mobile/src/services/api.ts` - Updated to use API_CONFIG
- ✅ `mobile/src/services/socket.ts` - Updated to use SOCKET_CONFIG
- ✅ `mobile/src/contexts/AuthContext.tsx` - Enhanced error handling
- ✅ `mobile/.env.example` - Updated with correct documentation

### Issues Resolved:
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
