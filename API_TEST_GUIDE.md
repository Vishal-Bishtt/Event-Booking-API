# 🧪 API Testing Guide - Event Creation Fix Verification

## ✅ Database Layer Tests: PASSED ✅

The `debug-flow.js` test confirmed:

- ✅ Database connection works
- ✅ Event creation works
- ✅ Event persistence works (data doesn't disappear!)
- ✅ Event retrieval works
- ✅ Single Prisma instance is working correctly

---

## 🚀 Testing the Main API Endpoints

### Prerequisites

1. **Start the server:**

   ```powershell
   npm run dev
   ```

2. **Get an Admin JWT Token:**
   - Login via Google OAuth: `http://localhost:3000/api/auth/google`
   - After successful login, extract the `token` cookie from browser DevTools
   - **OR** check the console logs for the decoded JWT payload

---

### Test 1: Create Event (POST)

**Endpoint:** `POST http://localhost:3000/api/events`

**Headers:**

```
Content-Type: application/json
Cookie: token=<your-jwt-token-here>
```

**Request Body:**

```json
{
  "title": "Coldplay Live in Concert",
  "description": "An unforgettable evening with Coldplay",
  "date": "2024-12-31T19:00:00.000Z",
  "time": "7:00 PM",
  "venue": "Madison Square Garden",
  "totalSeats": 50000,
  "availableSeats": 50000,
  "price": 2500.0
}
```

**Expected Response:** `201 Created`

```json
{
  "id": "uuid-here",
  "title": "Coldplay Live in Concert",
  "description": "An unforgettable evening with Coldplay",
  "date": "2024-12-31T19:00:00.000Z",
  "time": "7:00 PM",
  "venue": "Madison Square Garden",
  "totalSeats": 50000,
  "availableSeats": 50000,
  "price": 2500.0,
  "createdAt": "2025-10-14T...",
  "updatedAt": "2025-10-14T..."
}
```

**Console Logs You Should See:**

```
🔐 [PROTECT] Middleware started
🔐 [PROTECT] ✅ Token decoded: { id: '...', name: '...', role: 'ADMIN' }
🔐 [PROTECT] ✅ req.user set: { id: '...', name: '...', role: 'ADMIN' }
👑 [ADMIN] Middleware started
👑 [ADMIN] ✅ Admin verified - User: user@example.com
🟡 CONTROLLER: Received request body: { title: 'Coldplay Live in Concert', ... }
🟡 SERVICE: Creating event with data: { ... }
prisma:query INSERT INTO "public"."Event" ...
🟢 SERVICE: Event created successfully: { id: '...', title: 'Coldplay Live in Concert', ... }
🟢 CONTROLLER: Event created, sending response
```

---

### Test 2: Get All Events (GET)

**Endpoint:** `GET http://localhost:3000/api/events`

**Headers:** None required (public route)

**Expected Response:** `200 OK`

```json
[
  {
    "id": "uuid-here",
    "title": "Coldplay Live in Concert",
    "totalSeats": 50000,
    ...
  }
]
```

**Verification:**

- Array should NOT be empty `[]`
- Should contain the event you just created
- Event data should match what you POSTed

---

### Test 3: Verify in Prisma Studio

```powershell
npx prisma studio
```

1. Open browser to `http://localhost:5555`
2. Click on **Event** table
3. **VERIFY:** Your event appears with all fields populated
4. **CHECK:** `totalSeats` field shows correct value (e.g., 50000)

---

## 🐛 Troubleshooting

### Issue: "Access denied - Admin only" (403)

**Cause:** Your JWT token doesn't have `role: "ADMIN"`

**Fix:** Update user role in database

```sql
-- In Prisma Studio or PostgreSQL client
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

**OR** Create a test admin endpoint (development only):

```javascript
// In src/app.js - REMOVE BEFORE PRODUCTION
if (process.env.NODE_ENV !== "production") {
  app.get("/api/dev/make-admin/:email", async (req, res) => {
    const user = await prisma.user.update({
      where: { email: req.params.email },
      data: { role: "ADMIN" },
    });
    res.json({ message: "User is now admin", user });
  });
}
```

---

### Issue: "Not authorized" (401)

**Cause:** No token or invalid token

**Fixes:**

1. **Check cookie exists:**

   - Browser DevTools → Application → Cookies → `localhost:3000`
   - Look for `token` cookie

2. **Re-login:**

   - Visit `http://localhost:3000/api/auth/google`
   - Complete OAuth flow

3. **Check JWT is valid:**
   ```javascript
   // In browser console
   document.cookie.split(";").find((c) => c.includes("token"));
   ```

---

### Issue: Event created but still returns empty array on GET

**Cause:** (Should be fixed now!) Multiple Prisma instances

**Verify Fix:**

```powershell
# Search for multiple PrismaClient instantiations
grep -r "new PrismaClient()" src/
```

**Expected Output:** NO matches (all should import from `config/prisma.js`)

---

### Issue: Field validation errors

**Common mistakes:**

- ❌ `totalseats` → ✅ `totalSeats` (camelCase!)
- ❌ Date as string → ✅ Valid ISO 8601 date string
- ❌ Missing required fields → ✅ Include all required fields

---

## 📊 Success Checklist

After running tests, verify:

- [ ] POST returns 201 with event data
- [ ] GET returns 200 with array containing the event
- [ ] Prisma Studio shows the event in Event table
- [ ] Console logs show complete middleware flow
- [ ] No errors in terminal
- [ ] Event `totalSeats` field is correct (not `totalseats`)

---

## 🎯 Quick Test Commands

### Using PowerShell (with curl):

```powershell
# Get all events
curl http://localhost:3000/api/events

# Create event (replace YOUR_TOKEN_HERE)
curl -X POST http://localhost:3000/api/events `
  -H "Content-Type: application/json" `
  -H "Cookie: token=YOUR_TOKEN_HERE" `
  -d '{\"title\":\"Test Event\",\"description\":\"Test\",\"date\":\"2024-12-31T19:00:00.000Z\",\"time\":\"7 PM\",\"venue\":\"Test Venue\",\"totalSeats\":1000,\"availableSeats\":1000,\"price\":100}'
```

### Using Postman:

1. Create new request
2. Method: `POST`
3. URL: `http://localhost:3000/api/events`
4. Headers: `Content-Type: application/json`
5. Cookies: Add `token` with your JWT value
6. Body (raw JSON): Paste the request body from Test 1 above
7. Click **Send**

---

## 🎉 Expected Final State

After all fixes:

- ✅ POST creates event in database (verified in Prisma Studio)
- ✅ GET returns the created event
- ✅ No silent data loss
- ✅ API status codes match reality
- ✅ Single Prisma instance handles all operations
- ✅ Comprehensive logging shows complete request flow

**Your API is now working correctly! 🚀**
