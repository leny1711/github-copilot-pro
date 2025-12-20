# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "CLIENT" // or "PROVIDER"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT"
  },
  "token": "jwt-token"
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT"
  },
  "token": "jwt-token"
}
```

### Get Profile
```http
GET /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "CLIENT",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "address": "Paris, France",
    "rating": 4.5,
    "totalJobs": 10,
    "isAvailable": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## User Endpoints

### Update Profile
```http
PATCH /users/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1234567890",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "address": "Paris, France",
  "isAvailable": true,
  "fcmToken": "firebase-token"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Get Nearby Providers
```http
GET /users/nearby-providers?latitude=48.8566&longitude=2.3522&radius=10
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `radius` (optional): Search radius in km (default: 10)

**Response:**
```json
{
  "providers": [
    {
      "id": "uuid",
      "firstName": "Provider",
      "lastName": "Name",
      "rating": 4.8,
      "totalJobs": 50,
      "latitude": 48.8566,
      "longitude": 2.3522
    }
  ]
}
```

---

## Mission Endpoints

### Create Mission
```http
POST /missions
```

**Headers:** `Authorization: Bearer <token>` (CLIENT role required)

**Request Body:**
```json
{
  "title": "Help with moving",
  "description": "Need help moving furniture to new apartment",
  "category": "Moving",
  "isUrgent": false,
  "latitude": 48.8566,
  "longitude": 2.3522,
  "address": "123 Main St, Paris, France",
  "estimatedPrice": 50.00
}
```

**Response:**
```json
{
  "message": "Mission created successfully",
  "mission": {
    "id": "uuid",
    "title": "Help with moving",
    "description": "Need help moving furniture to new apartment",
    "category": "Moving",
    "isUrgent": false,
    "latitude": 48.8566,
    "longitude": 2.3522,
    "address": "123 Main St, Paris, France",
    "estimatedPrice": 50.00,
    "commission": 7.50,
    "status": "PENDING",
    "clientId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Missions
```http
GET /missions?status=PENDING&category=Moving&isUrgent=true
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED)
- `category` (optional): Filter by category
- `isUrgent` (optional): Filter urgent missions (true/false)

**Response:**
```json
{
  "missions": [
    {
      "id": "uuid",
      "title": "Help with moving",
      "description": "Need help moving furniture",
      "category": "Moving",
      "isUrgent": false,
      "status": "PENDING",
      "estimatedPrice": 50.00,
      "client": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "rating": 4.5
      },
      "provider": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User's Missions
```http
GET /missions/user?role=client
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `role` (optional): Filter by role (client/provider)

**Response:** Same as "Get All Missions"

### Get Mission by ID
```http
GET /missions/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "mission": {
    "id": "uuid",
    "title": "Help with moving",
    "description": "Need help moving furniture",
    "category": "Moving",
    "isUrgent": false,
    "latitude": 48.8566,
    "longitude": 2.3522,
    "address": "123 Main St, Paris, France",
    "estimatedPrice": 50.00,
    "status": "ACCEPTED",
    "client": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "rating": 4.5
    },
    "provider": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "phoneNumber": "+0987654321",
      "rating": 4.8
    },
    "messages": [
      {
        "id": "uuid",
        "content": "Hello, I'm on my way",
        "senderId": "provider-id",
        "receiverId": "client-id",
        "isRead": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "acceptedAt": "2024-01-01T00:10:00.000Z"
  }
}
```

### Accept Mission
```http
POST /missions/:id/accept
```

**Headers:** `Authorization: Bearer <token>` (PROVIDER role required)

**Response:**
```json
{
  "message": "Mission accepted successfully",
  "mission": { ... }
}
```

### Update Mission Status
```http
PATCH /missions/:id/status
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "IN_PROGRESS" // or "COMPLETED", "CANCELLED"
}
```

**Response:**
```json
{
  "message": "Mission updated successfully",
  "mission": { ... }
}
```

---

## Payment Endpoints

### Create Payment Intent
```http
POST /payments/create-intent
```

**Headers:** `Authorization: Bearer <token>` (CLIENT role required)

**Request Body:**
```json
{
  "missionId": "uuid"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### Confirm Payment
```http
POST /payments/confirm
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "message": "Payment confirmed",
  "payment": {
    "id": "uuid",
    "amount": 50.00,
    "commission": 7.50,
    "providerAmount": 42.50,
    "currency": "eur",
    "status": "COMPLETED",
    "missionId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Payment History
```http
GET /payments/history
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 50.00,
      "commission": 7.50,
      "providerAmount": 42.50,
      "currency": "eur",
      "status": "COMPLETED",
      "mission": {
        "id": "uuid",
        "title": "Help with moving",
        "status": "COMPLETED"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Stripe Webhook
```http
POST /payments/webhook
```

**Note:** This endpoint is called by Stripe, not by clients.

---

## Admin Endpoints

All admin endpoints require ADMIN role.

### Get Dashboard Stats
```http
GET /admin/stats
```

**Headers:** `Authorization: Bearer <token>` (ADMIN role required)

**Response:**
```json
{
  "stats": {
    "users": {
      "total": 100,
      "clients": 70,
      "providers": 30
    },
    "missions": {
      "total": 200,
      "pending": 20,
      "completed": 150
    },
    "revenue": {
      "totalCommission": 1500.00
    }
  }
}
```

### Get All Users
```http
GET /admin/users?role=CLIENT&page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>` (ADMIN role required)

**Query Parameters:**
- `role` (optional): Filter by role
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:**
```json
{
  "users": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Get All Missions
```http
GET /admin/missions?status=PENDING&page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>` (ADMIN role required)

**Response:**
```json
{
  "missions": [ ... ],
  "pagination": {
    "total": 200,
    "page": 1,
    "limit": 20,
    "totalPages": 10
  }
}
```

### Get All Payments
```http
GET /admin/payments?status=COMPLETED&page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>` (ADMIN role required)

**Response:**
```json
{
  "payments": [ ... ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided" // or "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Socket.IO Events

### Connection
```javascript
socket.connect();
```

### Join Mission Room
```javascript
socket.emit('join_mission', missionId);
```

### Send Message
```javascript
socket.emit('send_message', {
  missionId: 'uuid',
  senderId: 'uuid',
  receiverId: 'uuid',
  content: 'Hello!'
});
```

### Receive New Message
```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

### Mark Messages as Read
```javascript
socket.emit('mark_read', {
  missionId: 'uuid',
  userId: 'uuid'
});
```

### Messages Read Event
```javascript
socket.on('messages_read', (data) => {
  console.log('Messages read by:', data.userId);
});
```
