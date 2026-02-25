# Fix Data Fetching to Match Updated Database Schema

Database schema ถูกอัพเดทแล้ว (table `lottery_jobs` เดิมถูก refactor เป็น `lotteries` + `lottery_jobs` แยกกัน) แต่ code ยังอ้างอิง schema เก่า ทำให้ข้อมูลดึงมาแสดงผิดพลาด

## Current Database Structure

| Table | Data |
|---|---|
| `countries` | `th` (Thailand), `la` (Laos) - lowercase codes |
| `lotteries` | GLO (country_id=1), Lao Development (country_id=2) |
| `lottery_jobs` | Sanook Thai (lottery_id=1), Sanook Lao (lottery_id=5) |
| `lottery_results` | lottery_id -> `lotteries.id`, relation field ชื่อ `lottery_jobs` |

## Proposed Changes

### Data Layer

#### [MODIFY] [lotteryService.ts](file:///Users/apinan/Developments/lotto-x/src/lib/services/lotteryService.ts)

- เปลี่ยน `SUPPORTED_COUNTRY_CODES` จาก uppercase เป็น **lowercase** (`"th"`, `"la"`, `"vn"`) ให้ตรงกับ DB
- or ใช้ case-insensitive query (mode: 'insensitive') -- แต่ lowercase ตรงกว่า

---

#### [MODIFY] [api-client.ts](file:///Users/apinan/Developments/lotto-x/src/lib/api-client.ts)

**[getLatestResults(type?)](file:///Users/apinan/Developments/lotto-x/src/lib/api-client.ts#8-50)** (line 9-49):
- ปัจจุบัน: filter by `lottery_jobs.name` (ซึ่งตอนนี้คือ `lotteries.name` เช่น "Government Lottery Office (GLO)")
- แก้ไข: filter ผ่าน `lottery_jobs.countries.code` แทน เช่น type `thai` -> country code `th`
- ใน formatResult: ดึง type จาก `lotteries.countries.code` แทน `lottery_jobs.name`

**[getResultsByType(type)](file:///Users/apinan/Developments/lotto-x/src/lib/api-client.ts#51-98)** (line 51-97):
- เปลี่ยนจาก filter ด้วย `lottery_jobs.name` เป็น `lottery_jobs.countries.code` 
- สร้าง mapping: `thai` -> `th`, `lao/laos` -> `la`, เป็นต้น
- include `lottery_jobs.countries` เพื่อดึง country code

**[getGlobalResults](file:///Users/apinan/Developments/lotto-x/src/lib/api-client.ts#99-151)** (line 99-150):
- relation `lottery_jobs.countries` ยังถูกต้อง (lottery_results -> lotteries -> countries)

**[checkNumber](file:///Users/apinan/Developments/lotto-x/src/lib/api-client.ts#152-213)** (line 153-212):
- เปลี่ยน filter เหมือน [getResultsByType](file:///Users/apinan/Developments/lotto-x/src/lib/api-client.ts#51-98)

**[getCountryDraws](file:///Users/apinan/Developments/lotto-x/src/lib/api-client.ts#228-260)** (line 228-259):
- แก้ไขแล้วใน commit ก่อน

---

### Pages

#### [MODIFY] [[country] page.tsx](file:///Users/apinan/Developments/lotto-x/src/app/%5Bcountry%5D/page.tsx)
- ลบการอ้างอิง `lotto.slug`, `lotto.type`, `lotto.next_draw`, `lotto.jackpot` ที่ไม่มีอยู่ใน model
- generate slug จาก lotteries name (e.g. slugify)
- กำหนด defaults สำหรับ type, next_draw, jackpot

---

## Verification Plan

### Browser Verification
1. เปิด http://localhost:3000 - ตรวจสอบ homepage แสดง country tabs (TH, LA) และ results table มีข้อมูล
2. เปิด http://localhost:3000/results/thai-lotto - ตรวจสอบผลหวยไทยงวดล่าสุดแสดงถูกต้อง
3. เปิด http://localhost:3000/results/lao-lotto - ตรวจสอบผลหวยลาวแสดงถูกต้อง
4. เปิด http://localhost:3000/thailand - ตรวจสอบหน้า country แสดงรายการ lotteries
5. ตรวจสอบ API `/api/results/latest` ว่า return ข้อมูลถูกต้อง
