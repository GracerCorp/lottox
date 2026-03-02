# แผนการแก้ไขและปรับปรุงโค้ด (Implementation Plan)

อ้างอิงจากปัญหาที่พบหลังจากรันคำสั่ง `bun run lint` และ `bun run build` รวมถึงข้อมูลโครงสร้างระบบที่อัปเดตใหม่ใน `research.md` นี่คือแผนการแก้ไขระบบโดยยังไม่แก้ไขโค้ดจริงในตอนนี้

## 1. แก้ไขข้อผิดพลาดจากการ Build และการดึงข้อมูลผลรางวัล (Database/API Integration)

**ไฟล์ที่ต้องปรับปรุง:** `src/app/api/results/[type]/[date]/route.ts` แและ API ที่เกี่ยวข้องกับผลหวย (เช่น `api-client.ts` และโฟลเดอร์ใน `src/app/api/results/`)

- **ปัญหาเดิม:** มีการเรียกใช้ Property `draw_date`, `draw_period`, และ `full_data` ผิดประเภทจากการ Build Error
- **ปัญหาเชิงโครงสร้าง (Critical):** โค้ดเดิมดึงข้อมูลผลรางวัลจาก `lottery_results.full_data` ซึ่งไม่ถูกต้องตาม Business Logic ใหม่
- **วิธีแก้ไข:**
  - เปลี่ยนแปลง Logic การดึงผลหวยทั้งหมด **ต้องดึงข้อมูลผ่าน `result_verifications.chosen_data`** เท่านั้น (ซึ่งเป็นผลที่ผ่านการตรวจสอบความถูกต้องแล้ว)
  - ปรับการ Mapping Type ในคลาส ApiClient ให้ดึงจาก `chosen_data` และแก้ไข Error การเรียกใช้ `drawDate`, `drawNo`, และ `data` ให้ตรงตาม Interface

## 2. การจัดการรางวัลที่แสดงผลผ่าน `showing_prize`

**ไฟล์ที่ต้องปรับปรุง:** `src/components/ui/ResultsTable.tsx`, หน้า Global Draws (`src/app/global-draws/page.tsx`) และหน้าอื่นๆ ที่มีการโชว์ตารางผลหวย

- **ปัญหา:** รางวัลที่นำมาแสดงผลควรจำกัดเฉพาะรางวัลที่ถูกกำหนดไว้ในฟิลด์ `showing_prize` ของตาราง `lotteries`
- **วิธีแก้ไข:**
  - ในฟังก์ชันที่ดึงตัวหวย (Lotteries) ต้องดึงข้อมูล `showing_prize` นำมาเป็นฟิลเตอร์ (Filter)
  - ใน UI Components ต้องนำฟิลเตอร์นี้มากรองผลรางวัลที่จะ Render ออกมาให้ตรงกัน เพื่อไม่ให้แสดงผลรางวัลขยะหรือไม่เกี่ยวข้อง

## 3. แก้ไขข้อผิดพลาดจาก Linter (ESLint)

**ไฟล์ที่พบปัญหา:** `src/components/ui/ResultsTable.tsx`

- **ปัญหา:** ตัวแปร `countryId`, `lottoHref`, และ `flagCode` ประกาศด้วย `let` แต่ไม่มีการเปลี่ยนแปลงค่า
- **วิธีแก้ไข:** เปลี่ยนจาก `let` เป็น `const` เพื่อแก้ไข Error `prefer-const`

## 4. จัดการ Hero Banners ในหน้าแรก

**ไฟล์ที่เกี่ยวข้อง:** `src/app/page.tsx` หรือ `src/components/home/HeroSection.tsx`

- **ปัญหา:** ข้อมูล Hero banner ปัจจุบันอาจถูก Hardcode หรือไม่ได้ดึงมาจากฐานข้อมูล
- **วิธีแก้ไข:** เขียน Query ไปดึงข้อมูลแบนเนอร์จากตาราง `banners` แทน เพื่อให้ผู้ดูแลระบบสามารถปรับเปลี่ยนแบนเนอร์ในหน้าแรกได้อย่างอิสระและเป็น Dynamic

## 5. การปรับปรุง UI ให้รองรับ Light Mode ขนานกับ Dark Mode (UI Design)

- **ปัญหา:** ระบบรองรับ `next-themes` แต่อาจมีดีไซน์ที่เน้น Dark Mode เป็นหลัก ทำให้ Light Mode ดูดรอปหรือยังไม่สวยงาม
- **วิธีแก้ไข:**
  - ตรวจสอบคลาส CSS (Tailwind classes) บน Components หลักๆ (เช่นตารางผลหวย, การ์ดแสดงผล, Nav Bar)
  - ปรับปรุงและออกแบบ Light Mode ให้สวยงาม อ่านง่าย และมีมิติ (Depth/Shadow) ขนานคู่ไปกับความสวยงามของ Dark Mode อย่างพิถีพิถันและไม่ด้อยกว่าอย่างที่ตั้งเป้าหมายไว้

## 6. แก้ไขข้อความเตือนของ Next.js (Deprecation Warning)

**ไฟล์ที่พบปัญหา:** `src/middleware.ts`

- **ปัญหา:** มีการแจ้งเตือน `The "middleware" file convention is deprecated. Please use "proxy" instead.` ในระหว่าง Build
- **วิธีแก้ไข:** ศึกษา Migration Guide ของ Next.js 16.1.6 และปรับเปลี่ยนจาก `middleware` ให้รองรับรูปแบบการเข้าจังหวะ Request ควบคุม Route แทน (อาจเปลี่ยนเป็น `proxy.ts` หรือวิธีที่แนะนำอย่างถูกต้อง)

## 7. จัดระเบียบโค้ดตาม Clean Architecture และ Mockup Data

- **ย้าย Business Logic:** เลื่อนการจัดการตรรกะซับซ้อน (เช่น การทำ Data Aggregation หรือการเลือก Provider) ไปอยู่ใน `src/lib/services/`
- **Mockup Data:**
  - สร้างโมเดล/โครงสร้างสำหรับ Mockup Data ภายในโฟลเดอร์ทดสอบหรือจัดเก็บไว้แยกต่างหาก (`src/data/mockups`) สำหรับนำมาใช้ในระหว่างพัฒนาหรือในช่วงที่ตารางยังไม่อัปเดตข้อมูลเต็มใบ เพื่อให้แน่ใจว่าหน้าเว็บจะไม่พังเมื่อไม่มีข้อมูลจาก DB

## 8. แก้ไขการแสดงชื่อรางวัลแบบแยกภาษา

* ปัญหา: ใน chosen_data จะมีขื่อรางวัลใน prizeName มาให้แต่จะใช้จริงไม่ได้ เพราะแต่ละภาษาจะเรียกไม่เหมือนกัน
* วิธีแก้ไข: ให้ใช้ category แทน prizeName เพื่อเป็นการกำหนด key ใน i18n ในการกำหนดคำแปลของรางวัลในแต่ละภาษา

> **หมายเหตุ:**
>
> 1. ไม่ใช้ Emoji icon ใน UI โครงการ
> 2. พัฒนาโค้ดเรียบร้อย ต้องมีการรัน Linter/Build ให้ผ่าน และ Commit ทันทีเมื่อแล้วเสร็จ
