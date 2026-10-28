# Hệ thống quản lý sách - 234753_TuLePhuoc

Bài thực hành học phần Điện toán đám mây. Sinh viên: TuLePhuoc, MSSV: 234753.

## Công nghệ
React + Vite, Node.js + Express + Mongoose, MongoDB Atlas, GitHub, Docker, Docker Hub, Render, nginx.

## Cấu trúc
- `backend/`: REST API Express, MongoDB Atlas.
- `frontend/`: giao diện React, nginx reverse proxy cho `/api` khi chạy Docker.
- `sample-books.json`: 3 bản ghi minh họa nhập MongoDB Atlas.

## Chạy local (Node.js >=20)
1. `cd backend && npm install`.
2. Sao chép `backend/.env.example` thành `backend/.env`, chỉnh `MONGODB_URI` và `DB_NAME`.
3. `npm start` (backend tại `http://localhost:5000`).
4. Terminal mới: `cd frontend && npm install && npm run dev`.
5. Truy cập `http://localhost:5173`.

## API
- `GET /health`: trạng thái API + DB.
- `GET /api/books`, `GET /api/books?search=cloud`, `GET /api/books/:id`.
- `POST /api/books`, `PUT /api/books/:id`, `DELETE /api/books/:id`.

## Docker
- `docker build -t <dockerid>/backend:latest ./backend`
- `docker build -t <dockerid>/frontend:latest ./frontend`
- Backend: `docker run --rm -p 5000:5000 --env-file backend/.env <dockerid>/backend:latest`
- Frontend (Docker Desktop Windows): `docker run --rm -p 8080:80 -e BACKEND_URL=http://host.docker.internal:5000 <dockerid>/frontend:latest`
- Render: deploy backend image trước, set `MONGODB_URI`, `DB_NAME`, `CORS_ORIGIN`. Sau đó deploy frontend image với `BACKEND_URL=https://api-234753.onrender.com` (thay bằng URL API thật, không thêm dấu `/` cuối).

## Bảo mật
Không commit `.env`, mật khẩu, token, connection string có user/password. `.env.example` chỉ là ví dụ.
