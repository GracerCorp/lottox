# การอัปเดตระบบดึงข้อมูลผลรางวัล (Verified Lottery Results)

## วัตถุประสงค์
ปรับปรุง API ที่ใช้สำหรับดึงข้อมูลผลรางวัลในระบบ เพื่อให้มั่นใจว่าผลรางวัลที่แสดงผลใน UI เป็นผลรางวัลที่ผ่านการตรวจสอบจากระบบ (Approve) เรียบร้อยแล้วเท่านั้น ลดข้อผิดพลาดของข้อมูลที่ไม่ถูกต้องก่อนนำมาแสดงผล

## สรุปการเปลี่ยนแปลงโค้ด

### 1. ไฟล์ `src/lib/api-client.ts`
ปรับปรุงระบบการ queries ฐานข้อมูลผ่าน Prisma เพื่อรองรับ flow ใหม่:
- **`getLatestResults`**
  - เพิ่มเงื่อนไข `where` ให้ `lottery_results` ต้องมี `result_verifications` ที่มีสถานะเป็น `verified`
  - ทำการ join ข้อมูล (include) `result_verifications` ชิ้นล่าสุดที่สถานะ `verified` เพื่อมาสกัดเอา `chosen_data`
  - ปรับปรุง `formatResult` mapping โดยนำค่า `chosen_data` ไปทับ `full_data` เดิม หากมีข้อมูล

- **`getResultsByType`**
  - เพิ่มเงื่อนไขและ logic การ mapping แบบเดียวกันกับ `getLatestResults` เพื่อให้หน้ารายประเทศแสดงเฉพาะข้อมูลที่ผ่านการตรวจสอบแล้ว

- **`getGlobalResults`**
  - เดิมจะมีการดึงข้อมูลผลรางวัลงวดล่าสุดของทุกๆ ประเทศ
  - ปรับปรุง `where` condition ให้สอดคล้องกัน และในส่วนของการ mapping ข้อมูล ได้เพิ่มกระบวนการแปลง `chosen_data` ให้เป็นก้อน `full_data` และลบ properties ของ properties `result_verifications` ย่อยทิ้ง เพื่อไม่ให้ Payload ของ API ใหญ่เกินไป

- **`getCountryDraws`**
  - เช่นเดียวกับ `getGlobalResults` ทำการดึงข้อมูลประวัติย้อนหลังของผลรางวัลแต่ละประเทศ
  - ได้เพิ่ม filter `status = "verified"` เพื่อให้แน่ใจว่าประวัติแสดงผลถูกต้อง พร้อมกันนี้ได้ทำการ map นำ `chosen_data` แทนค่า `full_data` และตัดข้อมูล relation ทิ้งเพื่อลดขนาด response

- **`checkNumber`**
  - ไม่มีการตรวจสอบ `lottery_prizes` อีกต่อไปเนื่องจาก table schema ไม่ตรงกับปัจจุบัน
  - ส่งค่า `isWin: false` กลับไปแทนที่ชั่วคราว รอให้ฟังก์ชันตรวจรางวัลถูกออกแบบใหม่ในการอัปเดตเวอร์ชันถัดไป

- ลบการประกาศ `lang` parameter ที่บรรทัด `getNewsDetail` ออก (lint warning)

### 2. ไฟล์ `src/components/ui/ResultsTable.tsx`
- แปลงประเภทของตัวแปร `id` ที่ส่งให้ Component ลูก (ใน `mapApiResultToRow`) เป็น `String(result.id)` เพื่อแก้ปัญหา Type Mismatch (Number vs String)
- ลบ code types `ThaiResultData`, `LaoResultData`, `VietnamResultData` และตัวแปรที่ไม่ได้ใช้ออกไปเพื่อรักษาให้โค้ดคลีน (Lint Warnings)

## การทดสอบ (Verification)
1. ตรวจสอบ Lint โดยใช้คำสั่ง `npm run lint` ครบถ้วน ไม่มี warning หรือ error เพิ่มเติมในส่วนที่แก้ไข
2. ตรวจสอบ Type ด้วย `tsc --noEmit` ไม่เจอ TypeScript Error แม้แต่จุดเดียว
3. Build ทดสอบ (`npm run build`) ไม่มี Errors ยืนยันว่าโค้ดสามารถ Deploy ได้อย่างสมบูรณ์

## แผนงานในอนาคตที่เกี่ยวข้อง
- **ระบบ CheckNumber:** ควรออกแบบและเชื่อมต่อระบบการนำตัวเลขเข้าไปเปรียบเทียบใน `full_data`/`chosen_data` โครงสร้าง JSON ของแต่ละประเทศต่อไป
