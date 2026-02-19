# API Reference

This document provides a comprehensive reference for the Global Lottery Platform API. The platform exposes two sets of endpoints:

1. **Versioned API (`/api/v1/`)** — Authenticated CRUD endpoints for managing users, lotteries, results, articles, and subscriptions.
2. **Public Spec API (`/api/`)** — Unauthenticated (or lightly secured) endpoints consumed by the frontend mobile/web app.

---

## Table of Contents

- [Authentication](#authentication)
- [Standard Response Envelope](#standard-response-envelope)
- [Error Responses](#error-responses)
- [V1 API Endpoints](#v1-api-endpoints)
  - [Auth](#auth-apiv1auth)
  - [Users](#users-apiv1users)
  - [Lotteries](#lotteries-apiv1lotteries)
  - [Results](#results-apiv1results)
  - [Articles](#articles-apiv1articles)
- [Public Spec API Endpoints](#public-spec-api-endpoints)
  - [Results](#results-api)
  - [Check Number](#check-number)
  - [Subscribe](#subscribe)
  - [Countries](#countries)
  - [News](#news)
  - [Statistics](#statistics)
  - [Auth (Public)](#auth-public)
  - [Cron](#cron)
- [Data Models](#data-models)
- [API Versioning](#api-versioning)

---

## Authentication

Most `/api/v1/` endpoints require an **API Key** passed via the `Authorization` header:

```
Authorization: Bearer <api_key>
```

API keys are obtained from `POST /api/v1/auth/signin`. Keys have two scopes:

| Scope | Description |
|:---|:---|
| `read-only` | Can read data only |
| `read-write` | Can read and write data (required for POST/PATCH/DELETE) |

Public spec endpoints (`/api/check`, `/api/subscribe`, `/api/results/*`, `/api/countries/*`, `/api/news/*`, `/api/statistics/*`) also require an **API Key** via the same `Authorization: Bearer <api_key>` header. Only `/api/doc` (OpenAPI spec), `/api/auth/*` (login/register), and `/api/cron` (secured by `CRON_SECRET`) are exempt.

---

## Standard Response Envelope

Most v1 endpoints wrap responses in a standard envelope:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message string"
}
```

Paginated endpoints may also include a `meta` object:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

---

## Error Responses

| Status | Meaning |
|:---|:---|
| `400` | Bad Request — Missing/invalid parameters or body |
| `401` | Unauthorized — Missing or invalid API key |
| `403` | Forbidden — Insufficient permissions (requires `read-write` scope) |
| `404` | Not Found — Resource doesn't exist |
| `409` | Conflict — Resource already exists |
| `500` | Internal Server Error |

---

## V1 API Endpoints

### Auth (`/api/v1/auth`)

---

#### `POST /api/v1/auth/signin`

Authenticate with email and password to receive API keys.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `email` | `string` | Yes | User's email address |
| `password` | `string` | Yes | User's password |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "token": "ak_...",
    "refreshToken": "ak_..."
  }
}
```

| Field | Type | Description |
|:---|:---|:---|
| `token` | `string` | API access token (`read-write` scope) |
| `refreshToken` | `string` | API refresh token (`refresh` scope) |

**Errors:** `400` Missing credentials · `401` Invalid credentials · `500`

---

#### `GET /api/v1/auth/session`

Retrieve the current authenticated session and user profile.

**Auth Required:** Yes (API Key)

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "scope": "read-write",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "image": "https://...",
      "pointsBalance": 100,
      "username": "johndoe",
      "title": "Mr",
      "firstName": "John",
      "lastName": "Doe",
      "gender": "male",
      "phoneNumber": "+66812345678",
      "countryCode": "TH",
      "dateOfBirth": "1990-01-01T00:00:00Z",
      "citizenId": "encrypted_string",
      "isIdentityVerified": true,
      "isActive": true
    }
  }
}
```

**Errors:** `401` · `500`

---

#### `POST /api/v1/auth/signout`

Revoke the current API key session.

**Auth Required:** Yes (API Key)

**Request Body:** None

**Response `200`:**

```json
{
  "success": true,
  "message": "Session invalidated"
}
```

**Errors:** `401` · `500`

---

### Users (`/api/v1/users`)

---

#### `GET /api/v1/users`

List all users with optional filtering.

**Auth Required:** Yes (API Key)

**Query Parameters:**

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `email` | `string` | — | Filter by email (partial match) |
| `limit` | `integer` | `20` | Max number of records to return |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "username": "johndoe",
      "title": "Mr",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+66812345678",
      "image": "https://...",
      "countryCode": "TH",
      "dateOfBirth": "1990-01-01T00:00:00Z",
      "citizenId": "encrypted_string",
      "isIdentityVerified": true,
      "isActive": true,
      "pointsBalance": 100
    }
  ]
}
```

**Errors:** `401` · `500`

---

#### `POST /api/v1/users`

Create a new user account.

**Auth Required:** Yes (API Key, `read-write` scope)

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword",
  "image": "https://...",
  "pointsBalance": 0,
  "phoneNumber": "+66812345678",
  "countryCode": "TH",
  "dateOfBirth": "1990-01-01",
  "isActive": true,
  "addresses": [
    {
      "label": "Home",
      "addressLine1": "123 Main St",
      "subdistrict": "Chatuchak",
      "district": "Chatuchak",
      "province": "Bangkok",
      "zipCode": "10900",
      "isDefault": true
    }
  ]
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `email` | `string` | Yes | User's email |
| `name` | `string` | No | Display name |
| `password` | `string` | No | Password (hashed with bcrypt) |
| `image` | `string` | No | Profile image URL |
| `pointsBalance` | `integer` | No | Initial points (default: `0`) |
| `phoneNumber` | `string` | No | Phone number |
| `countryCode` | `string` | No | Phone country code |
| `dateOfBirth` | `string` | No | Date of birth (ISO format) |
| `isActive` | `boolean` | No | Active status (default: `true`) |
| `addresses` | `Address[]` | No | Array of address objects |

**Response `201`:** Returns the full user object including created addresses, gamification logs, and lottery subscriptions.

**Errors:** `400` Missing email · `403` Insufficient permissions · `409` User already exists · `500`

---

#### `GET /api/v1/users/{id}`

Get detailed information about a specific user.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "username": "johndoe",
    "title": "Mr",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+66812345678",
    "image": "https://...",
    "countryCode": "TH",
    "dateOfBirth": "1990-01-01T00:00:00Z",
    "citizenId": "encrypted_string",
    "isIdentityVerified": true,
    "isActive": true,
    "pointsBalance": 100,
    "addresses": [
      {
        "id": "uuid",
        "label": "Home",
        "addressLine1": "123 Main St",
        "subdistrict": "Chatuchak",
        "district": "Chatuchak",
        "province": "Bangkok",
        "zipCode": "10900",
        "isDefault": true
      }
    ],
    "gamificationLogs": [
      {
        "id": "uuid",
        "action": "daily_login",
        "points": 10,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "lotterySubscriptions": [
      {
        "id": "uuid",
        "lotteryId": 1,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**Errors:** `401` · `404` User not found · `500`

---

#### `PATCH /api/v1/users/{id}`

Update specific fields of a user's profile.

**Auth Required:** Yes (API Key, `read-write` scope)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Request Body (all fields optional):**

```json
{
  "name": "Updated Name",
  "username": "newusername",
  "title": "Mr",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "image": "https://...",
  "phoneNumber": "+66812345678",
  "countryCode": "TH",
  "dateOfBirth": "1990-01-01",
  "citizenId": "1234567890123",
  "isIdentityVerified": true,
  "isActive": true,
  "password": "newpassword",
  "pointsBalance": 200,
  "addresses": [
    {
      "id": "existing-uuid",
      "label": "Office",
      "addressLine1": "456 Corporate Blvd",
      "subdistrict": "Huaykwang",
      "district": "Huaykwang",
      "province": "Bangkok",
      "zipCode": "10310",
      "isDefault": false
    }
  ]
}
```

> **Note:** Addresses with an `id` field are updated; addresses without `id` are created. The `citizenId` is encrypted before storage.

**Response `200`:** Returns the full updated user object (same shape as `GET /api/v1/users/{id}`).

**Errors:** `400` Validation error · `401` · `403` · `404` User not found · `500`

---

#### `DELETE /api/v1/users/{id}`

Permanently delete a user account.

**Auth Required:** Yes (API Key, `read-write` scope)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Response:** `204 No Content`

**Errors:** `401` · `403` · `500`

---

#### `POST /api/v1/users/push-token`

Register a Web Push subscription for a user.

**Auth Required:** Yes (API Key)

**Request Body:**

```json
{
  "userId": "uuid",
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "p256dh": "base64_encoded_key",
      "auth": "base64_encoded_auth"
    }
  }
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `userId` | `string` | Yes | User ID to associate the subscription with |
| `subscription.endpoint` | `string` | Yes | Push service endpoint URL |
| `subscription.keys.p256dh` | `string` | Yes | P-256 Diffie-Hellman public key |
| `subscription.keys.auth` | `string` | Yes | Authentication secret |

**Response `200`:**

```json
{
  "success": true
}
```

**Errors:** `400` Invalid input · `401` · `404` User not found · `500`

---

#### `GET /api/v1/users/{id}/address`

Retrieve all addresses for a specific user.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "label": "Home",
      "addressLine1": "123 Main St",
      "subdistrict": "Chatuchak",
      "district": "Chatuchak",
      "province": "Bangkok",
      "zipCode": "10900",
      "isDefault": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Errors:** `401` · `404` User not found · `500`

---

#### `POST /api/v1/users/{id}/address`

Add a new address for a user.

**Auth Required:** Yes (API Key, `read-write` scope)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Request Body:**

```json
{
  "label": "Office",
  "addressLine1": "456 Corporate Blvd",
  "subdistrict": "Huaykwang",
  "district": "Huaykwang",
  "province": "Bangkok",
  "zipCode": "10310",
  "isDefault": false
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `label` | `string` | No | Address label (default: `"Home"`) |
| `addressLine1` | `string` | Yes | Street address line |
| `subdistrict` | `string` | Yes | Subdistrict |
| `district` | `string` | Yes | District |
| `province` | `string` | Yes | Province |
| `zipCode` | `string` | Yes | Postal code |
| `isDefault` | `boolean` | No | Set as default address |

> **Note:** Setting `isDefault: true` will unset any existing default address for this user.

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "label": "Office",
    "addressLine1": "456 Corporate Blvd",
    "subdistrict": "Huaykwang",
    "district": "Huaykwang",
    "province": "Bangkok",
    "zipCode": "10310",
    "isDefault": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:** `400` Validation error · `401` · `403` · `404` User not found · `500`

---

#### `GET /api/v1/users/{id}/points`

Get a user's current points balance.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "pointsBalance": 100
  }
}
```

**Errors:** `401` · `404` User not found · `500`

---

#### `GET /api/v1/users/{id}/subscriptions`

Get all lottery subscriptions for a user.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "lotteryId": 1,
      "createdAt": "2024-01-01T00:00:00Z",
      "lottery": {
        "id": 1,
        "name": "Thai Government Lottery",
        "country": "THAI"
      }
    }
  ]
}
```

**Errors:** `401` · `500`

---

#### `POST /api/v1/users/{id}/subscriptions`

Subscribe a user to a specific lottery.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |

**Request Body:**

```json
{
  "lotteryId": 1
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `lotteryId` | `integer` | Yes | ID of the lottery to subscribe to (positive integer) |

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "lotteryId": 1,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:** `400` Invalid input · `401` · `500`

---

#### `DELETE /api/v1/users/{id}/subscriptions/{lotteryId}`

Unsubscribe a user from a specific lottery.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | User ID (UUID) |
| `lotteryId` | `integer` | Lottery ID |

**Response `200`:**

```json
{
  "success": true
}
```

**Errors:** `400` Invalid lottery ID · `401` · `404` Subscription not found · `500`

---

### Lotteries (`/api/v1/lotteries`)

---

#### `GET /api/v1/lotteries`

List all configured lottery scrapers.

**Auth Required:** Yes (API Key)

**Query Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `country` | `string` | Filter by country code (e.g., `"THAI"`) — partial match |
| `active` | `boolean` | Filter by active status (`true`/`false`) |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Thai Government Lottery",
      "url": "https://example.com/api/thai",
      "country": "THAI",
      "cronSchedule": "0 15 1,16 * *",
      "status": "active",
      "lastRunAt": "2024-06-01T15:00:00Z",
      "nextRunAt": "2024-06-16T15:00:00Z"
    }
  ]
}
```

**Errors:** `401` · `500`

---

#### `POST /api/v1/lotteries`

Create a new lottery scraper configuration.

**Auth Required:** Yes (API Key, `read-write` scope)

**Request Body:**

```json
{
  "name": "Thai Government Lottery",
  "url": "https://example.com/api/thai",
  "country": "THAI",
  "cronSchedule": "0 15 1,16 * *",
  "status": "active"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `name` | `string` | Yes | Name of the lottery |
| `url` | `string` | Yes | Scraper source URL |
| `cronSchedule` | `string` | Yes | Cron expression for scheduling |
| `country` | `string` | No | Country code (default: `"THAI"`) |
| `status` | `string` | No | Status (default: `"active"`) |

**Response `201`:** Returns the created lottery object (same shape as GET response items).

**Errors:** `400` Missing required fields · `403` · `500`

---

#### `GET /api/v1/lotteries/{id}`

Get details of a specific lottery.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | Lottery ID (integer, passed as string in URL) |

**Response `200`:** Returns a single lottery object.

**Errors:** `400` Invalid ID · `401` · `404` Lottery not found · `500`

---

#### `PATCH /api/v1/lotteries/{id}`

Update a lottery configuration.

**Auth Required:** Yes (API Key, `read-write` scope)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | Lottery ID |

**Request Body (all fields optional):**

```json
{
  "name": "Updated Name",
  "url": "https://new-url.com",
  "country": "LAO",
  "cronSchedule": "0 12 * * 5",
  "status": "inactive"
}
```

**Response `200`:** Returns the updated lottery object.

**Errors:** `400` Invalid ID · `403` · `404` Lottery not found · `500`

---

#### `DELETE /api/v1/lotteries/{id}`

Delete a lottery configuration.

**Auth Required:** Yes (API Key, `read-write` scope)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | Lottery ID |

**Response:** `204 No Content`

**Errors:** `400` Invalid ID · `403` · `500`

---

### Results (`/api/v1/results`)

---

#### `GET /api/v1/results`

Get lottery results with filtering and pagination.

**Auth Required:** Yes (API Key)

**Query Parameters:**

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `lotteryId` | `integer` | — | Filter by lottery ID |
| `date` | `string` | — | Filter by draw date (`YYYY-MM-DD`) |
| `page` | `integer` | `1` | Page number |
| `pageSize` | `integer` | `20` | Items per page (also accepts `limit`) |
| `includePrizes` | `boolean` | `true` | Whether to include prize details |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "lotteryId": 1,
      "drawDate": "2024-06-01",
      "firstPrize": "123456",
      "front3": ["123", "456"],
      "back3": ["789", "012"],
      "last2": "56",
      "prizes": [
        {
          "category": "prize_1",
          "prizeAmount": 6000000,
          "winningNumbers": "123456"
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 5
  }
}
```

> **Note:** The `fullData` JSON is spread into the top-level data object. Prizes are included when `includePrizes` is `true`.

**Errors:** `401` · `500`

---

#### `POST /api/v1/results`

Ingest a new lottery result.

**Auth Required:** Yes (API Key, `read-write` scope)

**Request Body:**

```json
{
  "lotteryId": 1,
  "drawDate": "2024-06-01",
  "drawPeriod": "1/2567",
  "numbers": ["123456"],
  "bonus": [],
  "jackpot": 6000000,
  "prizes": [
    {
      "category": "prize_1",
      "prizeAmount": 6000000,
      "winningNumbers": "123456"
    }
  ]
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `lotteryId` | `integer` | Yes | Lottery ID |
| `drawDate` | `string` | Yes | Draw date (`YYYY-MM-DD`) |
| `numbers` | `string[]` | Yes | Main winning numbers |
| `drawPeriod` | `string` | No | Draw period identifier |
| `bonus` | `array` | No | Bonus numbers |
| `jackpot` | `number` | No | Jackpot amount |
| `prizes` | `Prize[]` | No | Array of prize objects |

**Prize object:**

| Field | Type | Description |
|:---|:---|:---|
| `category` | `string` | Prize category (e.g., `"prize_1"`, `"prize_2"`, `"digit_4"`) |
| `prizeAmount` | `number` | Prize amount |
| `winningNumbers` | `string` | Winning number(s) |

**Response `201`:** Returns the created result with prizes.

**Errors:** `400` Missing required fields · `403` · `500`

---

#### `GET /api/v1/results/{id}`

Get details of a specific lottery result.

**Auth Required:** Yes (API Key)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | Result ID (integer) |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "lotteryId": 1,
    "drawDate": "2024-06-01",
    "firstPrize": "123456",
    "front3": ["123", "456"],
    "back3": ["789", "012"],
    "last2": "56"
  }
}
```

> **Note:** `fullData` is spread into the top-level of `data`.

**Errors:** `400` Invalid ID · `401` · `404` Result not found · `500`

---

#### `PATCH /api/v1/results/{id}`

Update a lottery result.

**Auth Required:** Yes (API Key, `read-write` scope)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | Result ID (integer) |

**Request Body (all fields optional):**

```json
{
  "drawDate": "2024-06-02",
  "drawPeriod": "2/2567",
  "numbers": ["654321"],
  "bonus": [],
  "jackpot": 5000000
}
```

> **Note:** Fields like `numbers`, `bonus`, `jackpot` are merged into the existing `fullData` JSON.

**Response `200`:** Returns the updated result.

**Errors:** `400` Invalid ID · `403` · `404` Result not found · `500`

---

#### `DELETE /api/v1/results/{id}`

Delete a lottery result.

**Auth Required:** Yes (API Key, `read-write` scope)

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | `string` | Result ID (integer) |

**Response:** `204 No Content`

**Errors:** `400` Invalid ID · `403` · `500`

---

#### `GET /api/v1/results/check`

Check if a set of numbers matches any winning results. **No authentication required.**

**Query Parameters:**

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `numbers` | `string` | Yes | Comma-separated numbers (e.g., `"12,34,56"`) |
| `lotteryId` | `integer` | No | Narrow search to a specific lottery |
| `date` | `string` | No | Narrow search to a specific draw date |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "checkedNumbers": ["12", "34", "56"],
    "totalMatches": 1,
    "matches": [
      {
        "number": "56",
        "drawDate": "2024-06-01",
        "lotteryName": "Thai Government Lottery",
        "category": "running_number_back_2",
        "prizeAmount": "100000"
      }
    ]
  }
}
```

**Errors:** `400` Missing numbers · `500`

---

### Articles (`/api/v1/articles`)

---

#### `GET /api/v1/articles`

List articles with optional filtering and pagination.

**Auth Required:** No

**Query Parameters:**

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `page` | `integer` | `1` | Page number |
| `limit` | `integer` | `10` | Items per page |
| `search` | `string` | — | Search term for title or content |
| `lang` | `string` | — | Language code (`"en"`, `"th"`) |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "how-to-check-thai-lottery",
      "title": "How to Check Thai Lottery",
      "excerpt": "Learn how to check...",
      "coverImage": "https://...",
      "published": true,
      "publishedAt": "2024-06-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

#### `GET /api/v1/articles/{slug}`

Get a specific article by URL slug.

**Auth Required:** No

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `slug` | `string` | Article URL slug |

**Response `200`:** Returns the full article object.

**Errors:** `404` Article not found

---

## Public Spec API Endpoints

These endpoints are consumed by the frontend application and do **not** require authentication.

---

### Results API

#### `GET /api/results/latest`

Fetch latest lottery results for all types (used by homepage).

**Query Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `type` | `string` | Filter by type: `"THAI"` or `"LAO"` (optional) |

**Response `200`:**

```json
{
  "results": [
    {
      "id": 1,
      "type": "THAI",
      "date": "2024-06-01",
      "drawDate": "2024-06-01T00:00:00Z",
      "drawNo": "1/2567",
      "data": {
        "firstPrize": "123456",
        "firstPrizeAmount": "6,000,000",
        "front3": ["123", "456"],
        "front3Amount": "4,000",
        "back3": ["789", "012"],
        "back3Amount": "4,000",
        "last2": "56",
        "last2Amount": "2,000",
        "adjacent": ["123455", "123457"],
        "adjacentAmount": "100,000",
        "prize2": ["234567", "345678"],
        "prize2Amount": "200,000"
      }
    }
  ]
}
```

For LAO type, the `data` object uses digit-based format:

```json
{
  "digit4": "1234",
  "digit4Multiplier": "x500",
  "digit3": "123",
  "digit3Multiplier": "x150",
  "digit2": "12",
  "digit2Multiplier": "x70",
  "digit1": "1",
  "digit1Multiplier": "x30"
}
```

---

#### `GET /api/results/{type}`

Fetch results for a specific lottery type with history.

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `type` | `string` | `"thai"` or `"lao"` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `limit` | `integer` | `1` | Number of results (max 50) |
| `offset` | `integer` | `0` | Offset for pagination |

**Response `200`:**

```json
{
  "latest": {
    "id": 1,
    "type": "THAI",
    "date": "2024-06-01",
    "dateDisplay": "1 มิถุนายน 2567",
    "drawNo": "1/2567",
    "daysAgo": "3 วันที่แล้ว",
    "data": { ... }
  },
  "history": [
    {
      "date": "2024-05-16",
      "dateDisplay": "16 พ.ค. 67",
      "drawNo": "16/2567",
      "data": { ... }
    }
  ],
  "total": 50
}
```

**Errors:** `400` Invalid type · `404` No results found · `500`

---

#### `GET /api/results/global`

Fetch global lottery results from all countries with pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `page` | `integer` | `1` | Page number |
| `limit` | `integer` | `20` | Items per page (max 100) |
| `country` | `string` | — | Filter by country (`"THA"`, `"THAI"`, `"LAO"`, `"LA"`) |
| `period` | `string` | — | Filter by period (`"7d"`, `"30d"`, `"all"`) |
| `date` | `string` | — | Filter by draw date (`YYYY-MM-DD`) |

**Response `200`:**

```json
{
  "draws": [
    {
      "id": 1,
      "time": "00:00",
      "country": "Thailand",
      "countryCode": "th",
      "name": "Thai Government Lottery",
      "numbers": ["123456"],
      "special": null,
      "jackpot": "6,000,000",
      "drawDate": "2024-06-01T00:00:00Z",
      "status": "completed"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

---

### Check Number

#### `GET /api/check`

Check if a number won a prize.

**Query Parameters:**

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `number` | `string` | Yes | Number to check |
| `type` | `string` | Yes | Lottery type: `"THAI"` or `"LAO"` |
| `drawDate` | `string` | No | Specific draw date (`YYYY-MM-DD`). Defaults to latest. |

**Response `200` (Win):**

```json
{
  "win": true,
  "prize": "prize_1",
  "prizeLabel": "รางวัลที่ 1",
  "amount": "6,000,000",
  "drawDate": "2024-06-01",
  "drawNo": "1/2567"
}
```

**Response `200` (No Win):**

```json
{
  "win": false,
  "prize": null,
  "prizeLabel": null,
  "amount": null,
  "drawDate": "2024-06-01",
  "drawNo": "1/2567"
}
```

**Errors:** `400` Missing number/type · `404` No result found · `500`

---

### Subscribe

#### `POST /api/subscribe`

Subscribe to lottery results via email.

**Request Body:**

```json
{
  "email": "user@example.com",
  "type": "THAI"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `email` | `string` | Yes | Subscriber email |
| `type` | `string` | Yes | Lottery type: `"THAI"`, `"LAO"`, or `"ALL"` |

**Response `200`:**

```json
{
  "success": true,
  "subscriber": {
    "id": 1719856789000,
    "email": "user@example.com",
    "type": "THAI",
    "active": true
  }
}
```

**Errors:** `400` Missing email/type · `500`

---

### Countries

#### `GET /api/countries`

List all supported countries with their lottery metadata.

**Response `200`:**

```json
{
  "countries": [
    {
      "code": "th",
      "name": "Thailand",
      "lottoName": "Thai Government Lottery",
      "flag": "https://flagcdn.com/w80/th.png",
      "nextDraw": null,
      "jackpot": null,
      "drawSchedule": "1st and 16th of every month",
      "odds": "1 in 1,000,000"
    }
  ]
}
```

---

#### `GET /api/countries/{code}/draws`

Fetch historical draws for a specific country.

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `code` | `string` | Country code (`"th"`, `"la"`) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `limit` | `integer` | `10` | Number of draws to return (max 50) |

**Response `200`:**

```json
{
  "country": {
    "code": "th",
    "name": "Thailand",
    "lottoName": "Thai Lotto"
  },
  "draws": [
    {
      "date": "2024-06-01",
      "drawId": "1/2567",
      "numbers": ["123456"],
      "topPrize": "6,000,000"
    }
  ]
}
```

**Errors:** `404` Country not found · `500`

---

### News

#### `GET /api/news`

Fetch published news articles list.

**Query Parameters:**

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `page` | `integer` | `1` | Page number |
| `limit` | `integer` | `10` | Items per page (max 50) |
| `category` | `string` | — | Filter by category |
| `lang` | `string` | `"th"` | Language code |

**Response `200`:**

```json
{
  "articles": [
    {
      "slug": "how-to-check-lottery",
      "title": "How to Check Lottery Results",
      "excerpt": "A quick guide...",
      "image": "https://...",
      "date": "2024-06-01",
      "category": "news",
      "author": "LOTTOX Editorial"
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

#### `GET /api/news/{slug}`

Get a news article's full content by slug.

**Path Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `slug` | `string` | Article URL slug |

**Query Parameters:**

| Parameter | Type | Description |
|:---|:---|:---|
| `lang` | `string` | Language code (`"th"`, `"en"`) — optional |

**Response `200`:**

```json
{
  "slug": "how-to-check-lottery",
  "title": "How to Check Lottery Results",
  "content": "<p>Full article content...</p>",
  "image": "https://...",
  "date": "2024-06-01",
  "category": "news",
  "author": "LOTTOX Editorial",
  "source": "LOTTOX",
  "related": ["another-article-slug", "tips-and-tricks"]
}
```

**Errors:** `404` Article not found · `500`

---

### Statistics

#### `GET /api/statistics/overview`

Fetch high-level platform statistics.

**Response `200`:**

```json
{
  "totalJackpotsTracked": "150 draws tracked",
  "activeLotteries": 3,
  "upcomingDraws24h": 0,
  "totalCountries": 2
}
```

---

#### `GET /api/statistics/frequency`

Fetch number frequency statistics.

**Query Parameters:**

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `type` | `string` | Yes | `"THAI"` or `"LAO"` |
| `draws` | `integer` | No | Number of draws to analyze (default: `30`, max: `100`) |
| `position` | `string` | No | Filter by position: `"last2"`, `"last3"`, `"front3"`, `"first"` |

**Response `200`:**

```json
{
  "type": "THAI",
  "draws": 30,
  "frequency": {
    "last2": [
      { "number": "56", "count": 5 },
      { "number": "23", "count": 4 }
    ],
    "last3": [
      { "number": "456", "count": 3 }
    ],
    "front3": [
      { "number": "123", "count": 2 }
    ],
    "first": [
      { "number": "123456", "count": 1 }
    ]
  },
  "trends": {
    "evenOddRatio": "53:47",
    "mostFrequentStartDigit": "3"
  }
}
```

**Errors:** `400` Missing/invalid type · `500`

---

### Auth (Public)

These are frontend-facing authentication endpoints separate from the v1 API key system.

#### `POST /api/auth/login`

Login with email and password. Returns a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:** `400` Missing fields · `401` Invalid credentials · `500`

---

#### `POST /api/auth/register`

Register a new user account. Returns a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `email` | `string` | Yes | Email address |
| `password` | `string` | Yes | Password (hashed with bcrypt, salt rounds: 12) |
| `name` | `string` | No | Display name |

**Response `201`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:** `400` Missing fields / User already exists · `500`

---

#### `POST /api/auth/google`

Login with Google OAuth ID token. **(Not yet implemented)**

**Request Body:**

```json
{
  "idToken": "google_oauth_id_token"
}
```

**Response:** `500` — Currently returns an error indicating Google OAuth is not configured.

---

### Cron

#### `GET /api/cron`

Trigger scheduled scraping jobs. Intended for Vercel Cron or manual invocation.

**Auth:** Optional `Authorization: Bearer <CRON_SECRET>` header (if `CRON_SECRET` env var is set).

**Response `200`:**

```json
{
  "success": true,
  "checked": 3,
  "executed": [
    {
      "id": 1,
      "name": "Thai Government Lottery",
      "status": "success"
    }
  ]
}
```

**Errors:** `401` Unauthorized (if `CRON_SECRET` is configured and header is missing/invalid)

---

### Swagger / OpenAPI

#### `GET /api/doc`

Returns the auto-generated OpenAPI/Swagger JSON specification for all annotated v1 endpoints.

**Response `200`:** OpenAPI 3.0 JSON spec.

---

## Data Models

### User

| Field | Type | Description |
|:---|:---|:---|
| `id` | `string` (UUID) | Unique identifier |
| `title` | `string` | Mr/Mrs/Ms etc. |
| `firstName` | `string` | First name |
| `lastName` | `string` | Last name |
| `name` | `string` | Display name |
| `email` | `string` | Email address |
| `username` | `string` | Unique username |
| `gender` | `string` | Gender |
| `phoneNumber` | `string` | Contact number |
| `countryCode` | `string` | Phone country code |
| `role` | `string` | `"user"` or `"admin"` |
| `pointsBalance` | `integer` | Gamification points (default: `0`) |
| `isIdentityVerified` | `boolean` | KYC status |
| `isActive` | `boolean` | Account active status |
| `dateOfBirth` | `timestamp` | Date of birth |
| `citizenId` | `string` | National ID (encrypted at rest) |
| `image` | `string` | Profile image URL |

### Address

| Field | Type | Description |
|:---|:---|:---|
| `id` | `string` (UUID) | Unique identifier |
| `userId` | `string` | Owner user ID |
| `label` | `string` | Address label (e.g., `"Home"`, `"Office"`) |
| `addressLine1` | `string` | Street address |
| `subdistrict` | `string` | Subdistrict |
| `district` | `string` | District |
| `province` | `string` | Province |
| `zipCode` | `string` | Postal code |
| `isDefault` | `boolean` | Whether this is the default address |
| `createdAt` | `timestamp` | Creation date |
| `updatedAt` | `timestamp` | Last update date |

### Lottery

| Field | Type | Description |
|:---|:---|:---|
| `id` | `integer` | Unique identifier |
| `name` | `string` | Lottery name |
| `url` | `string` | Scraper source URL |
| `country` | `string` | Country code (e.g., `"THAI"`, `"LAO"`) |
| `cronSchedule` | `string` | Cron expression for draw schedule |
| `status` | `string` | `"active"` or `"inactive"` |
| `lastRunAt` | `timestamp` | Last scraper run timestamp |
| `nextRunAt` | `timestamp` | Next scheduled run |

### LotteryResult

| Field | Type | Description |
|:---|:---|:---|
| `id` | `integer` | Unique identifier |
| `lotteryId` | `integer` | Foreign key to Lottery |
| `drawDate` | `string` | Draw date (`YYYY-MM-DD`) |
| `drawPeriod` | `string` | Draw period identifier |
| `fullData` | `JSON` | Full result data (numbers, bonus, jackpot) |

### LotteryPrize

| Field | Type | Description |
|:---|:---|:---|
| `category` | `string` | Prize category (e.g., `"prize_1"`, `"digit_4"`) |
| `prizeName` | `string` | Human-readable prize name |
| `prizeAmount` | `number` | Prize amount |
| `winningNumbers` | `string[]` | Array of winning numbers |
| `order` | `integer` | Display order |

### LotterySubscription

| Field | Type | Description |
|:---|:---|:---|
| `id` | `string` (UUID) | Unique identifier |
| `userId` | `string` | User ID |
| `lotteryId` | `integer` | Lottery ID |
| `createdAt` | `timestamp` | Subscription date |

### Article

| Field | Type | Description |
|:---|:---|:---|
| `id` | `string` (UUID) | Unique identifier |
| `slug` | `string` | URL-friendly slug |
| `title` | `string` | Article title |
| `excerpt` | `string` | Short summary |
| `content` | `JSON/string` | Full article content (HTML/Markdown) |
| `coverImage` | `string` | Cover image URL |
| `tags` | `string[]` | Tags/categories |
| `published` | `boolean` | Publication status |
| `publishedAt` | `timestamp` | Publication date |
| `authorId` | `string` | Author user ID |

---

## API Versioning

### Current Version

All v1 endpoints are served under `/api/v1/`. Responses include the `API-Version: v1` header.

### Versioning Strategy

| Policy | Detail |
|:---|:---|
| Scheme | URL path prefix (`/api/v1/`, `/api/v2/`) |
| Breaking changes | New major version (`v2`) |
| Non-breaking additions | Additive to current version (new fields, endpoints) |
| Deprecation notice | `Deprecation` and `Sunset` headers on affected endpoints |
| Support window | Minimum 6 months after deprecation |

### Deprecation Headers

When an endpoint is deprecated, responses will include:

```http
Deprecation: true
Sunset: Sat, 01 Jan 2027 00:00:00 GMT
Link: </api/v2/users>; rel="successor-version"
```