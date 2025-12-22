# Verification Steps - Quick Start Guide

## Prerequisites Check

Before running the app, ensure:
- [x] Node.js installed (v16 or higher)
- [x] npm or yarn installed
- [x] For iOS: Xcode installed (Mac only)
- [x] For Android: Android Studio with Android SDK installed

## Backend Setup (Required)

The mobile app needs the backend server running:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# You should see:
# Server running on port 3000
```

Verify backend is running:
```bash
curl http://localhost:3000/api/health
# Should return health check response
```

## Mobile App Setup

### Step 1: Install Dependencies

```bash
cd mobile
npm install
```

Expected output: All dependencies installed without errors.

### Step 2: Verify Configuration Files

Check that these files exist:
```bash
# Critical files for the fixes
ls -la babel.config.js          # ✅ Babel configuration
ls -la metro.config.js           # ✅ Metro configuration
ls -la src/config/api.config.ts  # ✅ API configuration
```

### Step 3: Run TypeScript Check

```bash
npx tsc --noEmit
```

Expected: No errors (exit code 0)

### Step 4: Start Metro Bundler

```bash
npm start
# or
npx expo start
```

Expected output:
```
Starting Metro Bundler
Metro is running...
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

## Testing on Different Platforms

### Android Emulator

1. **Start Android Emulator** from Android Studio, or:
   ```bash
   # List available emulators
   emulator -list-avds
   
   # Start an emulator
   emulator -avd YOUR_AVD_NAME
   ```

2. **Run the app**:
   ```bash
   npm run android
   ```

3. **Expected behavior**:
   - App builds successfully
   - Metro bundler connects
   - App opens on emulator
   - No "Network Error" on signup/login
   - No TurboModule errors

4. **Network configuration used**:
   - API: `http://10.0.2.2:3000/api` (automatically configured)
   - Socket: `http://10.0.2.2:3000`

### iOS Simulator (Mac only)

1. **Run the app**:
   ```bash
   npm run ios
   ```

2. **Expected behavior**:
   - Simulator launches
   - App builds and runs
   - No network errors
   - No module errors

3. **Network configuration used**:
   - API: `http://localhost:3000/api` (automatically configured)
   - Socket: `http://localhost:3000`

## Verification Tests

### Test 1: App Launches Without Errors

**What to check:**
- [ ] App opens successfully
- [ ] No red error screens
- [ ] Login screen is displayed
- [ ] No console errors in Metro bundler

**If it fails:**
- Check Metro bundler terminal for errors
- Run `npx expo start --clear` to clear cache
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Test 2: Navigation Works

**What to check:**
- [ ] Can navigate to Register screen
- [ ] Form fields are visible and editable
- [ ] Role selection works (Client/Provider)

**If it fails:**
- Check for TypeScript errors: `npx tsc --noEmit`
- Verify @react-navigation packages are installed

### Test 3: Network Connection (Critical Test)

**What to do:**
1. Fill in registration form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
   - Role: CLIENT

2. Press "Sign Up"

**Expected success:**
- [ ] No "Network Error" alert
- [ ] Request reaches backend (check backend terminal)
- [ ] Backend processes request (creates user or returns validation error)
- [ ] Response comes back to mobile app

**Expected errors (these are OK):**
- "User already exists" - means network is working!
- "Validation failed" - means network is working!

**Unexpected errors (these indicate problems):**
- "Network Error" - network configuration issue
- "Cannot connect" - backend not running or wrong URL
- No response - timeout or network issue

**If network test fails:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **For Android, test emulator network:**
   ```bash
   # From your computer
   curl http://10.0.2.2:3000/api/health
   ```

3. **Check Metro bundler logs** for any errors

4. **Verify platform detection:**
   - Android should use `10.0.2.2`
   - iOS should use `localhost`
   - Check `src/config/api.config.ts` is imported correctly

### Test 4: Error Handling

**What to do:**
1. Stop the backend server
2. Try to sign up again

**Expected behavior:**
- [ ] Clear error message: "Cannot connect to server..."
- [ ] App doesn't crash
- [ ] User can try again after restarting backend

## Common Issues and Solutions

### Issue: "Cannot find module 'babel-preset-expo'"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Metro bundler failed to start"
**Solution:**
```bash
npx expo start --clear
# or
rm -rf node_modules/.cache
npx expo start
```

### Issue: "Network Error" on Android
**Solutions:**
1. Verify backend is on port 3000
2. Check Android emulator can reach host:
   ```bash
   # From Android emulator terminal (adb shell)
   curl http://10.0.2.2:3000/api/health
   ```
3. Verify firewall allows connections

### Issue: App crashes on startup with TurboModule error
**This should be fixed!** If you still see this:
1. Verify `babel.config.js` exists
2. Clear Metro cache: `npx expo start --clear`
3. Reinstall dependencies

## Success Criteria

All these should be true:

- [x] ✅ TypeScript compiles without errors
- [x] ✅ Metro bundler starts successfully  
- [x] ✅ App launches on emulator/simulator
- [x] ✅ No TurboModule errors
- [x] ✅ Network requests reach backend
- [x] ✅ No "Network Error" on form submission
- [x] ✅ Error messages are clear and helpful

## What Was Fixed

This verification guide tests the fixes for:

1. **Network Error** - Fixed with platform-aware URLs
   - Android: 10.0.2.2 ✅
   - iOS: localhost ✅

2. **TurboModule Error** - Fixed with proper configuration
   - babel.config.js ✅
   - metro.config.js ✅
   - Removed StatusBar ✅

3. **Environment Variables** - Fixed with TypeScript config
   - No more process.env ✅
   - Centralized config ✅

## Next Steps After Verification

Once all tests pass:

1. **For Development:**
   - Continue building features
   - Network issues are resolved
   - All native modules work correctly

2. **For Testing on Real Device:**
   - Update `src/config/api.config.ts` with your computer's IP
   - Ensure device and computer are on same WiFi network
   - Build and install on device

3. **For Production:**
   - Update `PRODUCTION_API_URL` and `PRODUCTION_SOCKET_URL` in `api.config.ts`
   - Build production app
   - Test thoroughly

## Support

If issues persist after following this guide:
1. Check `TROUBLESHOOTING.md` for detailed solutions
2. Review `FIXES_SUMMARY.md` for what was changed
3. Verify all changed files are present and correct

## Quick Checklist

Before reporting issues, verify:
- [ ] Backend is running on port 3000
- [ ] Dependencies are installed (`npm install`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Metro bundler starts (`npm start`)
- [ ] No cached issues (try `npx expo start --clear`)
- [ ] Platform-specific URLs are correct (check `api.config.ts`)

**If all checkboxes are marked, the app should work!** ✅
