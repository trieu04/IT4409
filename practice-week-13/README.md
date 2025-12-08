# Hướng Dẫn Chạy Ứng Dụng Quản Lý Học Sinh

## Yêu Cầu Hệ Thống
- Node.js (v16 trở lên)
- pnpm
- Docker và Docker Compose

## Các Bước Khởi Động

### 1. Khởi động MongoDB
```bash
cd backend
docker compose up -d
```

### 2. Khởi động Backend Server
```bash
cd backend
pnpm install
node index.js
```
Backend sẽ chạy tại: http://localhost:5000

### 3. Khởi động Frontend
```bash
cd student-management
pnpm install
pnpm dev
```
Frontend sẽ chạy tại: http://localhost:5173

## Kiểm Tra API
- Danh sách học sinh: `GET http://localhost:5000/api/students`
- Test API: `curl http://localhost:5000/api/students`

## Cấu Trúc Thư Mục
```
practice-week-13/
├── backend/
│   ├── index.js          # Server chính
│   ├── Student.js        # Model học sinh
│   ├── docker-compose.yml
│   ├── package.json
│   └── mongodbdata/      # Dữ liệu MongoDB (tự tạo)
├── student-management/   # Frontend React
└── README.md
```

## Tính Năng Đã Hoàn Thành (Bài 1)
✅ Thiết lập dự án React với Vite
✅ Thiết lập backend Express.js
✅ Kết nối MongoDB với Docker
✅ Tạo model Student với Mongoose
✅ API GET danh sách học sinh
✅ Hiển thị danh sách học sinh trên React (có thể rỗng)
✅ Giao diện responsive và đẹp mắt