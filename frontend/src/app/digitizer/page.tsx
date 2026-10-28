import { Metadata } from 'next'
import OcrStudio from '@/components/digitizer/OcrStudio'

export const metadata: Metadata = {
  title: 'Studio Số hóa Giáo trình | Bounding Box OCR',
  description: 'Công cụ số hóa giáo trình HSK: Khoanh vùng ảnh chụp, nhận diện chữ Hán, tự động tra Pinyin, Hán-Việt và nghĩa tiếng Việt.',
}

export default function DigitizerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      <OcrStudio />
    </div>
  )
}
