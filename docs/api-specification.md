# LOTTOX - API Specification Requirement

> เอกสารนี้ระบุ API ทั้งหมดที่ระบบ LOTTOX ต้องการ จัดทำจากการสำรวจทุกหน้าและ component ที่มีการใช้ข้อมูล

---

## สถานะปัจจุบัน

| หน้า/Component | แหล่งข้อมูลปัจจุบัน | ต้องเปลี่ยนเป็น API |
|---|---|---|
| Homepage > ResultsTable | Mock data ใน component | Yes |
| Homepage > HeroSection | Static lottery list | No (config) |
| Thai Lotto Results | Mock data (latestDraw, draws) | Yes |
| Lao Lotto Results | Mock data (latestDraw, recentResults) | Yes |
| Global Draws / Results | Mock data ใน DashboardTable | Yes |
| Country Page [country] | Mock COUNTRY_DATA | Yes |
| News List | Static file (newsData.ts) | Yes |
| News Detail [slug] | Static file (newsData.ts) | Yes |
| Statistics | Mock stats | Yes |
| Login | No API (UI only) | Yes |
| API Docs | Static docs | No |
| Static Pages (about, faq, etc.) | i18n dictionary | No |

---

## Database Schema (Prisma)

ปัจจุบันมี 2 models:

