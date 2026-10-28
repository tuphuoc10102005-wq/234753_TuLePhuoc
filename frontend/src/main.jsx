import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
const blank = { bookId:'', title:'', author:'', category:'', publisher:'', publishYear:new Date().getFullYear(), isbn:'', quantity:0, description:'' };
const FIELDS = [['bookId','Mã sách'],['title','Tên sách'],['author','Tác giả'],['category','Thể loại'],['publisher','Nhà xuất bản'],['publishYear','Năm xuất bản'],['isbn','ISBN'],['quantity','Số lượng'],['description','Mô tả']];
function App() {
  const [books,setBooks] = useState([]), [search,setSearch] = useState(''), [loading,setLoading] = useState(true);
  const [message,setMessage] = useState(''), [error,setError] = useState('');
  const [editing,setEditing] = useState(null), [detail,setDetail] = useState(null), [form,setForm] = useState(blank);
  const load = async (query='') => {
    setLoading(true); setError('');
    try { const r=await fetch(`/api/books?search=${encodeURIComponent(query)}`); const d=await r.json(); if (!r.ok) throw new Error(d.message); setBooks(d); }
    catch(e) { setError('Không tải được sách: '+e.message); } finally { setLoading(false); }
  };
  useEffect(()=>{ const t=setTimeout(()=>load(search),300);return ()=>clearTimeout(t);},[search]);
  const openAdd=()=>{setForm({...blank});setEditing('new');setMessage('');setError('');};
  const openEdit=(b)=>{setForm({...b});setEditing(b._id);setMessage('');setError('');};
  const save=async(e)=>{
    e.preventDefault();setError('');setMessage('');
    try { const r=await fetch(editing==='new'?'/api/books':`/api/books/${editing}`, {method:editing==='new'?'POST':'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,quantity:Number(form.quantity),publishYear:Number(form.publishYear)})});
      const d=await r.json();if(!r.ok)throw new Error(d.errors?.join('; ')||d.message);setEditing(null);setMessage(editing==='new'?'Thêm sách thành công':'Cập nhật sách thành công');await load(search);
    }catch(e){setError(e.message);}
  };
  const remove=async(b)=>{if(!window.confirm(`Xóa sách "${b.title}"?`))return;
    try{const r=await fetch(`/api/books/${b._id}`,{method:'DELETE'});const d=await r.json();if(!r.ok)throw new Error(d.message);setMessage('Đã xóa sách');setError('');await load(search);}
    catch(e){setError(e.message);}
  };
  return <main><header><div><small>ĐIỆN TOÁN ĐÁM MÂY - MSSV 234753</small><h1> Hệ thống quản lý sách</h1><p>Sinh viên: TuLePhuoc</p></div><button onClick={openAdd}>+ Thêm sách</button></header>
  <section className="panel"><div className="toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔎 Tìm theo tên, tác giả, thể loại..."/><span>{books.length} cuốn sách</span></div>
  {message&&<p className="success">{message}</p>}{error&&<p className="error">{error}</p>}
  {loading?<p>Đang tải dữ liệu...</p>:<div className="scroll"><table><thead><tr><th>Mã sách</th><th>Tên sách</th><th>Tác giả</th><th>Thể loại</th><th>Số lượng</th><th>Thao tác</th></tr></thead><tbody>{books.map(b=><tr key={b._id}><td>{b.bookId}</td><td><strong>{b.title}</strong></td><td>{b.author}</td><td>{b.category}</td><td>{b.quantity}</td><td className="actions"><button onClick={()=>setDetail(b)}>Xem</button><button onClick={()=>openEdit(b)}>Sửa</button><button className="danger" onClick={()=>remove(b)}>Xóa</button></td></tr>)}{!books.length&&<tr><td colSpan="6">Chưa có sách nào</td></tr>}</tbody></table></div>}</section>
  {detail&&<div className="overlay" onClick={()=>setDetail(null)}><section className="modal" onClick={e=>e.stopPropagation()}><h2>Chi tiết sách</h2>{FIELDS.map(([k,label])=><p key={k}><strong>{label}:</strong> {detail[k]}</p>)}<button onClick={()=>setDetail(null)}>Đóng</button></section></div>}
  {editing&&<div className="overlay" onClick={()=>setEditing(null)}><section className="modal" onClick={e=>e.stopPropagation()}><h2>{editing==='new'?'Thêm sách mới':'Chỉnh sửa sách'}</h2><form onSubmit={save}>{FIELDS.map(([k,label])=><label key={k}>{label}{k==='description'?<textarea value={form[k]??''} onChange={e=>setForm({...form,[k]:e.target.value})}/>:<input type={['publishYear','quantity'].includes(k)?'number':'text'} required={k!=='description'} min={k==='quantity'?0:undefined} value={form[k]??''} onChange={e=>setForm({...form,[k]:e.target.value})}/>}</label>)}<div className="buttons"><button type="button" className="secondary" onClick={()=>setEditing(null)}>Hủy</button><button type="submit">Lưu sách</button></div></form></section></div>}</main>;
}
createRoot(document.getElementById('root')).render(<App/>);
