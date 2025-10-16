# 🎫 Event Booking API

A robust and scalable RESTful API for managing event bookings with Google OAuth authentication, real-time seat management, and comprehensive booking operations.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

The Event Booking API is a backend service designed for managing event ticketing systems. It provides secure authentication via Google OAuth, comprehensive event management, and real-time seat inventory tracking with transaction-safe booking operations.

### Key Highlights

- 🔐 **Secure Authentication**: Google OAuth 2.0 integration with JWT tokens
- 🎟️ **Real-time Seat Management**: Atomic seat decrement/increment operations
- 💳 **Transaction Safety**: Database transactions ensure data consistency
- 👥 **Role-based Access Control**: Admin and User roles with middleware protection
- 📊 **RESTful Design**: Clean, intuitive API endpoints

## ✨ Features

### Authentication & Authorization

- ✅ Google OAuth 2.0 login integration
- ✅ JWT-based session management (7-day expiry)
- ✅ HttpOnly cookie security
- ✅ Role-based access control (ADMIN/USER)
- ✅ Protected routes with middleware chains

### Event Management

- ✅ Create, Read, Update, Delete (CRUD) operations
- ✅ Public event listing and details
- ✅ Admin-only event creation and modification
- ✅ Real-time seat availability tracking
- ✅ Event pricing and scheduling

### Booking System

- ✅ Create bookings with automatic seat allocation
- ✅ View user-specific bookings
- ✅ Confirm pending bookings
- ✅ Cancel bookings with seat restoration
- ✅ Automatic amount calculation (price × seats)
- ✅ Booking status management (PENDING/CONFIRMED/CANCELLED)
- ✅ Admin dashboard for all bookings

### Database Features

- ✅ PostgreSQL with Prisma ORM
- ✅ Type-safe database queries
- ✅ Automatic migrations
- ✅ Transaction-safe operations
- ✅ UUID-based entity identification

## 🛠️ Tech Stack

| Category           | Technology                     |
| ------------------ | ------------------------------ |
| **Runtime**        | Node.js (ES Modules)           |
| **Framework**      | Express.js v5.1.0              |
| **Database**       | PostgreSQL                     |
| **ORM**            | Prisma v6.17.0                 |
| **Authentication** | Passport.js + Google OAuth 2.0 |
| **Authorization**  | JSON Web Tokens (JWT)          |
| **Security**       | cookie-parser, CORS            |
| **Dev Tools**      | Nodemon, Prisma Studio         |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14.x or higher)
- **Git**
- **Google Cloud Console** account (for OAuth credentials)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Vishal-Bishtt/Event-Booking-API.git
cd Event-Booking-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then configure the variables (see [Environment Variables](#-environment-variables) section).

### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/event_booking_db?schema=public"

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_from_console.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379
```

### 🔑 How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Set **Authorized redirect URIs**: `http://localhost:3000/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to `.env`

## 🗄️ Database Setup

### Prisma Schema

The application uses the following data models:

- **User**: Authentication and profile information
- **Event**: Event details, pricing, and seat inventory
- **Booking**: User bookings with status tracking

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio
```

### Database Schema Overview

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  image     String?
  provider  String
  role      Role     @default(USER)
  bookings  Booking[]
}

model Event {
  id             String   @id @default(uuid())
  title          String
  description    String
  date           DateTime
  time           String
  venue          String
  totalSeats     Int
  availableSeats Int
  price          Float
  bookings       Booking[]
}

model Booking {
  id         String        @id @default(uuid())
  userId     String
  eventId    String
  seatCount  Int
  amount     Float
  status     BookingStatus @default(PENDING)
  user       User          @relation(fields: [userId], references: [id])
  event      Event         @relation(fields: [eventId], references: [id])
}
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

- Runs with **Nodemon** for auto-restart on file changes
- Prisma logging enabled (warn + error levels)
- CORS configured for `http://localhost:3001`

### Production Mode

```bash
npm start
```

- Runs with Node.js
- Minimal logging (error level only)
- Optimized for performance

### Testing Database Connection

```bash
# Check available events
node check-events.js
```

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

All protected routes require JWT authentication via:

- **Cookie**: `token` (httpOnly)
- **Header**: `Authorization: Bearer <token>`

---

### 🔐 Authentication Endpoints

#### 1. Google OAuth Login

```http
GET /api/auth/google
```

Redirects to Google OAuth consent screen.

#### 2. Google OAuth Callback

```http
GET /api/auth/google/callback
```

Handles OAuth callback, sets JWT cookie, and redirects to success page.

**Response**: Sets httpOnly cookie with JWT token (7-day expiry)

#### 3. Login Success

```http
GET /api/auth/success
```

**Response**:

```json
{
  "message": "Login successful"
}
```

#### 4. Login Failure

```http
GET /api/auth/failure
```

**Response** (401):

```json
{
  "message": "Login failed"
}
```

---

### 🎭 Event Endpoints

#### 1. Get All Events (Public)

```http
GET /api/events
```

**Response**:

```json
{
  "success": true,
  "events": [
    {
      "id": "uuid",
      "title": "Coldplay Concert",
      "description": "Live performance",
      "date": "2024-06-16T00:30:00.000Z",
      "time": "8:00 PM",
      "venue": "Madison Square Garden",
      "totalSeats": 50000,
      "availableSeats": 49998,
      "price": 2500,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Get Event by ID (Public)

```http
GET /api/events/:id
```

**Response**: Same as single event object above

#### 3. Create Event (Admin Only) 🔒

```http
POST /api/events/protected/
Authorization: Required
Role: ADMIN
```

**Request Body**:

```json
{
  "title": "Ed Sheeran: Mathematics Tour 2024",
  "description": "Live concert featuring latest hits",
  "date": "2024-08-21T20:00:00.000Z",
  "time": "8:00 PM",
  "venue": "Wembley Stadium",
  "totalSeats": 35000,
  "availableSeats": 35000,
  "price": 3500
}
```

**Response** (201):

```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    /* event object */
  }
}
```

#### 4. Update Event (Admin Only) 🔒

```http
PUT /api/events/:id
Authorization: Required
Role: ADMIN
```

**Request Body**: Same fields as create (partial updates supported)

#### 5. Delete Event (Admin Only) 🔒

```http
DELETE /api/events/:id
Authorization: Required
Role: ADMIN
```

**Response**:

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### 🎟️ Booking Endpoints

All booking endpoints require authentication 🔒

#### 1. Create Booking

```http
POST /api/bookings
Authorization: Required
```

**Request Body**:

```json
{
  "eventId": "b236a8d6-cbf1-4b3e-99c8-cde28293e330",
  "seatCount": 2
}
```

**Response** (201):

```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": "uuid",
    "eventId": "b236a8d6-cbf1-4b3e-99c8-cde28293e330",
    "userId": "user-uuid",
    "seatCount": 2,
    "amount": 5000,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Business Logic**:

