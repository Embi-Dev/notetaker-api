# Notes API - NestJS + MongoDB

This is a simple secure Note API built using the following stack:

### 🛠 Required Tech Stack

- **Node.js**: v20.8.1 (LTS)
- **NestJS**: v9.0.0
- **TypeScript**: v5.2.2
- **MongoDB**: v6.0.6

---

## 🔧 Getting Started

### 1. Clone and Set Up Project

```bash
git clone <your-repo-url>
cd <project-root>
npm install
```

### 2. Set Up Your Environment Variables

- Copy `.env.sample` to `.env`
- Start your MongoDB instance (v6.0.6)
- Update your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your_custom_secret_key
JWT_EXPIRATION=3600s
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to **API & Services > Credentials**
4. Configure the **OAuth consent screen**
5. Create **OAuth 2.0 Client ID**
   - **Authorized redirect URI**: `http://localhost:3000/api/auth/google/callback`
6. Download `credentials.json` (optional)
7. Copy the values of **Client ID** and **Client Secret** into your `.env` file

---

## 🔑 How to Authenticate

1. Open your browser and visit:
   ```
   http://localhost:3000/api/auth/login
   ```
2. Login using your Google account.
3. You'll be redirected to a success page with your `access_token`
4. Use that token in your `Authorization` header for all protected requests.

---

## 📝 Notes API Endpoints

All endpoints are protected using JWT.

### Create Note

```
POST /api/notes
Authorization: Bearer <access_token>
Body: { "title": "Title", "content": "Note content", "tags": ["tag1"] }
```

### Get Notes

```
GET /api/notes
Authorization: Bearer <access_token>
```

### Get Note by ID

```
GET /api/notes/:noteId
Authorization: Bearer <access_token>
```

### Update Note

```
PUT /api/notes/:noteId
Authorization: Bearer <access_token>
Body: { "title": "Updated", "content": "Updated", "tags": ["new"] }
```

### Delete Note (ADMIN only)

Note: You need to directly edit the role of user from "REGULAR" to "ADMIN" to execute delete.

```
DELETE /api/notes/:noteId
Authorization: Bearer <access_token>
```

---

## 🧪 Run Test Cases

1. Login first (same as above) to get your `JWT token`
2. Navigate to `/test/test.config.js` and paste the token value into:

```js
JWT: 'your_access_token_here';
```

3. Then run:

```bash
npm run test:e2e
```

---
