# HỆ THỐNG QUẢN LÝ SÁCH

## 1. Thông tin sinh viên
- **Họ tên:** TuLePhuoc
- **MSSV:** 234753
- **Học phần:** Điện toán đám mây
- **Đề tài:** Xây dựng hệ thống quản lý sách trên nền tảng đám mây.

## 2. Công nghệ sử dụng
- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Quản lý mã nguồn:** GitHub
- **Đóng gói:** Docker, Docker Hub
- **Triển khai:** Render

## 3. Chức năng
- Hiển thị danh sách sách.
- Xem chi tiết sách.
- Thêm, sửa, xóa sách.
- Tìm kiếm sách qua Backend API.
- Kết nối và lưu trữ dữ liệu trên MongoDB Atlas.

## 4. Cấu trúc dự án
```text
234753_TuLePhuoc/
├── backend/
├── frontend/
├── sample-books.json
├── .gitignore
└── README.md
```

## 5. Cơ sở dữ liệu
- **Cluster:** Cluster0
- **Database:** 234753_TuLePhuoc
- **Collection:** books

## 6. Hướng dẫn chạy

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Cần cấu hình `MONGODB_URI`, `DB_NAME`, `PORT` trong file `backend/.env`. Không đưa mật khẩu lên GitHub.

## 7. Đường dẫn dự án

- **GitHub:** https://github.com/tuphuoc10102005-wq/234753_TuLePhuoc
- **Docker Backend:** https://hub.docker.com/r/tuphuoc/backend
- **Docker Frontend:** https://hub.docker.com/r/tuphuoc/frontend
- **Render Backend:** https://api-234753.onrender.com
- **Render Frontend:** https://web-234753.onrender.com
- **MongoDB Atlas:** Database 234753_TuLePhuoc, Collection books
## 8. Kết luận
Hệ thống quản lý sách sử dụng React, Node.js, MongoDB Atlas và Docker, được triển khai trên nền tảng điện toán đám mây Render.