- ✅ Validates event exists
- ✅ Checks seat availability
- ✅ Calculates amount (price × seatCount)
- ✅ Decrements availableSeats atomically
- ✅ Creates booking with PENDING status

#### 2. Get My Bookings

```http
GET /api/bookings/my-bookings
Authorization: Required
```

**Response**:

```json
{
  "success": true,
  "bookings": [
    {
      "id": "uuid",
      "seatCount": 2,
      "amount": 5000,
      "status": "CONFIRMED",
      "event": {
        "title": "Coldplay Concert",
        "date": "2024-06-16T00:30:00.000Z",
        "venue": "Madison Square Garden"
      }
    }
  ]
}
```

#### 3. Get Booking by ID

```http
GET /api/bookings/:bookingId
Authorization: Required
```

**Response**: Single booking object with event details

#### 4. Confirm Booking

```http
PATCH /api/bookings/:bookingId/confirm
Authorization: Required
```

**Response**:

```json
{
  "success": true,
  "message": "Booking confirmed",
  "booking": {
    /* updated booking with status: CONFIRMED */
  }
}
```

#### 5. Cancel Booking

```http
PATCH /api/bookings/:bookingId/cancel
Authorization: Required
```

**Response**:

```json
{
  "success": true,
  "message": "Booking cancelled",
  "booking": {
    /* updated booking with status: CANCELLED */
  }
}
```

**Business Logic**:

- ✅ Updates status to CANCELLED
- ✅ Restores seats to event (increment availableSeats)
- ✅ Transaction-safe operation

#### 6. Get All Bookings (Admin Only) 🔒

```http
GET /api/bookings
Authorization: Required
Role: ADMIN
```

**Response**:

```json
{
  "success": true,
  "bookings": [
    {
      "id": "uuid",
      "seatCount": 2,
      "amount": 5000,
      "status": "PENDING",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "event": {
        "title": "Coldplay Concert",
        "venue": "Madison Square Garden"
      }
    }
  ]
}
```

---

### 📊 Status Codes

| Code | Meaning                           |
| ---- | --------------------------------- |
| 200  | Success                           |
| 201  | Created                           |
| 400  | Bad Request                       |
| 401  | Unauthorized                      |
| 403  | Forbidden (Admin access required) |
| 404  | Not Found                         |
| 500  | Internal Server Error             |

---

### 🔒 Authentication Flow

