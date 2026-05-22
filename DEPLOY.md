# Deployment Guide - GovFlow AI

Hướng dẫn chi tiết deploy GovFlow AI lên các nền tảng cloud.

## 📦 Prerequisites

- Node.js 20+ installed locally
- Gemini API key from [Google AI Studio](https://aistudio.google.com/)
- Git installed
- GitHub account (hoặc GitLab/Bitbucket)

---

## 🚀 Quick Deploy to Vercel (Recommended)

### 1. Prepare Your Repository

```bash
# Clone và cài đặt
git clone <your-repo-url>
cd govflow-ai
npm install

# Build để kiểm tra
npm run build
```

Nếu build thành công, tiếp tục. Nếu lỗi, kiểm tra:
- Node.js version: `node --version` (cần 20+)
- Xóa cache: `rm -rf node_modules package-lock.json && npm install`

### 2. Push to GitHub

```bash
git add .
git commit -m "feat: add deployment config"
git push origin main
```

### 3. Deploy on Vercel

**Option A: Vercel Dashboard (Easiest)**

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập
2. Click "New Project"
3. Import repository của bạn
4. Configuration:
   - **Framework Preset**: `Other`
   - **Root Directory**: `.` (leave empty or `.`)
   - **Build Command**: `npm run build` (Vercel sẽ tự nhận)
   - **Output Directory**: `dist`
5. Environment Variables:
   ```
   GEMINI_API_KEY = your_actual_gemini_api_key_here
   ```
6. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (sẽ hỏi các cấu hình)
vercel --prod

# Sau khi deploy thành công, set environment variable:
vercel env add GEMINI_API_KEY production
# Nhập Gemini API key
```

### 4. Verify Deployment

Sau khi deploy, Vercel sẽ cung cấp URL (ví dụ: `https://govflow-ai.vercel.app`)

Mở URL và kiểm tra:
- `/api/config` - phải trả về `{"hasApiKey": true, "status": "online"}`
- Dashboard UI load bình thường
- AI chat hoạt động

---

## 🚂 Deploy to Railway

### 1. Push to GitHub

Đảm bảo code đã được push lên GitHub với các file:
- `railway.json`
- `package.json`
- `server.ts`
- `vite.config.ts`

### 2. Deploy on Railway

1. Truy cập [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway tự động nhận diện Node.js project
6. **Add Environment Variable**:
   - Key: `GEMINI_API_KEY`
   - Value: your_gemini_api_key
7. Click "Deploy"

### 3. Custom Domain (Optional)

Trong Railway dashboard:
- Settings → Domains → Add Domain
- Config DNS theo hướng dẫn

---

## 🔧 Alternative: Docker Deployment

Build và chạy bằng Docker:

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
```

Build và run:

```bash
docker build -t govflow-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key govflow-ai
```

---

## ⚙️ Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | `AIzaSy...` |
| `APP_URL` | App URL (auto-set by platform) | ✅ | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment | auto | `production` |
| `PORT` | Server port (auto-set) | auto | `3000` |

### Getting Gemini API Key

1. Vào [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key" (trên sidebar)
3. Tạo new API key
4. Copy và paste vào environment variables

**⚠️ Important**: Gemini API key bắt đầu với `AIzaSy...`. Nếu key bắt đầu bằng `sk-`, đó là OpenAI key - không dùng được.

---

## 🐛 Troubleshooting

### Build fails with "Cannot find module"

```bash
# Clear cache và reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Vercel: "No Output Directory Found"

Vercel không tìm thấy `dist/` sau build.

**Fix**:
1. Kiểm tra `vite.config.ts` - output dir mặc định là `dist`
2. Build locally: `npm run build` - có tạo `dist/index.html` không?
3. Nếu dùng custom output, thêm vào `vercel.json`:

```json
{
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "your-dist-folder"
      }
    }
  ]
}
```

### API returns "hasApiKey: false"

Environment variable chưa được set hoặc set sai.

**Fix**:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add `GEMINI_API_KEY` với value là API key thực
3. Redeploy

### Railway: "Module not found: vite"

```bash
# Ensure vite is in dependencies (not devDependencies)
# package.json nên có:
"dependencies": {
  "vite": "^6.2.3",
  ...
}
```

**Fix**: Move `vite` từ `devDependencies` sang `dependencies` trong `package.json`, rồi redeploy.

### Gemini API Error: "Invalid API key"

- Kiểm tra API key có đúng không (copy nguyên từ AI Studio)
- Kiểm tra API key có bị revoke không
- Kiểm tra quota/billing trên Google Cloud

---

## 📊 Monitoring & Logs

### Vercel
- Dashboard → Project → Functions → Logs
- Xem logs của `/api/*` endpoints

### Railway
- Dashboard → Project → Logs
- Real-time logs streaming

---

## 🔄 CI/CD (Optional)

GitHub Actions workflow để auto-deploy:

**.github/workflows/deploy.yml**:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Gemini API key đã được set
- [ ] Domain custom đã config (nếu cần)
- [ ] HTTPS hoạt động
- [ ] Test tất cả API endpoints
- [ ] Kiểm tra logs không có error
- [ ] Set up monitoring (Vercel Analytics, Railway Metrics)
- [ ] Backup database (nếu có)
- [ ] Review security headers

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trên platform
2. Đảm bảo API key hợp lệ
3. Open issue trên GitHub với:
   - Platform name (Vercel/Railway)
   - Error logs
   - Steps to reproduce

---

**Happy Deploying!** 🚀