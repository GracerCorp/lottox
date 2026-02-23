# Dynamic Database UI Implementation

## Goal Description
ปัจจุบันส่วนแสดงผล (UI) บางจุด เช่น แถบเลือกประเทศในหน้าโฮมเพจ (`src/app/page.tsx`) และหน้าโครงสร้างตามประเทศ (`src/app/[country]/page.tsx`) มีการ Hardcode ข้อมูลเอาไว้ (เช่น `COUNTRY_DATA`) 
เป้าหมายของงานนี้คือการลบข้อมูลสมมติที่ Hardcode ออกทั้งหมด และเปลี่ยนให้ UI เหล่านั้นดึงข้อมูลของ `countries` และ `lottery_jobs` จากฐานข้อมูลแทน เพื่อให้แอปพลิเคชันทำงานได้แบบ Dynamic สมบูรณ์และพร้อม Scale

## User Review Required
> [!IMPORTANT]
> - แจ็คพอตและวันออกรางวัลถัดไป (Next Draw) ยังไม่มีฟิลด์เฉพาะในตาราง `lottery_jobs` หรือกำหนดใน Schema ชัดเจน ผมจะสร้าง Helper ฟังก์ชันง่ายๆ ที่จำลอง/คำนวณวันถัดไปจาก `cron_schedule` ไปก่อน

## Proposed Changes

### Database Service
- สร้างไฟล์ `src/lib/services/lotteryService.ts` เพื่อจัดการลอจิกของการ Query ข้อมูลจาก Database สำหรับฝั่งของ Component/UI ตรงๆ แทนที่จะสร้าง API Route เพิ่มโดยไม่จำเป็น (เนื่องจาก Next.js Server Components โหลด Prisma ได้โดยตรง)
  
#### [NEW] lotteryService.ts
- `getActiveCountries()`: ดึงเฉพาะประเทศที่มีหวยทำงานอยู่ (`status === 'active'`) 
- `getLotteriesByCountry(countryCode)`: ดึงข้อมูล `lottery_jobs` เฉพาะตัวที่อยู่ในประเทศนั้นๆ

---
### Home Page (`page.tsx`)
- จะปรับการเรียกใช้งาน Client Component `ResultsTable` เพื่อให้ `page.tsx` สามารถดึงข้อมูล `tabs` จาก `lotteryService.getActiveCountries()` ในฝั่ง Server ก่อน แล้วถึงส่งตัวแปรไปยังหน้าจอ

#### [MODIFY] page.tsx
- คิวรีและดึงรายการ `tabs` ออกมาจาก Database ของตาราง `countries` 

---
### Country Landing Page (`[country]/page.tsx`)
- หน้านี้ปัจจุบันมีตัวแปร `COUNTRY_DATA` จำลองลิสต์หวยของประเทศนั้นๆ เราจะลบมันทิ้ง
- อาศัย Server Action หรือ `lotteryService.getLotteriesByCountry()` เพื่อส่ง `lotteries` ที่มีอยู่จริงไป Render ใส่การ์ด `Lottery Config` ทันที

#### [MODIFY] [country]/page.tsx
- ลบ `const COUNTRY_DATA = ...` ทิ้งทั้งหมด
- เรียก `const countryInfo = await prisma.countries.findUnique({ where: { code: params.country } })`
- วนลูปการ์ดสร้างผลลัพธ์จากรหัสหวยที่มีใช้งานอยู่

## Verification Plan
### Automated Tests
- รันคำสั่ง `bun run build` หลังจากแก้ไขเสร็จ เพื่อรับประกันว่าจะไม่มี TypeScript Error ค้างอยู่
- รัน `bun dev` และทดสอบ Load หน้าเว็บเพื่อดูว่าแท็บและรายการหวยโหลดผ่าน Database ได้สำเร็จ
