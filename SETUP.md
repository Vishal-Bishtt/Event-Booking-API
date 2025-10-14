# 🚀 Event Booking Backend - ESM Setup Documentation

## ✅ Project Configuration

This project is configured to use **ES Modules (ESM)** - the modern JavaScript module system.

### Current Setup:
- ✅ `package.json` has `"type": "module"`
- ✅ Using `import/export` syntax (not `require/module.exports`)
- ✅ Node.js v14+ required for ESM support
- ✅ Prisma ORM with PostgreSQL

---

## 📦 What Changed to Support ESM

### 1. **package.json**
```json
{
  "type": "module"  // ← This enables ESM in Node.js
}
```

### 2. **Import Syntax**
**Old (CommonJS):**
```javascript
const express = require('express');
module.exports = app;
```

**New (ESM):**
```javascript
import express from 'express';
export default app;
```

### 3. **File Extensions**
- All `.js` files now use ESM syntax
- Must include `.js` extension in imports: `import x from './file.js'`

---

## 🔧 Fixed Issues

### ✅ **Issue 1: Wrong Prisma Import Path**
**Before:**
```javascript
import { PrismaClient } from "../generated/prisma"; // ❌
```

**After:**
```javascript
import { PrismaClient } from "@prisma/client"; // ✅
```

### ✅ **Issue 2: CORS URL Typo**
**Before:**
```javascript
cors({origin:"http//localhost:3001"}) // ❌ Missing :
```

**After:**
```javascript
cors({origin:"http://localhost:3001"}) // ✅
```

### ✅ **Issue 3: Express Route Parameters**
**Before:**
```javascript
app.get("/",(res,req)=>{ }) // ❌ Wrong order
```

**After:**
```javascript
app.get("/",(req,res)=>{ }) // ✅ Correct order
```

### ✅ **Issue 4: Router vs Response Object**
**Before:**
```javascript
res.get("/success", ...) // ❌ 'res' is response object
```

**After:**
```javascript
router.get("/success", ...) // ✅ 'router' is the router instance
```

---

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE event_booking_db;
```

### 3. Configure Environment Variables
Update `.env` file with your credentials (already configured):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/event_booking_db?schema=public"
PORT=3000
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
JWT_SECRET="your-secret-key"
```

### 4. Generate Prisma Client & Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 📁 Project Structure

```
event-booking-backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── config/
│   │   ├── passport.js        # Google OAuth strategy
│   │   └── redis.js           # Redis configuration
│   ├── middlewares/
│   │   └── authMiddleware.js  # JWT authentication
│   └── modules/
│       └── auth/
│           └── auth.routers.js # Auth routes
├── prisma/
│   └── schema.prisma          # Database schema
├── .env                       # Environment variables
└── package.json              # Dependencies & scripts
```

---

## 🔑 API Endpoints

### Public Routes:
- `GET /` - API health check
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/success` - Login success page
- `GET /api/auth/failure` - Login failure page

### Protected Routes:
- `GET /api/protected` - Requires JWT token in cookie or Authorization header

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot use import statement outside a module"
**Solution:** Ensure `"type": "module"` is in `package.json` ✅ (Already fixed)

### Issue: "Error: Cannot find module '@prisma/client'"
**Solution:** Run `npx prisma generate`

### Issue: "Database connection failed"
**Solution:** 
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Create database: `CREATE DATABASE event_booking_db;`

### Issue: "Prisma schema not found"
**Solution:** Make sure `prisma/schema.prisma` exists

---

## 🎯 ESM Features Used

1. **Top-level `import`/`export`** - No more `require()`
2. **Named exports** - `export const func = () => {}`
3. **Default exports** - `export default obj`
4. **Dynamic imports** - `const module = await import('./file.js')`
5. **File extensions required** - Must use `.js` in imports

---

## 🧪 Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3000/

# Google OAuth (will redirect to Google)
curl http://localhost:3000/api/auth/google

# Protected route (requires token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/api/protected
```

---

## 📚 Technology Stack

- **Node.js** - JavaScript runtime (ESM supported)
- **Express.js** - Web framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Database
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Redis** - Caching (optional)
- **Google OAuth 2.0** - Social login

---

## ✨ Next Steps

1. ✅ Run `npx prisma generate`
2. ✅ Run `npx prisma migrate dev`
3. ✅ Start server with `npm run dev`
4. 🎉 Test your API!

---

**Happy Coding! 🚀**
