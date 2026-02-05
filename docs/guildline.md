# LOTTOX Project Guidelines (SRS)

## Project Name: LOTTOX - Global Lottery Results Platform

### 1. Introduction (บทนำ)

#### 1.1 Purpose (วัตถุประสงค์)
To create a platform that aggregates lottery results from over 50 countries worldwide (Global Lottery Results Platform). The focus is on accuracy, precision, and a modern user experience (Modern & Sexy UI) to serve as a reference for international lottery statistics and results.

#### 1.2 Scope (ขอบเขต)
LOTTOX functions solely as an **Information Hub**.
- **No gambling or lottery sales of any kind.**
- The system covers automated data scraping, validation, and presentation of data via a web interface customized for each country.

### 2. Overall Description (คำอธิบายภาพรวม)

#### 2.1 Product Perspective (มุมมองผลิตภัณฑ์)
The system is divided into 2 main parts:
1.  **Frontend**: User interface separating experiences between Global Hub, Latest results, Lottery News, and Country Specific pages.
2.  **Backend & Data Engine**: Scraper system, Timezone Management, and Statistics Engine.

#### 2.2 User Classes and Characteristics (กลุ่มผู้ใช้งาน)
-   **General Users**: Check results and view trending number statistics.
-   **Data Enthusiasts**: Analyze historical statistics and compare prizes across countries.
-   **Admin/Editor**: Manage the system and manually review data accuracy.

### 3. Tech Stack (เทคโนโลยีที่ใช้)
Decoupled Architecture.

#### 3.1 LottoX CMS (Backend Management)
-   **Frontend/App Framework**: Next.js (Efficiency & SEO)
-   **Database**: PostgreSQL (Complex result & stats storage)
-   **AI/Data Processing**: Gemini API (Data processing, validation, analytical content generation)
-   **Styling**: Tailwind CSS (Fast & meaningful UI)
-   **Email Service**: Postmark SMTP (Notifications & User management)

#### 3.2 LottoX Platform (Frontend User Interface)
-   **Frontend/App Framework**: Next.js
-   **Styling**: Tailwind CSS

#### 3.3 Infrastructure
-   **Deployment**: Container-based (e.g., Docker) for Scalability and Portability.

### 4. System Main Features (ฟีเจอร์หลักของระบบ)

#### 4.1 Global Homepage (Visual & Impact)
-   **Hero Section**: Interactive Cards for major lotteries (Powerball, Mega Millions, Thai Lotto) with modern motion effects.
-   **Live Ticker**: Real-time strip showing recently announced results.
-   **Country Selector**: Visually appealing selection via flags or world map.

#### 4.2 Country Specific Page (Utility & Trust)
-   **Verify Ticket Tool**: Check current and historical results by entering numbers.
-   **Latest Draw Display**: Clearly show winning numbers, bonus numbers, and Jackpot value.
-   **Historical Archive**: Filterable table of past results (by date/draw).
-   **Next Draw Countdown**: Countdown to the next draw based on local timezone.

#### 4.3 Data & Statistics Engine
-   **Hot/Cold Numbers**: Most/Least frequent numbers over 6 months - 1 year.
-   **Jackpot Tracking**: Graph showing jackpot growth (accumulated prize).

### 5. System Pages List (โครงสร้างหน้าเว็บไซต์)

#### 5.1 Tier 1: Core Pages
-   **Home Page (Global Hub)**: Global updates and gateway to countries.
-   **Global Dashboard**: List View summary of results from all countries for comparison.

#### 5.2 Tier 2: Country & Lotto Pages
-   **Country Home Page (e.g., /thailand)**: Summary of all lotteries in that country.
-   **Lotto Detail Page (e.g., /thailand/thai-lotto)**: Latest results, verify tool, and specific stats.
-   **Historical Archive Page**: Historical results (Yearly/Monthly).

#### 5.3 Tier 3: Engagement & Support
-   **Statistics & Analytics Hub**: Deep dive into Hot/Cold Numbers & Jackpot trends.
-   **News & Knowledge Base**: "How to Play", Global lottery news, SEO-friendly guides.
-   **API Access Page**: For developers/partners.

#### 5.4 Tier 4: Legal & Information (Footer)
-   **About Us**: LOTTOX background.
-   **Terms of Service & Privacy Policy**: Usage terms and privacy.
-   **Disclaimer**: Detailed legal responsibility boundaries.
-   **Contact Us**: Inquiry form/Error reporting.

### 6. External Interface Requirements (การเชื่อมต่อภายนอก)

#### 6.1 User Interface (UI Design)
-   **Design System**: Dark Theme (Deep Navy/Charcoal) with Brand Accent Colors (Gold/Neon).
-   **Responsiveness**: Perfect display on Mobile and Tablet.

#### 6.2 Data API
-   Connect to Official Lottery APIs or use Custom Scrapers for non-API sources.

### 7. Non-functional Requirements (ข้อกำหนดด้านประสิทธิภาพ)

#### 7.1 SEO Optimization (Critical)
-   **Dynamic Meta Tags**: Automated update of Meta Descriptions with latest numbers for Country Pages.
-   **Schema Markup**: JSON-LD for Lottery results (Rich Snippets).

#### 7.2 Performance & Scalability
-   **Caching Strategy**: Cache results to reduce DB load during high traffic (draw times).
-   **Uptime**: High stability required during major draw announcements.

### 8. Disclaimer & Legal (ข้อกำหนดทางกฎหมาย)
**Must display clearly on every page:**
-   LOTTOX is an information platform, **NOT** a gambling site.
-   Data sourced from public domains; 100% accuracy not guaranteed.
-   Users should verify with official sources.

### 9. CMS System Capabilities
-   **AI-Powered Data Extraction**: Use Google AI to parse web pages and summarize lottery data automatically.
-   **Multi-Country Support**: Designed to handle formats for Thailand, Laos, UK, USA, Japan, etc.
-   **Flexible Scheduling**:
    -   Simple: Preset buttons (e.g., Thai Lotto days: 1st, 16th).
    -   Advanced: Custom cron-like scheduling for specific needs.
-   **Modern Dashboard**: User-friendly, clean, responsive.
-   **Stability & Security**: Cloud-based storage, high availability.
-   **Automated Background Jobs**: 24/7 autonomous operation.

---

## Terms of Service (Service Agreement)

### Scope & Disclaimer
**Platform Status**:
LOTTOX is a platform for aggregating and presenting global lottery results as an **Information Hub** only. It is **NOT** involved in gambling, lottery sales, or any betting activities.

**Data Source & Accuracy**:
Results are referenced from public and official sources. While we strive for accuracy, LOTTOX **does not guarantee 100% correctness**.

**User Responsibility**:
Users should always use discretion and **verify results with official sources** before making any decisions. LOTTOX is not liable for any damages or losses resulting from the use or interpretation of data on this platform.
