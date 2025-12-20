# 🚀 Quick Start Guide

## Welcome to the Marketplace Application!

This guide will help you get the application up and running in minutes.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js v18+ installed
- [ ] PostgreSQL v14+ installed and running
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] A code editor (VS Code recommended)

### Required API Keys (Optional for basic testing)

- [ ] Stripe account (for payments)
- [ ] Google Maps API key (for location features)
- [ ] Firebase project (for push notifications)

## 🎯 5-Minute Setup

### Step 1: Clone and Setup Backend (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# For quick testing, update DATABASE_URL in .env:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/marketplace?schema=public"

# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Start the server
npm run dev
```

✅ Backend should now be running on `http://localhost:3000`

### Step 2: Setup Mobile App (2 minutes)

```bash
# Open a new terminal window

# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your backend URL:
# API_URL=http://localhost:3000/api
# SOCKET_URL=http://localhost:3000

# Start Expo
npm start
```

✅ Expo dev server should now be running

### Step 3: Run the App (1 minute)

**Option A: Use Expo Go App (Easiest)**
1. Install "Expo Go" app on your phone
2. Scan the QR code from the terminal
3. App will open on your device

**Option B: Use iOS Simulator**
1. Press `i` in the Expo terminal
2. iOS simulator will launch

**Option C: Use Android Emulator**
1. Start Android emulator first
2. Press `a` in the Expo terminal
3. App will launch in emulator

## 🎮 First Use - Try These Flows

### Test as a Client

1. **Register a new account**
   - Open the app
   - Click "Sign up"
   - Choose "Client" role
   - Fill in your details
   - Submit

2. **Create a mission**
   - Click "+ Create New Mission"
   - Fill in the details
   - Click "Create Mission"

3. **Try the Red Button**
   - Click "URGENT HELP NEEDED"
   - Fill in urgent request details
   - Submit

### Test as a Provider

1. **Register as provider**
   - Click "Sign up"
   - Choose "Provider" role
   - Complete registration

2. **Browse missions**
   - Toggle availability to "ON"
   - View available missions
   - Click "Accept" on any mission

3. **Update mission status**
   - Click on accepted mission
   - Click "Start Mission"
   - Later click "Mark as Completed"

### Test as Admin

1. **Create admin account via API**
   ```bash
   # Use a tool like curl or Postman
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "admin123",
       "firstName": "Admin",
       "lastName": "User",
       "role": "ADMIN"
     }'
   ```

2. **Login and view dashboard**
   - Login with admin credentials
   - View statistics
   - Browse users and missions

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Database connection error
```bash
# Solution: Check PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL if needed
sudo service postgresql start
```

**Problem**: Port 3000 already in use
```bash
# Solution: Change PORT in backend/.env
PORT=3001
```

### Mobile App Issues

**Problem**: Can't connect to backend
```bash
# Solution: Use your computer's IP address instead of localhost
# In mobile/.env:
API_URL=http://192.168.1.X:3000/api
SOCKET_URL=http://192.168.1.X:3000

# Find your IP:
# Mac/Linux: ifconfig | grep "inet "
# Windows: ipconfig
```

**Problem**: Expo won't start
```bash
# Solution: Clear Expo cache
expo start -c
```

## 🎨 Test Data Creation

### Create test users quickly:

```bash
# Use this script to create test data
# backend/scripts/seed.ts (create this file if needed)

# Or use API calls:

# Create a client
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@test.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "Client",
    "role": "CLIENT"
  }'

# Create a provider
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider@test.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "Provider",
    "role": "PROVIDER"
  }'
```

## 📱 Key Features to Test

### 1. Red Button Feature
- As a client, press the red button
- Notice "URGENT" badge on the mission
- Providers will see this highlighted

### 2. Real-time Chat
- Have two devices/emulators ready
- Client creates a mission
- Provider accepts it
- Both can chat in real-time

### 3. Location Features
- Allow location permissions when prompted
- Location auto-fills in mission creation
- View mission location on map

### 4. Payment Flow (Requires Stripe setup)
- Client creates mission
- Client initiates payment
- Complete payment with test card
- Provider receives payment minus commission

## 🔐 Test Credentials Format

Keep these handy for testing:

**Client Account:**
- Email: client@test.com
- Password: test123
- Role: CLIENT

**Provider Account:**
- Email: provider@test.com
- Password: test123
- Role: PROVIDER

**Admin Account:**
- Email: admin@test.com
- Password: admin123
- Role: ADMIN

## 📊 Database Exploration

View your data using Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

Opens a GUI at `http://localhost:5555` to browse:
- Users
- Missions
- Messages
- Payments

## 🌐 API Testing

### Using curl:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "client@test.com", "password": "test123"}'

# Get profile (replace TOKEN with your JWT)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman:

1. Import the API endpoints from API_DOCUMENTATION.md
2. Set up environment variables:
   - base_url: http://localhost:3000/api
   - token: (will be set after login)
3. Test all endpoints

## 🎯 What to Check

- [ ] Users can register and login
- [ ] Clients can create missions
- [ ] Red button creates urgent missions
- [ ] Providers can see and accept missions
- [ ] Real-time chat works between users
- [ ] Mission status updates correctly
- [ ] Admin can view statistics
- [ ] Location detection works
- [ ] Maps display correctly

## 📞 Getting Help

If you encounter issues:

1. Check the logs in terminal
2. Verify all environment variables are set
3. Ensure all services are running (PostgreSQL, Backend, Expo)
4. Check API_DOCUMENTATION.md for endpoint details
5. Review PROJECT_SUMMARY.md for architecture details

## 🚀 Next Steps

Once everything is working:

1. **Customize the app**
   - Update branding colors
   - Modify categories
   - Adjust commission rate

2. **Add API keys for full functionality**
   - Stripe for real payments
   - Google Maps for production
   - Firebase for push notifications

3. **Deploy to production**
   - Backend to cloud service
   - Mobile app to app stores
   - Database to managed PostgreSQL

## 🎉 You're All Set!

You now have a fully functional marketplace application running locally. Enjoy exploring all the features!

For detailed documentation, see:
- **README.md** - Complete project guide
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_SUMMARY.md** - Technical overview
