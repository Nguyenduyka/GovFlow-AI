<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# GovFlow AI - Trợ lý Số Hành chính Công cấp Xã

Ứng dụng trợ lý AI hỗ trợ UBND cấp xã trong công tác hành chính công, quản lý văn bản, phân tích dữ liệu và điều hành công việc.

## ✨ Tính năng

- **AI Chat Assistant** - Trợ lý AI trả lời câu hỏi về hành chính công
- **Document Analysis** - Phân tích và trích xuất thông tin từ văn bản
- **Document Drafting** - Soạn thảo văn bản hành chính tự động
- **Meeting Summarization** - Tóm tắt biên bản họp và phân rã nhiệm vụ
- **Socio-Economic Indicators** - Theo dõi chỉ tiêu kinh tế - xã hội
- **Digital Twin Map** - Bản đồ số theo dõi địa bàn
- **Role-Based Dashboards** - Giao diện theo vai trò (Chủ tịch, Phó Chủ tịch, Chánh Văn phòng, v.v.)
- **Workflow Management** - Quản lý công việc Kanban

## 🚀 Deploy lên Vercel (Khuyến nghị)

### Bước 1: Chuẩn bị

1. Cài Node.js 20+ từ [nodejs.org](https://nodejs.org/)
2. Clone repository về máy
3. Cài dependencies:

```bash
npm install
```

### Bước 2: Build project

```bash
npm run build
```

Build sẽ tạo thư mục `dist/` chứa frontend và `dist/server.cjs` chứa backend.

### Bước 3: Cấu hình Environment Variables

Trên Vercel Dashboard hoặc Vercel CLI:

```bash
vercel env add GEMINI_API_KEY production
# Nhập Gemini API key của bạn
```

Các biến môi trường cần thiết:

| Biến | Mô tả | Bắt buộc |
|------|-------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `APP_URL` | URL của app (Vercel tự động set) | ✅ |
| `NODE_ENV` | Môi trường (production) | auto |

### Bước 4: Deploy

**Cách 1: Vercel Dashboard**
1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com), import project
3. Framework Preset: `Other`
4. Root Directory: `.` (root)
5. Add Environment Variable `GEMINI_API_KEY`
6. Click Deploy

**Cách 2: Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

## 🚂 Deploy lên Railway

1. Push code lên GitHub
2. Vào [railway.app](https://railway.app), tạo new project
3. Connect GitHub repository
4. Railway tự động nhận diện Node.js project
5. Add Environment Variable `GEMINI_API_KEY`
6. Deploy

File `railway.json` đã được cung cấp sẵn.

## 📁 Cấu trúc Project

```
govflow-ai/
├── src/                    # Source code React frontend
│   ├── components/        # React components
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── types.ts          # TypeScript types
├── server.ts              # Express backend server
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
├── package.json          # Dependencies
├── vercel.json           # Vercel deployment config
├── railway.json          # Railway deployment config
├── .env.example          # Environment variables template
└── dist/                 # Build output (tạo sau khi run build)
```

## 🔧 Development Locally

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local và thêm GEMINI_API_KEY của bạn

# Run development server
npm run dev
```

Mở http://localhost:3000

## 📋 API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/config` | GET | Kiểm tra cấu hình |
| `/api/gemini/chat` | POST | Chat với AI |
| `/api/gemini/analyze-document` | POST | Phân tích văn bản |
| `/api/gemini/draft` | POST | Soạn thảo văn bản |
| `/api/gemini/summarize-meeting` | POST | Tóm tắt cuộc họp |

## 🔐 Security Notes

- **KHÔNG** commit file `.env` vào Git
- Gemini API key được giữ ở server-side (không expose ra client)
- Tất cả API calls đến Gemini đều qua backend proxy
- Dùng HTTPS trong production

## 🐛 Troubleshooting

### Build fails
- Kiểm tra Node.js version (20+)
- Xóa `node_modules` và `package-lock.json`, rồi `npm install` lại

### API not working on Vercel
- Kiểm tra Environment Variables đã set đúng chưa
- Kiểm tra Vercel logs trong dashboard

### Gemini API errors
- Kiểm tra API key hợp lệ
- Kiểm tra quota của Gemini API
- Kiểm tra billing trên Google AI Studio

## 📄 License

Apache-2.0

## 🙏 Credits

Built with ❤️ for Vietnamese local government digital transformation.
