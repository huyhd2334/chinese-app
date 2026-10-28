# KẾ HOẠCH TOÀN DIỆN TỐI ƯU HÓA HỆ THỐNG ĐỂ THƯƠNG MẠI HÓA (PRODUCTION-READY SAAS)
**Dự án:** HSK Learning Platform (Chinese App)  
**Tài liệu:** Bản thiết kế kiến trúc, tính năng, bảo mật, thanh toán tự động, chống nghẽn & vận hành  
**Phiên bản:** 1.0 - Production Architecture Blueprint  

---

## MỤC LỤC
1. [Đánh Giá Hiện Trạng & Các Điểm Nghẽn Cần Khắc Phục](#1-đánh-giá-hiện-trạng--các-điểm-nghẽn-cần-khắc-phục)
2. [Chiến Lược Gói Cước & Ma Trận Tính Năng (Free vs Pro)](#2-chiến-lược-gói-cước--ma-trận-tính-năng-free-vs-pro)
3. [Kiến Trúc Thanh Toán Tự Động Hóa 100% (Instant Activation)](#3-kiến-trúc-thanh-toán-tự-động-hóa-100-instant-activation)
4. [Kiến Trúc Kỹ Thuật, Hàng Đợi (Queue) & Chống Nghẽn Tải](#4-kiến-trúc-kỹ-thuật-hàng-đợi-queue--chống-nghẽn-tải)
5. [Chiến Lược Bảo Mật Đa Tầng, Chống DDoS & Gian Lận](#5-chiến-lược-bảo-mật-đa-tầng-chống-ddos--gian-lận)
6. [Tối Ưu Hóa Trải Nghiệm Người Dùng (UX/UI & Multi-device Sync)](#6-tối-ưu-hóa-trải-nghiệm-người-dùng-uxui--multi-device-sync)
7. [Hạ Tầng, Vận Hành, Giám Sát & Pháp Lý Bán Hàng](#7-hạ-tầng-vận-hành-giám-sát--pháp-lý-bán-hàng)
8. [Lộ Trình Triển Khai (Sprint Roadmap 4 Tuần)](#8-lộ-trình-triển-khai-sprint-roadmap-4-tuần)

---

## 1. ĐÁNH GIÁ HIỆN TRẠNG & CÁC ĐIỂM NGHẼN CẦN KHẮC PHỤC

### 1.1. Hiện trạng tài nguyên & công nghệ
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, Recharts.
- **Client Database:** Dexie.js (IndexedDB) lưu trữ toàn bộ từ vựng HSK, lịch sử SRS, bài đọc Reading, bài nghe Listening.
- **Backend / Database:** Supabase (PostgreSQL + RLS + GoTrue Auth). Đã có các bảng `user_subscriptions`, `activation_codes`, `payment_requests`, `bonus_collections`, `bonus_cards`.
- **Thư viện chuyên dụng:** Hanzi Writer (vẽ chữ Hán), Tesseract.js & PDF.js (OCR trích xuất tài liệu), Youdao / Google TTS API proxy.

### 1.2. Các điểm nghẽn & rủi ro chí mạng khi bán Production
| Thành phần | Hiện trạng thực tế | Rủi ro khi có người dùng trả phí | Giải pháp bắt buộc ở bản Pro |
| :--- | :--- | :--- | :--- |
| **Dữ liệu ôn tập (SRS)** | Lưu cục bộ trên trình duyệt (IndexedDB của máy đó). | Người dùng đổi máy tính/điện thoại là **mất sạch dữ liệu ôn tập**. Giới hạn 500 từ chỉ check ở LocalStorage, hacker dễ dàng bypass. | Cơ chế Hybrid Sync: Học offline mượt mà bằng IndexedDB, tự động đồng bộ 2 chiều lên Supabase Cloud cho tài khoản Pro. |
| **Âm thanh (TTS API)** | Gọi trực tiếp Youdao & Google Translate TTS qua `/api/tts` mỗi lần người dùng bấm nghe. | Bị Google/Youdao **chặn IP máy chủ (HTTP 429/403)** khi lượng truy cập tăng; Next.js serverless function bị nghẽn làm chậm toàn site. | Pre-generate 100% âm thanh HSK chuẩn lưu trên Cloudflare R2 / S3. Với từ vựng custom: Dùng Redis Cache-first + Edge CDN. |
| **Thanh toán** | Bắn QR tĩnh, user chuyển khoản rồi hệ thống lưu `pending`, chờ Admin kiểm tra tài khoản thủ công. | Tỉ lệ bỏ đơn (drop rate) > 60% do phải chờ duyệt tay. Mất khách ban đêm hoặc ngày lễ. Dễ bị làm giả ảnh biên lai. | Tự động hóa 100% qua Webhook VietQR (PayOS / SePay / Casso). Kích hoạt Pro trong 3 giây kèm WebSocket Realtime notification. |
| **Tác vụ nặng (OCR / PDF)** | Tesseract.js chạy đơn luồng trên browser của user. | Máy người dùng cấu hình yếu hoặc điện thoại sẽ bị đơ/lag trình duyệt khi quét tài liệu nhiều trang. | Đưa vào Web Worker chạy nền ở client, hoặc xử lý bằng Cloud Worker Queue (BullMQ / QStash) cho file lớn. |
| **Bảo mật & Rate-limit** | Rate limit hiện tại chỉ dùng `sessionStorage` ở Client. | Kẻ xấu có thể mở Postman/Script bắn sập API `/api/tts` hoặc brute-force mã kích hoạt `activation_codes`. | Chuyển Rate Limit lên tầng Server/Edge bằng Upstash Redis Token Bucket + Cloudflare WAF. |

---

## 2. CHIẾN LƯỢC GÓI CƯỚC & MA TRẬN TÍNH NĂNG (FREE VS PRO)

Để bán được gói phần mềm, sản phẩm cần có mô hình định giá hấp dẫn, tạo ra sự cách biệt rõ ràng về giá trị giữa bản Miễn Phí (dùng thử / giữ chân) và bản Trả Phí (Pro).

### 2.1. Ma trận tính năng (Feature Gate Matrix)

```
+---------------------------------------------------------------------------------------+
| TÍNH NĂNG                             | FREE TIER             | PRO TIER              |
+---------------------------------------+-----------------------+-----------------------+
| Giáo trình HSK Chuẩn 1 - 2            | Đầy đủ 100%           | Đầy đủ 100%           |
| Giáo trình HSK Chuẩn 3 - 6 + HSK 3.0  | Mở thử 2 bài đầu      | Mở toàn bộ không khóa |
| Giới hạn thẻ ôn tập Spaced Repetition | Tối đa 500 từ         | KHÔNG GIỚI HẠN        |
| Đồng bộ dữ liệu Đa thiết bị (Cloud)   | Chỉ lưu trên 1 máy    | Đồng bộ tức thì Phone/PC|
| Âm thanh bản xứ (TTS Native HD)       | Giới hạn tốc độ/lượt  | HD Audio, Không độ trễ|
| OCR Số hóa giáo trình (Scan ảnh/PDF)  | 5 trang / ngày        | Không giới hạn        |
| Đề thi mô phỏng HSK (Mock Exams)      | 1 đề thử nghiệm       | Trọn bộ đề thi thật   |
| AI Giải thích ngữ pháp & chữa bài     | Khóa                  | Phân tích chi tiết lỗi|
| Xuất / Nhập bộ từ vựng (Anki / Excel) | Chỉ xem               | Xuất / Nhập linh hoạt |
| Học Ngoại tuyến (Offline PWA)         | Cơ bản                | Full Audio Offline    |
| Quảng cáo & Huy hiệu thành viên       | Banner nâng cấp Pro   | Huy hiệu Hoàng Kim    |
+---------------------------------------------------------------------------------------+
```

### 2.2. Chiến lược định giá & Tối ưu chuyển đổi (Pricing Strategy)
1. **Gói Pro Tháng (`pro_monthly`):**
   - **Mức giá đề xuất:** 59.000 VNĐ / tháng (~2 bát phở, cực kỳ dễ ra quyết định mua).
   - **Mục tiêu:** Kéo tệp người dùng đang chuẩn bị thi gấp trong 1 - 2 tháng.
2. **Gói Pro Năm (`pro_yearly`) - GÓI BÁN CHẠY NHẤT (BEST VALUE):**
   - **Mức giá đề xuất:** 399.000 VNĐ / năm (~33.000 VNĐ / tháng, giảm 45%).
   - **Tặng kèm:** Ebook giải thích 500 điểm ngữ pháp HSK độc quyền + Bảng từ vựng HSK 3.0 PDF chất lượng in ấn.
3. **Gói Pro Trọn Đời (Lifetime) - Dành cho các chiến dịch Flash Sale:**
   - **Mức giá:** 899.000 VNĐ (Thanh toán 1 lần dùng mãi mãi).
   - **Tạo sự khan hiếm:** Chỉ mở bán 100 suất mỗi tháng hoặc trong đợt ra mắt tính năng lớn.
4. **Gói Doanh Nghiệp / Giáo Viên (B2B):**
   - Bán license theo nhóm học viên của trung tâm hoặc lớp học (từ 5 tài khoản trở lên chiết khấu 30%).

---

## 3. KIẾN TRÚC THANH TOÁN TỰ ĐỘNG HÓA 100% (INSTANT ACTIVATION)

Để đạt trải nghiệm mua hàng tốt nhất, quy trình từ khi khách hàng chuyển tiền đến lúc tài khoản tự động mở khóa Pro phải diễn ra **dưới 5 giây** mà không cần can thiệp thủ công.

### 3.1. Luồng thanh toán tự động (End-to-End Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as Học Viên (Browser)
    participant Front as Frontend Next.js
    participant API as Backend API (/api/payment)
    participant DB as Supabase PostgreSQL
    participant Bank as Cổng Ngân Hàng / PayOS / SePay
    
    User->>Front: Chọn Gói Pro & bấm Thanh Toán
    Front->>API: POST /api/payment/create-order (plan: pro_yearly)
    API->>DB: Tạo bản ghi Order (status: PENDING, code: HSK8392)
    API-->>Front: Trả về QR VietQR động (đúng số tiền + mã HSK8392)
    Front-->>User: Hiển thị QR Code & bắt đầu lắng nghe Realtime Channel
    
    User->>Bank: Quét mã QR trên App Ngân Hàng (Mobile Banking)
    Bank->>Bank: Chuyển tiền thành công
    Bank->>API: Webhook: POST /api/payment/webhook (kèm chữ ký bảo mật HMAC)
    
    critical Xác thực & Khóa Đơn Hàng (Idempotency)
        API->>API: Xác thực chữ ký bí mật (Webhook Secret Signature)
        API->>DB: BEGIN TRANSACTION; SELECT ... FOR UPDATE (tránh xử lý trùng)
        API->>DB: Cập nhật orders (status: COMPLETED)
        API->>DB: Kích hoạt / Cộng dồn user_subscriptions (+30 ngày / +365 ngày)
        API->>DB: COMMIT;
    end
    
    DB-->>Front: Supabase Realtime phát tín hiệu (Order: COMPLETED)
    Front-->>User: Màn hình tự động bùng nổ pháo hoa chúc mừng & Mở toàn bộ tính năng Pro!
```

### 3.2. Thiết kế Cơ sở dữ liệu Thanh Toán Mở Rộng

Cần bổ sung các bảng giao dịch chuẩn e-commerce vào Supabase:

```sql
-- 1. Bảng Đơn Hàng Chi Tiết
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_code text unique not null,         -- Ví dụ: HSK_839201
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text not null check (plan in ('pro_monthly', 'pro_yearly', 'pro_lifetime')),
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'expired', 'failed')),
  payment_method text default 'vietqr' check (payment_method in ('vietqr', 'card', 'activation_code')),
  transaction_ref text,                   -- Mã giao dịch ngân hàng trả về
  webhook_payload jsonb,                  -- Lưu vết để đối soát khi có khiếu nại
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Đánh Index để truy vấn tức thì theo User và Order Code
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_code on public.orders(order_code);
create index if not exists idx_orders_status on public.orders(status);

-- 3. Bật Realtime cho bảng orders để Frontend nhận diện ngay khi đơn hoàn tất
alter publication supabase_realtime add table public.orders;
```

### 3.3. Các kịch bản bất thường (Edge Cases) & Cơ chế phòng chống
1. **Khách chuyển thiếu tiền:**
   - Đơn hàng chuyển trạng thái `PARTIAL_PAID`. Hệ thống tự động bắn email thông báo cho học viên số tiền còn thiếu để chuyển tiếp hoặc liên hệ hỗ trợ.
2. **Khách gõ nhầm nội dung chuyển khoản:**
   - Webhook lưu giao dịch vào bảng `unmatched_transactions`. Admin có một giao diện (Backoffice) gán thủ công vào tài khoản khách chỉ bằng 1 cú nhấp chuột.
3. **Webhook bị gửi lặp lại (Replay / Retries):**
   - Áp dụng nguyên tắc **Idempotency**: Dùng `order_code` làm khóa duy nhất. Nếu đơn đã `COMPLETED`, trả về ngay HTTP 200 `Already Processed` mà không cộng ngày hạn 2 lần.

---

## 4. KIẾN TRÚC KỸ THUẬT, HÀNG ĐỢI (QUEUE) & CHỐNG NGHẼN TẢI

Khi ứng dụng bán ra thị trường, lưu lượng truy cập cao điểm vào buổi tối (từ 19h - 23h) sẽ gây áp lực rất lớn lên API âm thanh, cơ sở dữ liệu và xử lý tài liệu. Dưới đây là kiến trúc tách rời (Decoupled Architecture) đảm bảo hệ thống không bao giờ bị nghẽn.

### 4.1. Sơ đồ Kiến trúc Tổng thể (High-Concurrency Architecture)

```
                       [ USER REQUESTS ]
                              │
                              ▼
            ┌───────────────────────────────────┐
            │   CLOUDFLARE EDGE & CDN (L3/L7)   │
            │ - DDoS Shield & WAF Filter        │
            │ - SSL Offloading                  │
            │ - Edge Cache: Audio, Static Assets│
            └─────────────────┬─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
      [ Static Audio / Img ]      [ Dynamic App Routes ]
      Cloudflare R2 Bucket        Next.js App Server (Vercel / VPS)
      (Cached 1 Năm ở Edge)                 │
                                            ▼
                                ┌───────────────────────┐
                                │ UPSTASH REDIS LAYER   │
                                │ - Rate Limit Token    │
                                │ - Cache Key Tra cứu   │
                                │ - Session Fingerprint │
                                └───────────┬───────────┘
                                            │
                ┌───────────────────────────┴───────────────────────────┐
                ▼                                                       ▼
      [ Nguồn Dữ Liệu Nhanh ]                                 [ Hàng Đợi Tác Vụ Nặng ]
      Supabase PostgreSQL                                     BullMQ / QStash Workers
      (Qua Supavisor Connection Pool)                         (Xử lý OCR PDF / Email / AI)
```

### 4.2. Giải pháp triệt tiêu 99% nghẽn tải cho Audio (TTS Pipeline)
Hiện tại, ứng dụng gọi TTS on-the-fly từ Youdao/Google. Nếu 1.000 học viên cùng mở một bài học, server sẽ gửi 10.000 requests trong vài giây -> Chắc chắn bị Youdao/Google chặn IP.

**Chiến lược tối ưu:**
1. **Pre-generation (Đóng gói sẵn tài nguyên tĩnh):**
   - Viết kịch bản Python (`tools/pregenerate_audio.py`) chạy 1 lần duy nhất: Tải toàn bộ âm thanh của ~6.000 từ vựng HSK 1-6 và toàn bộ câu hội thoại của 15 bài học trong sách.
   - Đặt tên file chuẩn hóa: `audio/words/{word_id}.mp3`, `audio/sentences/{hash}.mp3`.
   - Upload toàn bộ lên **Cloudflare R2** (không tốn chi phí băng thông egress bandwidth).
   - Thiết lập header: `Cache-Control: public, max-age=31536000, immutable`.
2. **On-demand TTS Caching (Cho từ vựng người dùng tự thêm):**
   - Khi có từ vựng mới: Kiểm tra Redis/R2 xem âm thanh của chuỗi từ này đã tồn tại chưa (`MD5(text + lang)`).
   - Nếu đã có: Trả về link CDN trong 10ms.
   - Nếu chưa có: Mới gọi dịch vụ TTS tổng hợp, lưu kết quả vào R2 và Redis, sau đó trả về cho người dùng.

### 4.3. Kiến trúc Hàng đợi Xử lý Nặng (Queue & Worker Architecture)
Các tính năng sau **không bao giờ được chạy trực tiếp trên luồng HTTP Request/Response chính**:
- Quét OCR tài liệu PDF nhiều trang (Digitizer Studio).
- Chấm bài thi HSK và dùng AI tổng hợp phân tích điểm yếu của học viên.
- Gửi email hóa đơn, mã kích hoạt, thông báo gia hạn gói cước.

**Mô hình triển khai:**
- **Message Broker:** Upstash QStash (Serverless Queue) hoặc Redis + BullMQ.
- **Workflow:**
  1. User upload PDF -> Next.js API lưu file vào Storage và đẩy Job ID vào Queue -> Phản hồi ngay cho user: `{ status: "processing", jobId: "..." }`.
  2. Worker tiến hành phân trang PDF, gọi OCR trích xuất từ vựng, tự động tra cứu Pinyin/Hán Việt.
  3. Khi hoàn tất, Worker ghi kết quả vào Supabase và bắn thông báo Realtime để UI tự động cập nhật kết quả mà máy của học viên không bị nóng hay lag.

---

## 5. CHIẾN LƯỢC BẢO MẬT ĐA TẦNG, CHỐNG DDOS & GIAN LẬN

### 5.1. Phòng thủ DDoS và Tấn công Tầng Mạng (Layer 3/4 & Layer 7)
1. **Đặt toàn bộ ứng dụng sau Cloudflare Proxy:**
   - **Under Attack Mode:** Kích hoạt tự động khi nhận thấy đột biến traffic bất thường.
   - **Cloudflare Turnstile:** Giải pháp CAPTCHA vô hình không làm phiền người dùng nhưng chặn 100% headless crawler/bot tự động đăng ký tài khoản spam.
   - **WAF Rules (Web Application Firewall):**
     - Chặn các User-Agent độc hại (Python-requests không xác định, sqlmap, curl spam).
     - Giới hạn tần suất (Rate Limiting Rules): Tối đa 60 request / phút cho các route nhạy cảm (`/api/auth/*`, `/api/payment/*`, `/api/tts`).

### 5.2. Chống Gian Lận Bản Quyền & Hack Gói Cước Pro
1. **Tuyệt đối không cấp quyền kiểm soát gói cước từ Client:**
   - Trong Supabase RLS, người dùng chỉ có quyền `SELECT` trên `user_subscriptions` của chính họ (`auth.uid() = user_id`).
   - Mọi thao tác nâng cấp, hủy gói chỉ được phép thực thi thông qua **PostgreSQL Security Definer Functions** hoặc qua **Server Endpoint có kiểm tra Role Service Role Key**.
2. **Loại bỏ nguy cơ giả mạo LocalStorage:**
   - Mã checksum hiện tại trong `security.ts` là một giải pháp phòng vệ phía client. Tuy nhiên ở cấp độ Production, các tính năng Pro phía backend (như truy cập nội dung bài học cao cấp, đề thi thử HSK) phải được xác thực bằng **JWT Claims** do Supabase cấp, không tin cậy bất kỳ biến nào lưu ở trình duyệt.
3. **Bảo vệ tài liệu giáo trình chống cào dữ liệu (Anti-Scraping):**
   - Không xuất bản đường dẫn file đề thi/audio gốc công khai.
   - Tạo **Signed URL** (Đường dẫn có chữ ký thời hạn 15 phút) cho các tài nguyên chỉ thành viên Pro mới có quyền tải.

### 5.3. Bảo vệ Webhook Thanh Toán Tuyệt Đối
- Tạo **Webhook Secret Token** ngẫu nhiên dài 64 ký tự.
- Khi nhận request Webhook từ cổng thanh toán:
  ```typescript
  // Kiểm tra chữ ký HMAC SHA256
  const signature = req.headers.get("x-signature")
  const computedSignature = crypto
    .createHmac("sha256", process.env.PAYMENT_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex")

  if (signature !== computedSignature) {
    return new Response("Invalid signature", { status: 401 })
  }
  ```
- Kiểm tra độ trôi thời gian (Timestamp drift < 5 phút) để triệt tiêu tấn công Replay Attack.

---

## 6. TỐI ƯU HÓA TRẢI NGHIỆM NGƯỜI DÙNG (UX/UI & MULTI-DEVICE SYNC)

Một ứng dụng trả phí cần mang lại cảm giác mượt mà, phản hồi tức thì và hoạt động hoàn hảo trên mọi thiết bị.

### 6.1. Đồng bộ dữ liệu Đa thiết bị (Hybrid Client-First Sync)
Điểm mạnh nhất hiện tại của app là sử dụng IndexedDB (Dexie) giúp tốc độ đọc thẻ cực nhanh (0ms latency). Để bán Pro, chúng ta giữ nguyên ưu điểm này nhưng bổ sung thêm lớp **Đồng bộ Đám mây (Cloud Sync)**:

```
[ IndexedDB (Local) ]  ◄──(Lưu tức thì 0ms)──►  [ Giao diện Học tập ]
          ▲
          │ (Đồng bộ nền khi có mạng / Background Sync)
          ▼
[ Supabase PostgreSQL ] ◄──(Realtime Push)────► [ Điện thoại / iPad của User ]
```

- **Quy tắc giải quyết xung đột (Conflict Resolution):** Sử dụng `updated_at` (Last-Write-Wins) hoặc Version Vector. Khi học trên điện thoại xong, về máy tính mở app lên dữ liệu ôn tập SRS tự động cập nhật đúng ngày đến hạn ôn.

### 6.2. Ứng dụng Web Tiến bộ (PWA - Progressive Web App)
- Cho phép người dùng bấm **"Cài đặt ứng dụng"** trực tiếp trên Safari iOS hoặc Chrome Android, hoạt động toàn màn hình không có thanh địa chỉ như ứng dụng Native.
- Cấu hình **Service Worker** lưu đệm toàn bộ shell ứng dụng, font chữ chữ Hán, và dữ liệu từ vựng để mở app học ngay cả khi trên máy bay hoặc mất mạng internet.

### 6.3. Tối ưu Hiệu năng Cốt lõi (Core Web Vitals)
- **LCP (Largest Contentful Paint) < 1.2s:** Server-Side Render (SSR) khung xương trang chủ, hình ảnh Chibi được nén bằng WebP/SVG vector.
- **INP (Interaction to Next Paint) < 50ms:** Lật thẻ từ vựng và vẽ nét chữ Hán (Hanzi Writer) sử dụng CSS GPU Transform `will-change: transform`.
- **Haptic Feedback:** Rung nhẹ xúc giác trên màn hình cảm ứng điện thoại khi học viên chọn đúng/sai bài tập hoặc hoàn thành nét chữ Hán, tạo cảm giác thỏa mãn khi học.

---

## 7. HẠ TẦNG, VẬN HÀNH, GIÁM SÁT & PHÁP LÝ BÁN HÀNG

### 7.1. Cấu hình Hạ tầng & Chi phí Dự kiến giai đoạn Khởi động (Tối ưu ROI)

| Dịch vụ | Vai trò trong hệ thống | Chi phí tháng đầu (0 - 1.000 users) |
| :--- | :--- | :--- |
| **Vercel / VPS Docker** | Chạy Frontend Next.js & Serverless APIs | Miễn phí (Hobby) hoặc 20$ / tháng |
| **Supabase** | Cơ sở dữ liệu PostgreSQL, Auth, Realtime | Miễn phí (Free Tier) hoặc 25$ / tháng (Pro) |
| **Cloudflare** | DNS, CDN, DDoS Shield, WAF, Object Storage R2 | Miễn phí (Zero Egress Bandwidth) |
| **Upstash** | Serverless Redis (Rate-limit, Caching) | Miễn phí (10.000 commands/ngày) |
| **PayOS / SePay** | Cổng kết nối Webhook tài khoản ngân hàng | 0đ - 100.000đ / tháng theo giao dịch |
| **Sentry** | Giám sát lỗi người dùng phía Client & Server | Miễn phí (Developer Plan) |
| **TỔNG CHI PHÍ** | **Hệ thống chuẩn Enterprise, chi phí cực thấp** | **~0đ - 50$ / tháng (~1.2 triệu VNĐ)** |

### 7.2. Giám sát & Báo động Tự động (Monitoring & Alerts)
- Tích hợp **Telegram Bot / Discord Webhook**:
  - Khi có đơn hàng thanh toán thành công: Bắn tin nhắn báo doanh thu `+399.000đ từ HSK_9201`.
  - Khi có lỗi 500 hoặc Webhook thanh toán gặp sự cố: Bắn cảnh báo đỏ kèm StackTrace để lập trình viên xử lý ngay trong 5 phút.
- Tích hợp **Uptime Kuma / Better Uptime**: Đo lường độ ổn định (SLA 99.9%), tự động gọi điện/nhắn tin nếu website bị gián đoạn.

### 7.3. Pháp lý & Tuân thủ khi bán hàng Online
1. **Chính sách Quyền riêng tư (Privacy Policy):** Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân tại Việt Nam.
2. **Điều khoản Dịch vụ & Hoàn tiền (Terms of Service & Refund Policy):**
   - Quy định rõ phạm vi gói Pro.
   - Cam kết hoàn tiền trong vòng 3 ngày nếu hệ thống gặp lỗi kỹ thuật không khắc phục được.
3. **Bản quyền Nội dung:** Các bài đọc, câu ví dụ cần được tự biên soạn hoặc sử dụng từ điển mở (CC-CEDICT), trích dẫn nguồn học thuật chuẩn để tránh tranh chấp bản quyền giáo trình gốc.

---

## 8. LỘ TRÌNH TRIỂN KHAI (SPRINT ROADMAP 4 TUẦN)

### Tuần 1: Khóa Chặt Bảo Mật & Nền Tảng Dữ Liệu
- [ ] Rà soát toàn bộ RLS policies trên Supabase, đảm bảo không thể bypass gói Pro.
- [ ] Triển khai bảng `orders` và tích hợp chữ ký bảo mật Webhook.
- [ ] Thiết lập Cloudflare WAF, Turnstile CAPTCHA và Upstash Redis Rate Limiting.

### Tuần 2: Tự Động Hóa Thanh Toán & Đồng Bộ Đám Mây
- [ ] Tích hợp API PayOS / SePay tạo VietQR động có mã đơn tự động.
- [ ] Xây dựng Webhook xử lý thanh toán tự động, kích hoạt tức thì.
- [ ] Cấu hình Supabase Realtime cho modal thanh toán (tự động mở Pro không cần reload).
- [ ] Xây dựng tính năng Cloud Sync cho dữ liệu ôn tập SRS giữa nhiều thiết bị.

### Tuần 3: Tối Ưu Âm Thanh, Hàng Đợi & CDN
- [ ] Chạy script tạo sẵn (Pre-generate) 100% audio từ vựng và lưu trữ trên Cloudflare R2.
- [ ] Cập nhật endpoint `/api/tts` thành cơ chế Cache-First (Redis + R2).
- [ ] Tối ưu hóa bộ công cụ số hóa OCR (chuyển sang Web Worker hoặc xử lý bất đồng bộ).

### Tuần 4: Hoàn Thiện UX, PWA & Sẵn Sàng Ra Mắt (Launch)
- [ ] Cấu hình PWA (manifest.json, Service Worker, icons, offline cache).
- [ ] Thêm Banner nâng cấp, hiệu ứng vinh danh Pro, streak freeze và gamification.
- [ ] Tích hợp Sentry theo dõi lỗi và Telegram Bot thông báo đơn hàng.
- [ ] Viết trang Điều khoản dịch vụ & Chính sách hoàn tiền.
- [ ] Chạy thử nghiệm giao dịch thực tế (E2E Test) trên cả điện thoại và máy tính trước khi công bố bán chính thức.

---
*Tài liệu này được biên soạn độc quyền cho hệ thống HSK Learning Platform. Mọi thay đổi về cấu trúc kiến trúc cần được đối chiếu với ma trận bảo mật và giới hạn hạ tầng trong tài liệu này.*
