Here's the updated README with the pagination parameter included in the GET /notes endpoint documentation:

# Notes API - NestJS + MongoDB

This is a secure Note API built using the following technology stack:

## Required Tech Stack

- **Node.js**: v20.8.1 (LTS)
- **NestJS**: v9.0.0
- **TypeScript**: v5.2.2
- **MongoDB**: v6.0.6

## Getting Started

### 1. Clone and Set Up Project

```bash
git clone <your-repo-url>
cd <project-root>
npm install
```

### 2. Set Up Environment Variables

1. Copy `.env.sample` to `.env`
2. Start your MongoDB instance (v6.0.6)
3. Update your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your_custom_secret_key
JWT_EXPIRATION=3600s
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to **API & Services > Credentials**
4. Configure the **OAuth consent screen**
5. Create **OAuth 2.0 Client ID**
   - Set **Authorized redirect URI** to: `http://localhost:3000/api/auth/google/callback`
6. Copy the **Client ID** and **Client Secret** values into your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Authentication

1. Visit in your browser:
   ```
   http://localhost:3000/api/auth/login
   ```
2. Login using your Google account
3. You'll be redirected to a success page containing your `access_token`
4. Use this token in the `Authorization` header for all protected requests

## Notes API Endpoints

All endpoints require JWT authentication.

### Create Note

```
POST /api/notes
Authorization: Bearer <access_token>
Body: { "title": "Title", "content": "Note content", "tags": ["tag1"] }
```

### Get Notes (with pagination)

```
GET /api/notes?lastItemId=<last_note_id>
Authorization: Bearer <access_token>
```

Parameters:

- `lastItemId` (optional): The ID of the last note received for pagination

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

Note: Requires user role to be set as "ADMIN" in the database.

```
DELETE /api/notes/:noteId
Authorization: Bearer <access_token>
```

## Running Tests

1. Login first (as described above) to obtain your JWT token
2. Navigate to `/test/test.config.js` and paste the token value:

```js
JWT: 'your_access_token_here';
```

3. Run the tests:

```bash
npm run test:e2e
```

## Implementation Notes

The API includes:

- JWT authentication for all endpoints
- Pagination support via the `lastItemId` query parameter
- Role-based access control (ADMIN required for deletion)
- Input validation for all requests
- Proper error responses with status codes

The pagination implementation uses MongoDB's native query capabilities to efficiently fetch notes after a specified ID, providing better performance than traditional offset-based pagination.
