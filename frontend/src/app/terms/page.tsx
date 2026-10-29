import type { Metadata } from "next"
import LegalLayout, { SUPPORT_EMAIL } from "@/components/legal/LegalLayout"
import { PLANS } from "@/lib/plans"

export const metadata: Metadata = { title: "Điều khoản dịch vụ" }

const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ"

export default function TermsPage() {
  return (
    <LegalLayout title="Điều khoản dịch vụ">
      <p>
        Khi tạo tài khoản hoặc sử dụng HSK Learning (&quot;Dịch vụ&quot;), bạn đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng
        ngừng sử dụng Dịch vụ.
      </p>

      <h2>1. Tài khoản</h2>
      <ul>
        <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.</li>
        <li>Mỗi tài khoản dành cho một cá nhân. Nghiêm cấm chia sẻ, bán lại hoặc cho thuê tài khoản Pro.</li>
        <li>Chúng tôi có quyền tạm khóa tài khoản có dấu hiệu gian lận, lạm dụng hệ thống hoặc vi phạm điều khoản.</li>
      </ul>

      <h2>2. Gói Miễn phí và gói Pro</h2>
      <ul>
        <li>Gói Miễn phí có giới hạn về số thẻ ôn tập, nội dung và lượt sử dụng một số tính năng như được hiển thị trong ứng dụng.</li>
        <li>
          Gói Pro Theo Tháng: {vnd(PLANS.pro_monthly.amount)} cho {PLANS.pro_monthly.days} ngày. Gói Pro Theo Năm: {vnd(PLANS.pro_yearly.amount)} cho{" "}
          {PLANS.pro_yearly.days} ngày.
        </li>
        <li>Gói Pro <b>không tự động gia hạn</b>. Khi bạn thanh toán gói mới lúc còn hạn, thời gian được cộng dồn vào hạn hiện tại.</li>
        <li>Khi hết hạn, tài khoản trở về gói Miễn phí; dữ liệu học của bạn vẫn được giữ nguyên.</li>
      </ul>

      <h2>3. Thanh toán</h2>
      <ul>
        <li>Thanh toán bằng chuyển khoản ngân hàng (VietQR). Bạn cần chuyển <b>đúng số tiền và đúng nội dung</b> do hệ thống tạo ra.</li>
        <li>Gói Pro được kích hoạt tự động ngay khi hệ thống ghi nhận khoản tiền hợp lệ.</li>
        <li>Chuyển thiếu tiền: đơn hàng chưa được kích hoạt, bạn có thể chuyển bù phần còn thiếu với cùng nội dung. Chuyển sai nội dung: vui lòng liên hệ hỗ trợ kèm biên lai.</li>
      </ul>

      <h2>4. Quyền sở hữu và sử dụng nội dung</h2>
      <ul>
        <li>Nội dung học tập (từ vựng, bài học, bài tập, âm thanh) thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép.</li>
        <li>Bạn được sử dụng cho mục đích học tập cá nhân. Nghiêm cấm sao chép hàng loạt, cào dữ liệu, phân phối lại hoặc dùng cho mục đích thương mại.</li>
        <li>Nội dung bạn tự tạo (bộ thẻ, ghi chú) thuộc về bạn; bạn cấp cho chúng tôi quyền lưu trữ để cung cấp Dịch vụ.</li>
      </ul>

      <h2>5. Giới hạn trách nhiệm</h2>
      <p>
        Dịch vụ được cung cấp &quot;nguyên trạng&quot;. Chúng tôi nỗ lực duy trì hoạt động ổn định nhưng không đảm bảo không gián đoạn hoặc không có lỗi.
        Kết quả thi HSK thực tế phụ thuộc vào nỗ lực của người học; chúng tôi không cam kết điểm số.
      </p>

      <h2>6. Thay đổi điều khoản</h2>
      <p>Chúng tôi có thể cập nhật điều khoản và sẽ thông báo trong ứng dụng khi có thay đổi quan trọng. Việc tiếp tục sử dụng đồng nghĩa với việc chấp nhận bản cập nhật.</p>

      <h2>7. Liên hệ</h2>
      <p>
        Mọi thắc mắc vui lòng gửi về <a className="underline text-china-red" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </LegalLayout>
  )
}
