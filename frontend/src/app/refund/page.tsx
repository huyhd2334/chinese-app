import type { Metadata } from "next"
import LegalLayout, { SUPPORT_EMAIL } from "@/components/legal/LegalLayout"

export const metadata: Metadata = { title: "Chính sách hoàn tiền" }

export default function RefundPage() {
  return (
    <LegalLayout title="Chính sách hoàn tiền">
      <p>Chúng tôi muốn bạn hài lòng với gói Pro. Chính sách hoàn tiền áp dụng như sau:</p>

      <h2>1. Trường hợp được hoàn tiền</h2>
      <ul>
        <li>
          <b>Lỗi kỹ thuật:</b> bạn đã thanh toán thành công nhưng gói Pro không được kích hoạt và chúng tôi không khắc phục được trong vòng
          <b> 3 ngày</b> kể từ khi nhận yêu cầu.
        </li>
        <li><b>Thanh toán trùng:</b> bạn chuyển tiền nhiều lần cho cùng một đơn hàng - phần dư sẽ được hoàn lại hoặc cộng thêm thời hạn theo lựa chọn của bạn.</li>
        <li><b>Không hài lòng:</b> yêu cầu trong vòng <b>3 ngày</b> kể từ ngày kích hoạt và bạn mới sử dụng ở mức hạn chế (vui lòng nêu rõ lý do để chúng tôi cải thiện).</li>
      </ul>

      <h2>2. Trường hợp không hoàn tiền</h2>
      <ul>
        <li>Quá 3 ngày kể từ ngày kích hoạt (trừ lỗi kỹ thuật do phía chúng tôi).</li>
        <li>Tài khoản bị khóa do vi phạm điều khoản (chia sẻ tài khoản, cào dữ liệu, gian lận).</li>
        <li>Chuyển sai nội dung hoặc sai tài khoản nhận do người dùng nhập nhầm - chúng tôi sẽ hỗ trợ đối soát và gắn đúng đơn hàng nếu có biên lai hợp lệ.</li>
      </ul>

      <h2>3. Cách yêu cầu hoàn tiền</h2>
      <ul>
        <li>
          Gửi email tới <a className="underline text-china-red" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> kèm: email tài khoản, mã đơn
          (dạng HSKXXXXXXXX), ảnh biên lai chuyển khoản và lý do.
        </li>
        <li>Chúng tôi phản hồi trong vòng 1-2 ngày làm việc; khoản hoàn được chuyển về tài khoản ngân hàng đã thanh toán trong 3-7 ngày làm việc sau khi duyệt.</li>
      </ul>
    </LegalLayout>
  )
}