```mermaid
sequenceDiagram
    User->>API: GET /api/auth/google
    API->>Google: Redirect to OAuth
    Google->>User: Login prompt
    User->>Google: Approve
    Google->>API: Callback with user data
    API->>Database: Create/update user
    API->>User: Set JWT cookie + redirect
    User->>API: Protected request with cookie
    API->>User: Authorized response
```

## 📁 Project Structure

```
event-booking-backend/
├── prisma/
│   └── schema.prisma              # Database schema
├── src/
│   ├── config/
│   │   ├── passport.js            # Google OAuth configuration
│   │   └── prisma.js              # Singleton Prisma client
│   ├── middlewares/
│   │   ├── authMiddleware.js      # JWT verification (protect)
│   │   └── adminMiddleware.js     # Role-based authorization
│   ├── modules/
│   │   ├── auth/
│   │   │   └── auth.routers.js    # OAuth routes
│   │   ├── events/
│   │   │   ├── event.controller.js # Event CRUD logic
│   │   │   ├── event.router.js     # Event routes
│   │   │   └── event.service.js    # Event business logic
│   │   └── bookings/
│   │       ├── booking.controller.js # Booking CRUD logic
│   │       ├── booking.router.js     # Booking routes
│   │       └── bookingModal.js       # Booking database operations
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server entry point
├── .env                           # Environment variables (gitignored)
├── .gitignore
├── package.json
├── README.md
└── check-events.js                # Utility script to list events
```

### Key Files Explained

| File                                 | Purpose                                                        |
| ------------------------------------ | -------------------------------------------------------------- |
| `src/config/prisma.js`               | Singleton Prisma client with environment-based logging         |
| `src/config/passport.js`             | Google OAuth strategy configuration                            |
| `src/middlewares/authMiddleware.js`  | JWT token verification, supports cookies + Bearer tokens       |
| `src/middlewares/adminMiddleware.js` | Role-based access control (checks `req.user.role === 'ADMIN'`) |
| `src/modules/*/bookingModal.js`      | Database operations with transaction safety                    |
| `prisma/schema.prisma`               | Database models and relationships                              |

## 🏗️ Architecture

### Design Patterns

- **Singleton Pattern**: Single Prisma instance shared across the app
- **MVC Architecture**: Controllers, Services, and Models separation
- **Middleware Chain**: Modular authentication and authorization
- **Transaction Safety**: Database operations wrapped in Prisma transactions

### Middleware Flow

```
Request → CORS → JSON Parser → Cookie Parser → Passport → Router
                                                              ↓
                                                         protect (JWT)
                                                              ↓
                                                         adminOnly (Role)
                                                              ↓
                                                         Controller
```

### Database Transaction Example

```javascript
// Booking creation with seat decrement
await prisma.$transaction(async (tx) => {
  // 1. Validate event and seats
  const event = await tx.event.findUnique({ where: { id: eventId } });
  if (event.availableSeats < seatCount) throw new Error("Not enough seats");

  // 2. Decrement seats
  await tx.event.update({
    where: { id: eventId },
    data: { availableSeats: { decrement: seatCount } }
  });

  // 3. Create booking
  return await tx.booking.create({ data: { ... } });
});
```

## 🧪 Testing

### Manual Testing with Postman

1. Import the API endpoints
2. Set up environment variables
3. Test authentication flow:
   - Login via Google OAuth
   - Copy JWT token from cookie
4. Test protected routes with token

### Quick Test Script

```bash
# List all events in database
node check-events.js
```

### Example Test Flow

```bash
# 1. Start the server
npm run dev

# 2. Login via browser
# Navigate to: http://localhost:3000/api/auth/google

# 3. Create a booking (Postman/cURL)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{
    "eventId": "b236a8d6-cbf1-4b3e-99c8-cde28293e330",
    "seatCount": 2
  }'

# 4. Check updated seats
node check-events.js
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use **ES Modules** (`import`/`export`)
- Follow **camelCase** naming conventions
- Add comments for complex business logic
- Keep functions small and focused
- Use **async/await** for async operations

## 📄 License

This project is licensed under the **ISC License**.

## 👨‍💻 Author

**Vishal Bisht**

- GitHub: [@Vishal-Bishtt](https://github.com/Vishal-Bishtt)
- Repository: [Event-Booking-API](https://github.com/Vishal-Bishtt/Event-Booking-API)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [PostgreSQL](https://www.postgresql.org/) - Powerful open-source database

## 📞 Support

For issues and questions:

- Open an [issue](https://github.com/Vishal-Bishtt/Event-Booking-API/issues)
- Check existing documentation
- Review closed issues for solutions

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Vishal Bisht

</div>
