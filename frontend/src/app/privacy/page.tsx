import type { Metadata } from "next"
import LegalLayout, { SUPPORT_EMAIL } from "@/components/legal/LegalLayout"

export const metadata: Metadata = { title: "Chính sách bảo mật" }

export default function PrivacyPage() {
  return (
    <LegalLayout title="Chính sách bảo mật">
      <p>
        Chúng tôi coi trọng quyền riêng tư của bạn và xử lý dữ liệu cá nhân theo quy định pháp luật Việt Nam, bao gồm Nghị định 13/2023/NĐ-CP về bảo
        vệ dữ liệu cá nhân.
      </p>

      <h2>1. Dữ liệu chúng tôi thu thập</h2>
      <ul>
        <li><b>Thông tin tài khoản:</b> email, mã người dùng, phương thức đăng nhập (email hoặc Google).</li>
        <li><b>Dữ liệu học tập:</b> tiến độ bài học, thẻ ôn tập (SRS), bộ thẻ tự tạo.</li>
        <li><b>Dữ liệu giao dịch:</b> mã đơn, số tiền, gói đăng ký, mã giao dịch ngân hàng. Chúng tôi <b>không</b> lưu số thẻ hay mật khẩu ngân hàng của bạn.</li>
        <li><b>Dữ liệu kỹ thuật:</b> địa chỉ IP, loại trình duyệt - dùng để chống lạm dụng và bảo vệ hệ thống.</li>
      </ul>

      <h2>2. Mục đích sử dụng</h2>
      <ul>
        <li>Cung cấp và duy trì Dịch vụ, đồng bộ dữ liệu học giữa các thiết bị (gói Pro).</li>
        <li>Xử lý thanh toán, kích hoạt gói và hỗ trợ khách hàng.</li>
        <li>Bảo mật hệ thống, phát hiện gian lận và tấn công.</li>
      </ul>

      <h2>3. Lưu trữ và chia sẻ</h2>
      <ul>
        <li>Dữ liệu được lưu trên hạ tầng của nhà cung cấp dịch vụ đám mây đáng tin cậy (cơ sở dữ liệu, xác thực), mã hóa khi truyền tải.</li>
        <li>Một phần dữ liệu học được lưu trực tiếp trên trình duyệt của bạn (IndexedDB) để học offline.</li>
        <li>Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ với đơn vị xử lý thanh toán/hạ tầng ở mức cần thiết để vận hành Dịch vụ, hoặc khi cơ quan có thẩm quyền yêu cầu theo luật.</li>
      </ul>

      <h2>4. Quyền của bạn</h2>
      <ul>
        <li>Truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của bạn.</li>
        <li>Rút lại sự đồng ý xử lý dữ liệu (có thể ảnh hưởng đến việc sử dụng một số tính năng).</li>
        <li>Yêu cầu xóa tài khoản: gửi email tới địa chỉ liên hệ bên dưới, chúng tôi xử lý trong vòng 30 ngày.</li>
      </ul>

      <h2>5. Cookie và lưu trữ cục bộ</h2>
      <p>Chúng tôi dùng bộ nhớ cục bộ của trình duyệt để duy trì phiên đăng nhập, lưu tiến độ và bộ nhớ đệm phục vụ học offline. Không sử dụng cookie quảng cáo của bên thứ ba.</p>

      <h2>6. Liên hệ</h2>
      <p>
        Yêu cầu về dữ liệu cá nhân: <a className="underline text-china-red" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </LegalLayout>
  )
}
