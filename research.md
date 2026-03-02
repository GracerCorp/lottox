# สรุปการวิเคราะห์ Codebase โครงการ LOTTOX

## 1. ภาพรวมของระบบ (System Overview)

LOTTOX เป็นแพลตฟอร์มบนเว็บแอปพลิเคชันสำหรับตรวจและแสดงผลสลากกินแบ่งรัฐบาล (หวยไทย) และหวยต่างประเทศ (เช่น หวยลาว และหวยเวียดนาม) โดยมีฟีเจอร์หลักคือการแสดงผลรางวัลล่าสุด, ตรวจหวย, อ่านข่าวสาร/บทความที่เกี่ยวข้อง, สถิติการออกรางวัล, และระบบสมาชิกพร้อมเกมมิฟิเคชัน (Gamification)

## 2. Tech Stack หลัก

- **Framework:** Next.js 16.1.6 (App Router)
- **UI Library:** React 19.2.3
- **Styling:** TailwindCSS v4 พร้อมกับ `clsx` และ `tailwind-merge` และ Framer Motion สำหรับ Animations
- **Database & ORM:** PostgreSQL ควบคู่กับ Prisma ORM (v6.19.2)
- **Language:** TypeScript
- **รูปแบบอื่นๆ:**
  - รองรับ i18n สองภาษา (TH/EN) ที่สร้างจัดการไว้ใน `src/lib/i18n.ts`
  - มี Middleware (`middleware.ts`) สำหรับทำ In-memory Rate Limiting สำหรับ API Routes

## 3. โครงสร้างโฟลเดอร์สำคัญ (Directory Structure)

- **`src/app/`**: ประกอบด้วยหน้าเว็บและ API Routes ทั้งหมด
  - `page.tsx`, `layout.tsx` (หน้า Home)
  - `[country]/`: Dynamic Route สำหรับแสดงผลตามประเทศ
  - `api/`: API Endpoints ต่างๆ เช่น `check`, `results`, `news`, `statistics`
  - หน้าอื่นๆ เช่น `news`, `dashboard`, `login`, `results`, `statistics`
- **`src/components/`**: การออกแบบและแบ่งกลุ่ม Components ไว้อย่างชัดเจน
  - `/home`: หน้า Home Components เช่น `HeroSection`, `ResultsTable`, `CountryListSection`
  - `/ui`: Reusable UI Components พื้นฐาน เช่น `LotteryCard`, `LotteryBall`, `SubscribeButton`, `ThemeToggle`
  - `/lottery`, `/country`, `/dashboard`, `/layout`
- **`src/lib/`**: ฟังก์ชันและคลาสที่ถูกใช้บ่อย
  - `api-client.ts` และ `api-types.ts`: คลาสและ Type definitions สำหรับการเชื่อมต่อ API ภายใน
  - `prisma.ts`: การตั้งค่าและสร้าง Prisma Client Instance
  - `services/lotteryService.ts`: Business logic สำหรับการจัดการข้อมูลหวย
  - `i18n.ts`: คำแปลภาษา (Dictionary) ภาษาไทยและอังกฤษ
- **`prisma/`**: เก็บไฟล์ `schema.prisma` ที่ประกอบด้วยโมเดลฐานข้อมูลกว่า 20 โมเดล
- **`docs/`**: โฟลเดอร์เก็บเอกสารประกอบโครงการ เช่น `api-specification.md`, `db-detail.md`, `system_flow.md`

## 4. โครงสร้างฐานข้อมูลเบื้องต้นเฉพาะที่ต้องใช้ในตอนนี้ (Database Schema Highlights only used tables)

- **`countries`:** ข้อมูลประเทศที่มีผลหวยในระบบ
- **`lotteries`**: ข้อมูลหวยในแต่ละประเทศ โดยประเทศนึงจะมีได้หลายหวย มีฟิลด์
  - showing_prize เพื่อกำหนดว่าในตาราง ResultTable หรือ Global Lottery Results จะนำรางวัลไหนบ้างมาแสดง
  - prize_amount_mode เพื่อตรวจสอบว่าหวยอันนี้จะแสดงรางวัลแบบไหน ระหว่าง fixed (แสดงยอดเงิดรางวัลโดยตรงจากผลรางวัลที่ให้มา) และ multiplier แสดงเป็นจำนวนเท่า โดยแต่ละรางวัลจะได้เงินกี่เท่าจะมีข้อมูลอยู่ใน default_prize_amount สามารถแสดงข้อมูลจากฟิลด์นั้นได้เลย
- **`result_verifications`**: ข้อมูลผลการออกรางวัล โดยมีฟิลด์ `chosen_data ` เก็บผลรางวัลที่ตรวจสอบความถูกต้องแล้ว (ใช้ข้อมูลนี้เท่านั้นในหน้าเว็บ)
- **`articles`**: ระบบข่าวสารและบทความ เนื้อหาบทความเป็น html content สามารถ render ได้เลย
- **`banners`**: ข้อมูลสำหรับ Hero banners ในหน้าแรก

## 5. จุดเด่นและข้อสังเกตเพิ่มเติม (Key Aspects & Observations)

- **API Client:** มีการสร้างคลาส `ApiClient` (ใน `api-client.ts`) เพื่อครอบคลุม Endpoints หลักอย่างเป็นระเบียบ เช่น `getLatestResults`, `checkNumber`, `getNewsDetail`
- **Data Standardization:** ข้อมูลผลหวยแต่ละประเภท (ไทย, ลาว, เวียดนาม) มี Schema ที่แตกต่างกัน (เช่น `ThaiResultData`, `LaoResultData`, `VietnamResultData`) มีการทำ Data Formatting กลางใน API Client เพื่อให้ UI แสดงผลง่ายขึ้น
- **Rate Limit:** ระบบป้องกันการเจาะระบบรัว API ถูกนำไปใช้ใน Middleware ด้วย In-memory Map (ระบุไว้ว่าใน Production ควรเปลี่ยนเป็น Redis แทน)
- **Dark Mode:** รองรับ Dark Mode และ Light Mode อย่างสมบูรณ์ผ่าน `next-themes` โดยให้ออกแบบ Light Mode ให้เหมาะสม ไม่ด่อยไปกว่า Dark Mode

---

สรุป: โปรเจคเขียนด้วย Clean Architecture เบื้องต้นในระดับ Next.js คือแบ่งส่วน UI (Components) ส่วน Data Fetching/Business Logic (Lib & Services) และ Routing ออกจากกันอย่างชัดเจน รหัสถูกเขียนด้วยสไตล์ Modern TypeScript กึ่ง OOP (มีการใช้คลาส ApiClient) และ Functional ผสมกัน
