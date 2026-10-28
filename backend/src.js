import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const DB_NAME = process.env.DB_NAME || '234753_TuLePhuoc';
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:8080')
  .split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) {
  if (!origin || origins.includes(origin)) return callback(null, true);
  return callback(new Error('CORS: Origin not allowed'));
} }));
app.use(express.json({ limit: '100kb' }));

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  publisher: { type: String, required: true, trim: true },
  publishYear: { type: Number, required: true },
  isbn: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true },
  description: { type: String, default: '', trim: true }
}, { timestamps: true, versionKey: false });
const Book = mongoose.model('Book', bookSchema, 'books');

function validate(data) {
  const errors = [];
  const required = ['bookId', 'title', 'author', 'category', 'publisher', 'isbn'];
  for (const field of required) if (typeof data[field] !== 'string' || !data[field].trim()) errors.push(`${field} không được để trống`);
  const y = Number(data.publishYear), q = Number(data.quantity);
  if (!Number.isInteger(y) || y < 1450 || y > new Date().getFullYear() + 1) errors.push('publishYear không hợp lệ');
  if (!Number.isInteger(q) || q < 0) errors.push('quantity phải là số nguyên không âm');
  if (data.description != null && typeof data.description !== 'string') errors.push('description phải là chuỗi');
  return errors;
}
function errorResponse(err, res) {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: 'Mã sách bookId đã tồn tại' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'ID không hợp lệ' });
  return res.status(500).json({ message: 'Lỗi máy chủ hoặc kết nối cơ sở dữ liệu' });
}
app.get('/health', (_req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'database_disconnected', database: DB_NAME }));
app.get('/api/books', async (req, res) => {
  try {
    const search = String(req.query.search || '').trim().slice(0, 100);
    const filter = search ? { $or: ['title', 'author', 'category'].map(field => ({ [field]: { $regex: search.replace(/[^a-zA-Z0-9\u00C0-\u1EF9 ]/g, ''), $options: 'i' } })) } : {};
    res.json(await Book.find(filter).sort({ createdAt: -1 }).lean());
  } catch (err) { errorResponse(err, res); }
});
app.get('/api/books/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'ID không hợp lệ' });
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) { errorResponse(err, res); }
});
app.post('/api/books', async (req, res) => {
  try {
    const errors = validate(req.body || {});
    if (errors.length) return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors });
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) { errorResponse(err, res); }
});
app.put('/api/books/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'ID không hợp lệ' });
    const errors = validate(req.body || {});
    if (errors.length) return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors });
    const payload = Object.fromEntries(['bookId','title','author','category','publisher','publishYear','isbn','quantity','description']
      .filter(k => Object.prototype.hasOwnProperty.call(req.body, k)).map(k => [k, req.body[k]]));
    const book = await Book.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) { errorResponse(err, res); }
});
app.delete('/api/books/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'ID không hợp lệ' });
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json({ message: 'Đã xóa sách' });
  } catch (err) { errorResponse(err, res); }
});
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ message: 'JSON không hợp lệ' });
  if (err.message?.startsWith('CORS:')) return res.status(403).json({ message: err.message });
  errorResponse(err, res);
});
if (!process.env.MONGODB_URI) { console.error('Thiếu biến MONGODB_URI'); process.exit(1); }
mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME, serverSelectionTimeoutMS: 12000 })
  .then(() => { console.log(`MongoDB connected to ${DB_NAME}`); app.listen(PORT, '0.0.0.0', () => console.log(`API listening on ${PORT}`)); })
  .catch(err => { console.error('Không kết nối MongoDB:', err.message); process.exit(1); });
