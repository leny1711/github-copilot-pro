# Marketplace - On-Demand Services Platform

A complete, production-ready marketplace application for on-demand services with a "Red Button" feature for urgent help requests.

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express (TypeScript)
- PostgreSQL with Prisma ORM
- JWT Authentication
- Stripe for payments
- Firebase Cloud Messaging for notifications
- Socket.IO for real-time chat

**Frontend (Mobile):**
- React Native with Expo (TypeScript)
- React Navigation for routing
- Google Maps for geolocation
- Stripe integration for payments
- Socket.IO client for real-time features

## 📁 Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication & error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
└── mobile/
    ├── src/
    │   ├── screens/         # App screens
    │   ├── components/      # Reusable components
    │   ├── navigation/      # Navigation configuration
    │   ├── contexts/        # React contexts
    │   ├── services/        # API & Socket services
    │   └── types/           # TypeScript types
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - Database connection string
   - JWT secret
   - Stripe API keys
   - Google Maps API key
   - Firebase credentials

5. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Mobile App Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - API URL (backend URL)
   - Stripe publishable key
   - Google Maps API key
   - Socket.IO URL

5. Start the Expo development server:
```bash
npm start
```

6. Run on your device:
   - iOS: Press `i` in the terminal or scan the QR code with the Expo Go app
   - Android: Press `a` in the terminal or scan the QR code with the Expo Go app

## 🔑 Key Features

### For Clients
- **Account Management**: Register and login securely
- **Red Button**: Emergency help requests for urgent needs
- **Mission Creation**: Create detailed service requests with:
  - Title, description, and category
  - Location (auto-detected via GPS)
  - Estimated price
  - Urgency flag
- **Payment Integration**: Secure payments via Stripe
- **Real-time Chat**: Communicate with service providers
- **Mission Tracking**: View mission history and status

### For Providers
- **Availability Toggle**: Set online/offline status
- **Mission Discovery**: Browse available missions
- **Accept Missions**: Choose which missions to accept
- **GPS Navigation**: Navigate to mission locations
- **Status Updates**: Update mission progress (accepted → in progress → completed)
- **Earnings Tracking**: View total jobs and ratings
- **Real-time Chat**: Communicate with clients

### For Admins
- **Dashboard**: View platform statistics
  - Total users (clients/providers)
  - Mission stats (total/pending/completed)
  - Revenue from commissions
- **User Management**: View and manage all users
- **Mission Management**: Monitor all missions
- **Payment Tracking**: View all transactions and commissions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/nearby-providers` - Get nearby available providers

### Missions
- `POST /api/missions` - Create new mission (Client only)
- `GET /api/missions` - Get all missions with filters
- `GET /api/missions/user` - Get user's missions
- `GET /api/missions/:id` - Get mission details
- `POST /api/missions/:id/accept` - Accept mission (Provider only)
- `PATCH /api/missions/:id/status` - Update mission status

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/webhook` - Stripe webhook handler

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/missions` - Get all missions
- `GET /api/admin/payments` - Get all payments

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **HTTPS**: Recommended for production
- **Input Validation**: express-validator for request validation
- **Role-based Access Control**: Different permissions for clients, providers, and admins

## 💳 Payment Flow

1. Client creates a mission with estimated price
2. System calculates commission (15% by default)
3. Client initiates payment via Stripe
4. Payment is held securely
5. Provider completes the mission
6. Payment is released (minus commission)

## 💬 Real-time Chat

The app uses Socket.IO for real-time messaging between clients and providers:

- Connect to mission-specific rooms
- Send and receive messages instantly
- Mark messages as read
- Persistent message history

## 🗺️ Location Features

- **Auto-detection**: GPS location for mission creation
- **Reverse Geocoding**: Convert coordinates to addresses
- **Maps Integration**: Visual location display
- **Nearby Providers**: Find providers within a specific radius

## 🔔 Notifications

Firebase Cloud Messaging is used for push notifications:

- Mission status updates
- New messages
- Payment confirmations
- Provider acceptance notifications

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Mobile
```bash
cd mobile
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Mobile

**iOS:**
```bash
cd mobile
expo build:ios
```

**Android:**
```bash
cd mobile
expo build:android
```

## 🌐 Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_MAPS_API_KEY=your-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account@...
ADMIN_COMMISSION_RATE=0.15
```

### Mobile (.env)
```
API_URL=https://your-api-domain.com/api
STRIPE_PUBLISHABLE_KEY=pk_live_...
GOOGLE_MAPS_API_KEY=your-key
SOCKET_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please contact the development team or open an issue in the repository.

## 🎯 Roadmap

- [ ] Add rating system for completed missions
- [ ] Implement payment splitting for multiple providers
- [ ] Add mission categories management in admin panel
- [ ] Support for multiple languages
- [ ] Advanced analytics dashboard
- [ ] In-app calling feature
- [ ] Photo/video attachments in chat
- [ ] Scheduled missions (not immediate)

## 👥 Team

Built with ❤️ by the development team.
