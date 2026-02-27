# แผนการแสดงผลหวยจากข้อมูลที่ผ่านการตรวจสอบ (result_verifications)

นำข้อมูล `chosen_data` จากตาราง `result_verifications` ที่มี `status = 'verified'` มาแสดงผลที่หน้าเว็บ แทนการใช้ `full_data` จาก `lottery_results` โดยตรง

## Proposed Changes

### Backend API (`src/lib/api-client.ts`)

ปรับแต่ง Prisma Query ในฟังก์ชันที่เกี่ยวข้องกับการดึงข้อมูลผลรางวัล เพื่อ Filter เอาเฉพาะรายการที่มี `result_verifications` เป็น `verified` และดึง `chosen_data` มาใช้เป็น `data` หลัก

#### [MODIFY] `src/lib/api-client.ts`
1. **ในฟังก์ชัน `getLatestResults(type?: string)`:**
   - เพิ่ม `where` clause ให้กรองเฉพาะ `lottery_results` ที่มี `result_verifications` ที่ `status = 'verified'` (`some: { status: 'verified' }`)
   - เพิ่มการ `include` ความสัมพันธ์ `result_verifications_result_verifications_lottery_result_idTolottery_results` เพื่อเอา `chosen_data`
   - ในฟังก์ชัน `formatResult` ให้เช็คว่าถ้ามี `chosen_data` ให้ใช้ค่านี้ ถ้าไม่มีค่อย fallback ไปใช้ `full_data`
2. **ในฟังก์ชัน `getResultsByType(type: string, limit: number = 10, offset: number = 0)`:**
   - ทำการกรองและ include `result_verifications` เช่นเดียวกับ `getLatestResults`
3. **ในฟังก์ชัน `getGlobalResults(params)`:**
   - ทำการกรองและ include `result_verifications` เช่นเดียวกัน
4. **แก้ไขการดึงข้อมูลล่าสุดแยกตามประเทศใน `getCountryDraws`:**
   - ปรับเงื่อนไขการ query ใน loop หรือ nested query ให้ดึง `result_verifications` มาด้วย

## Verification Plan

### Manual Verification
1. รัน `npm run dev` เพื่อรันแอปพลิเคชัน
2. เปิดดูหน้า Home (`/`) สังเกตผลหวยที่แสดง จะต้องเห็นเฉพาะงวดที่มีการ Verify แล้วเท่านั้น
3. เปิดดูหน้าประเทศ (`/th`, `/la`) หรือแท็บดูหวยตามแต่ละประเทศ สังเกตข้อมูลรางวัล ยืนยันว่าโหลดมาจาก `chosen_data` ได้ถูกต้อง
4. หน้าแสดงผลลัพธ์ย้อนหลัง หรือผลรวมจะต้องไม่แสดงงวดใดๆ ที่เข้าข่ายว่ายังไม่ถูก Verified