```prisma
model LotteryResult {
  id        Int      @id @default(autoincrement())
  type      String   // "THAI" | "LAO"
  date      String
  drawDate  DateTime
  drawNo    String?
  data      String   // JSON string สำหรับข้อมูลรางวัลทั้งหมด
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Subscriber {
  id        Int      @id @default(autoincrement())
  email     String
  type      String   // "THAI" | "LAO" | "ALL"
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

---

## API Endpoints

### 1. Lottery Results API

#### 1.1 GET /api/results/latest

ดึงผลหวยล่าสุดของทุกประเภท (ใช้ในหน้า Homepage > ResultsTable)

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| type | string | No | กรอง: `THAI`, `LAO` หรือไม่ส่งคือทั้งหมด |

**Response (200):**

```json
{
  "results": [
    {
      "id": 1,
      "type": "THAI",
      "date": "2026-02-16",
      "drawDate": "2026-02-16T00:00:00Z",
      "drawNo": "#40/2569",
      "data": {
        "firstPrize": "987654",
        "firstPrizeAmount": "6,000,000",
        "front3": ["123", "456"],
        "front3Amount": "4,000",
        "back3": ["789", "012"],
        "back3Amount": "4,000",
        "last2": "99",
        "last2Amount": "2,000",
        "adjacent": ["987653", "987655"],
        "adjacentAmount": "100,000",
        "prize2": ["048036", "374502", "602910", "679914", "889775"],
        "prize2Amount": "200,000",
        "prize3": ["145551", "167591", "..."],
        "prize3Amount": "80,000",
        "prize4": ["004427", "242652", "..."],
        "prize4Amount": "40,000",
        "prize5": ["12345", "23456", "..."],
        "prize5Amount": "20,000"
      }
    },
    {
      "id": 2,
      "type": "LAO",
      "date": "2026-02-13",
      "drawDate": "2026-02-13T00:00:00Z",
      "drawNo": "#18/2569",
      "data": {
        "digit4": "4045",
        "digit4Multiplier": "x6,000",
        "digit3": "045",
        "digit3Multiplier": "x500",
        "digit2": "45",
        "digit2Multiplier": "x60",
        "digit1": "5"
      }
    }
  ]
}
```

---

#### 1.2 GET /api/results/:type

ดึงผลหวยแบบเจาะจงประเภท (ใช้ในหน้า Thai Lotto / Lao Lotto detail)

**Path Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| type | string | Yes | `thai` หรือ `lao` |

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| limit | number | No | จำนวนงวดย้อนหลัง (default: 1) |
| offset | number | No | สำหรับ pagination (default: 0) |

**Response (200):**

```json
{
  "latest": {
    "id": 1,
    "type": "THAI",
    "date": "2026-02-16",
    "dateDisplay": "16 กุมภาพันธ์ 2569",
    "drawNo": "#40/2569",
    "daysAgo": "3 วันที่แล้ว",
    "data": { "...ข้อมูลรางวัลทั้งหมด..." }
  },
  "history": [
    {
      "date": "2026-02-01",
      "dateDisplay": "1 ก.พ. 69",
      "drawNo": "#39/2569",
      "data": { "..." }
    }
  ],
  "total": 24
}
```

---

#### 1.3 GET /api/results/global

ดึงผลหวยจากทุกประเทศ (ใช้ในหน้า Global Draws / Results)

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| page | number | No | หน้า (default: 1) |
| limit | number | No | จำนวนต่อหน้า (default: 20) |
| country | string | No | กรองตามประเทศ เช่น `THA`, `USA`, `EUR` |
| period | string | No | ช่วงเวลา: `7d`, `30d`, `all` |
| date | string | No | วันที่เฉพาะ YYYY-MM-DD |

**Response (200):**

```json
{
  "draws": [
    {
      "id": 1,
      "time": "10:59 PM",
      "country": "USA",
      "countryCode": "us",
      "name": "USA Powerball",
      "numbers": ["05", "12", "34", "41", "58"],
      "special": "09",
      "jackpot": "$463 Million",
      "drawDate": "2026-02-16T22:59:00Z",
      "status": "completed"
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

---

### 2. Check Number API (มีอยู่แล้ว)

#### 2.1 GET /api/check

ตรวจเลข ว่าถูกรางวัลหรือไม่

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| number | string | Yes | เลขที่ต้องการตรวจ |
| type | string | Yes | `THAI` หรือ `LAO` |
| drawDate | string | No | วันที่งวด (default: งวดล่าสุด) |

**Response (200):**

```json
{
  "win": true,
  "prize": "prize1",
  "prizeLabel": "รางวัลที่ 1",
  "amount": "6,000,000",
  "drawDate": "2026-02-16",
  "drawNo": "#40/2569"
}
```

---

### 3. Subscribe API (มีอยู่แล้ว)

#### 3.1 POST /api/subscribe

สมัครรับผลหวยทางอีเมล

**Request Body:**

```json
{
  "email": "user@example.com",
  "type": "THAI"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| email | string | Yes | อีเมลผู้สมัคร |
| type | string | Yes | `THAI`, `LAO`, หรือ `ALL` |

**Response (200):**

```json
{
  "success": true,
  "subscriber": {
    "id": 1,
    "email": "user@example.com",
    "type": "THAI",
    "active": true
  }
}
```

---

### 4. Country API

#### 4.1 GET /api/countries

ดึงรายชื่อประเทศทั้งหมดที่รองรับ (ใช้ในหน้า [country])

**Response (200):**

```json
{
  "countries": [
    {
      "code": "th",
      "name": "Thailand",
      "lottoName": "Thai Lotto",
      "flag": "https://flagcdn.com/w80/th.png",
      "nextDraw": "2026-02-19T14:30:00+07:00",
      "jackpot": "6 Million B",
      "drawSchedule": "1st and 16th of every month",
      "odds": "1 in 1,000,000"
    }
  ]
}
```

#### 4.2 GET /api/countries/:code/draws

ดึงผลหวยย้อนหลังของประเทศนั้น

**Path Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| code | string | Yes | รหัสประเทศ เช่น `th`, `us`, `la` |

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| limit | number | No | จำนวนย้อนหลัง (default: 10) |

**Response (200):**

```json
{
  "country": {
    "code": "th",
    "name": "Thailand",
    "lottoName": "Thai Lotto"
  },
  "draws": [
    {
      "date": "2026-02-16",
      "drawId": "#40/2569",
      "numbers": ["9", "8", "7", "6", "5", "4"],
      "topPrize": "6 Million B"
    }
  ]
}
```

---

### 5. News API

#### 5.1 GET /api/news

ดึงรายการข่าว/บทความ (ใช้ในหน้า News list และ sidebar ข่าว)

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| page | number | No | หน้า (default: 1) |
| limit | number | No | จำนวนต่อหน้า (default: 10) |
| category | string | No | กรองตามหมวดหมู่ เช่น `news`, `stats`, `lucky_numbers` |
| lang | string | No | ภาษา: `th` หรือ `en` (default: `th`) |

**Response (200):**

```json
{
  "articles": [
    {
      "slug": "lucky-numbers-feb-16-2569",
      "title": "เลขเด็ด งวด 16 ก.พ. 69",
      "excerpt": "รวมเลขเด็ดจากทุกสำนัก...",
      "image": "https://images.unsplash.com/...",
      "date": "2026-02-13",
      "category": "เลขเด็ด",
      "author": "LOTTOX Editorial"
    }
  ],
  "total": 6,
  "page": 1,
  "totalPages": 1
}
```

#### 5.2 GET /api/news/:slug

ดึงรายละเอียดข่าว/บทความ (ใช้ในหน้า News Detail)

**Path Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| slug | string | Yes | slug ของบทความ |

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| lang | string | No | ภาษา: `th` หรือ `en` |

**Response (200):**

```json
{
  "slug": "lucky-numbers-feb-16-2569",
  "title": "เลขเด็ด งวด 16 ก.พ. 69",
  "content": "รวมเลขเด็ดจากทุกสำนัก...",
  "image": "https://images.unsplash.com/...",
  "date": "2026-02-13",
  "category": "เลขเด็ด",
  "author": "LOTTOX Editorial",
  "source": "LOTTOX",
  "related": ["february-stats-analysis", "latest-results-summary-winners"]
}
```

---

### 6. Statistics API

#### 6.1 GET /api/statistics/overview

ดึงสถิติภาพรวม (ใช้ในหน้า Statistics)

**Response (200):**

```json
{
  "totalJackpotsTracked": "$1.4 Billion",
  "activeLotteries": 54,
  "upcomingDraws24h": 12,
  "totalCountries": 50
}
```

#### 6.2 GET /api/statistics/frequency

ดึงสถิติความถี่ของเลข (ใช้ในหน้า Statistics - Future)

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| type | string | Yes | `THAI` หรือ `LAO` |
| draws | number | No | จำนวนงวดย้อนหลัง (default: 30) |
| position | string | No | ตำแหน่ง: `last2`, `last3`, `front3`, `first` |

**Response (200):**

```json
{
  "type": "THAI",
  "draws": 30,
  "frequency": {
    "last2": [
      { "number": "48", "count": 5 },
      { "number": "29", "count": 4 },
      { "number": "03", "count": 4 }
    ],
    "last3": [
      { "number": "917", "count": 3 },
      { "number": "195", "count": 2 }
    ]
  },
  "trends": {
    "evenOddRatio": "60:40",
    "mostFrequentStartDigit": "1"
  }
}
```

---

### 7. Authentication API

#### 7.1 POST /api/auth/login

Login ด้วย email/password

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### 7.2 POST /api/auth/google

Login ด้วย Google OAuth

**Request Body:**

```json
{
  "idToken": "google-id-token..."
}
```

**Response (200):** เหมือน login ปกติ

#### 7.3 POST /api/auth/register

สมัครสมาชิก

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "John Doe"
}
```

---

## Data Shape ที่แต่ละหน้าต้องการ

### Homepage

```
ResultsTable ต้องการ:
  - ผลหวย THAI ล่าสุด: firstPrize, front3, back3, last2 + amounts
  - ผลหวย LAO ล่าสุด: digit4, digit3, digit2 + multipliers
  - วันที่ + drawNo ของแต่ละงวด

HeroSection ต้องการ:
  - รายชื่อ Lottery ที่รองรับ (static config, ไม่ต้องเป็น API)
  - วันออกรางวัลถัดไป (nextDrawDate)
```

### Thai Lotto Detail

```
ต้องการ:
  - latestDraw: firstPrize, front3[], back3[], last2, adjacent[],
    prize2[] (5 ตัว), prize3[] (10 ตัว), prize4[] (50 ตัว), prize5[] (100 ตัว)
    พร้อม amount ของแต่ละรางวัล
  - drawDate, drawNo, daysAgo
  - recentDraws: list ย้อนหลัง 5-10 งวด (date, drawNo, firstPrize, last2)
  - newsArticles: 5 บทความล่าสุด (sidebar)
```

### Lao Lotto Detail

```
ต้องการ:
  - latestDraw: digit4, digit3, digit2, digit1 + multipliers
  - drawDate, drawNo, daysAgo
  - recentResults: 4-6 งวดย้อนหลัง (date, digit4, digit3, digit2)
  - newsArticles: 5 บทความล่าสุด (sidebar)
```

### Global Draws

```
ต้องการ:
  - draws[]: time, country, name, numbers[], special, jackpot, status
  - filter: period, country
  - pagination: page, limit
```

### Country Page

```
ต้องการ:
  - countryInfo: name, lottoName, flag, nextDraw, jackpot, odds
  - draws[]: date, drawId, numbers[], topPrize
  - stats: odds, smallestJackpot, mostFrequentNumber
```

### News

```
ต้องการ:
  - articles[]: slug, title, excerpt, image, date, category, author
  - article detail: + content, source, related[]
  - รองรับ 2 ภาษา (th/en)
```

### Statistics

```
ต้องการ:
  - overview: totalJackpotsTracked, activeLotteries, upcomingDraws
  - frequency: number frequency data ตาม type + position
  - trends: evenOddRatio, mostFrequentStartDigit
```

---

## Error Response Format (มาตรฐาน)

ทุก API ใช้ format เดียวกันเมื่อเกิด error:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No lottery result found for the given date"
  }
}
```

| HTTP Status | Code | ใช้เมื่อ |
|---|---|---|
| 400 | BAD_REQUEST | parameter ไม่ครบหรือไม่ถูกต้อง |
| 401 | UNAUTHORIZED | ไม่ได้ login หรือ token หมดอายุ |
| 404 | NOT_FOUND | ไม่พบข้อมูลที่ร้องขอ |
| 429 | RATE_LIMITED | เรียก API บ่อยเกินไป |
| 500 | INTERNAL_ERROR | เกิดข้อผิดพลาดภายใน server |

---

## สรุป API ทั้งหมด

| # | Method | Endpoint | สถานะ | ใช้โดย |
|---|---|---|---|---|
| 1 | GET | /api/results/latest | ต้องสร้างใหม่ | Homepage ResultsTable |
| 2 | GET | /api/results/:type | ต้องสร้างใหม่ | Thai Lotto, Lao Lotto detail |
| 3 | GET | /api/results/global | ต้องสร้างใหม่ | Global Draws, Results page |
| 4 | GET | /api/check | มีอยู่แล้ว | ตรวจเลข (Thai/Lao) |
| 5 | POST | /api/subscribe | มีอยู่แล้ว | SubscribeButton |
| 6 | GET | /api/countries | ต้องสร้างใหม่ | Country page |
| 7 | GET | /api/countries/:code/draws | ต้องสร้างใหม่ | Country page |
| 8 | GET | /api/news | ต้องสร้างใหม่ | News list, sidebar |
| 9 | GET | /api/news/:slug | ต้องสร้างใหม่ | News detail |
| 10 | GET | /api/statistics/overview | ต้องสร้างใหม่ | Statistics page |
| 11 | GET | /api/statistics/frequency | ต้องสร้างใหม่ | Statistics page (future) |
| 12 | POST | /api/auth/login | ต้องสร้างใหม่ | Login page |
| 13 | POST | /api/auth/google | ต้องสร้างใหม่ | Login page (Google) |
| 14 | POST | /api/auth/register | ต้องสร้างใหม่ | Registration |

> **สรุป:** มี API ทั้งหมด 14 endpoints ปัจจุบันมีอยู่แล้ว 2 endpoints ต้องสร้างใหม่ 12 endpoints
