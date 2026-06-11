import { useEffect, useMemo, useState } from "react";
import { apiRequest, clearToken, getToken, imageUrl, setToken } from "./api";

const initialForm = { id: "", nama: "", kategori: "", image: null };

export default function App() {
  const [view, setView] = useState("catalog");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [adminItems, setAdminItems] = useState([]);
  const [adminPage, setAdminPage] = useState(1);
  const [adminLimit, setAdminLimit] = useState(10);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Memuat barang...");
  const [adminStatus, setAdminStatus] = useState("");
  const [token, updateToken] = useState(getToken());
  const [login, setLogin] = useState({ username: "", password: "" });
  const [form, setForm] = useState(initialForm);

  const selectedItem = useMemo(() => {
    return adminItems.find((item) => String(item.id) === String(form.id)) || items.find((item) => String(item.id) === String(form.id));
  }, [adminItems, form.id, items]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter((item) => {
      return item.nama.toLowerCase().includes(normalized) || item.kategori.toLowerCase().includes(normalized);
    });
  }, [items, query]);

  async function loadItems() {
    setStatus("Memuat barang...");

    try {
      const params = new URLSearchParams({ page, limit });
      const result = await apiRequest(`/api/view/item?${params}`);
      setItems(result.data.items || []);
      setTotalPages(result.data.pagination?.totalPages || 1);
      setStatus("");
    } catch (error) {
      setStatus(error.message);
      setItems([]);
    }
  }

  async function loadAdminItems() {
    if (!getToken()) return;
    setAdminStatus((current) => current || "Memuat barang admin...");

    try {
      const params = new URLSearchParams({ page: adminPage, limit: adminLimit });
      const result = await apiRequest(`/api/admin/item?${params}`);
      setAdminItems(result.data.items || []);
      setAdminTotalPages(result.data.pagination?.totalPages || 1);
      setAdminStatus("");
    } catch (error) {
      setAdminStatus(error.message);
      setAdminItems([]);
    }
  }

  useEffect(() => {
    loadItems();
  }, [page, limit]);

  useEffect(() => {
    loadAdminItems();
  }, [adminPage, adminLimit, token]);

  async function handleLogin(event) {
    event.preventDefault();
    setAdminStatus("Masuk...");

    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      setToken(result.token);
      updateToken(result.token);
      setLogin({ username: "", password: "" });
      setAdminStatus("");
      setAdminPage(1);
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  function handleLogout() {
    clearToken();
    updateToken("");
    setForm(initialForm);
    setAdminItems([]);
    setAdminStatus("");
    setView("admin");
  }

  function editItem(item) {
    setForm({ id: item.id, nama: item.nama, kategori: item.kategori, image: null });
    setAdminStatus("");
    setView("edit");
  }

  async function deleteItem(item) {
    if (!window.confirm(`Hapus ${item.nama}?`)) return;
    setAdminStatus("Menghapus...");

    try {
      await apiRequest(`/api/admin/item/${item.id}`, { method: "DELETE" });
      setAdminStatus("Barang dihapus.");
      await loadItems();
      await loadAdminItems();
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  async function saveItem(event) {
    event.preventDefault();
    setAdminStatus("Menyimpan...");

    const body = new FormData();
    body.append("nama", form.nama);
    body.append("kategori", form.kategori);
    if (form.image) body.append("image", form.image);

    try {
      await apiRequest(form.id ? `/api/admin/item/${form.id}` : "/api/admin/item", {
        method: form.id ? "PUT" : "POST",
        body,
      });

      const isEditing = Boolean(form.id);
      setAdminStatus(isEditing ? "Barang diperbarui." : "Barang ditambahkan.");
      setForm(initialForm);
      await loadItems();
      await loadAdminItems();
      if (isEditing) setView("admin");
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Katalog Warung</p>
          <h1>Daftar Barang</h1>
        </div>
        <nav className="tabs" aria-label="Tampilan">
          <button className={view === "catalog" ? "active" : ""} onClick={() => setView("catalog")} type="button">
            Katalog
          </button>
          <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")} type="button">
            Admin
          </button>
          {form.id && (
            <button className={view === "edit" ? "active" : ""} onClick={() => setView("edit")} type="button">
              Edit Barang
            </button>
          )}
        </nav>
      </header>

      <main>
        {view === "catalog" && (
          <CatalogView
            items={filteredItems}
            page={page}
            totalPages={totalPages}
            limit={limit}
            query={query}
            status={status}
            onQuery={setQuery}
            onLimit={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
            onPrev={() => setPage((current) => Math.max(1, current - 1))}
            onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
          />
        )}

        {view === "admin" && (
          <AdminView
            token={token}
            login={login}
            form={form}
            items={adminItems}
            page={adminPage}
            totalPages={adminTotalPages}
            limit={adminLimit}
            status={adminStatus}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onLoginChange={setLogin}
            onFormChange={setForm}
            onSave={saveItem}
            onCancel={() => setForm(initialForm)}
            onEdit={editItem}
            onDelete={deleteItem}
            onLimit={(value) => {
              setAdminLimit(Number(value));
              setAdminPage(1);
            }}
            onPrev={() => setAdminPage((current) => Math.max(1, current - 1))}
            onNext={() => setAdminPage((current) => Math.min(adminTotalPages, current + 1))}
          />
        )}

        {view === "edit" && (
          <EditItemView
            form={form}
            item={selectedItem}
            status={adminStatus}
            onFormChange={setForm}
            onSave={saveItem}
            onCancel={() => {
              setForm(initialForm);
              setAdminStatus("");
              setView("admin");
            }}
          />
        )}
      </main>
    </>
  );
}

function CatalogView({ items, page, totalPages, limit, query, status, onQuery, onLimit, onPrev, onNext }) {
  return (
    <section>
      <div className="toolbar" aria-label="Kontrol katalog">
        <label className="search">
          <span>Cari</span>
          <input value={query} onChange={(event) => onQuery(event.target.value)} type="search" placeholder="Nama atau kategori" />
        </label>
        <label>
          <span>Per halaman</span>
          <select value={limit} onChange={(event) => onLimit(event.target.value)}>
            <option value="6">6</option>
            <option value="10">10</option>
            <option value="18">18</option>
          </select>
        </label>
      </div>

      <div className="status" role="status">
        {status || `${items.length} barang ditampilkan`}
      </div>

      <div className="items-grid" aria-live="polite">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className="pager" aria-label="Navigasi halaman">
        <button onClick={onPrev} disabled={page <= 1} type="button">Sebelumnya</button>
        <span>Halaman {page} dari {totalPages}</span>
        <button onClick={onNext} disabled={page >= totalPages} type="button">Berikutnya</button>
      </div>
    </section>
  );
}

function ItemCard({ item }) {
  return (
    <article className="item-card">
      <div className="item-image">
        {item.img_address ? <img src={imageUrl(item.img_address)} alt={item.nama} /> : <span>{item.nama.slice(0, 2).toUpperCase()}</span>}
      </div>
      <div className="item-body">
        <p className="item-category">{item.kategori}</p>
        <h3>{item.nama}</h3>
        <time>Diperbarui {item.updated_at}</time>
      </div>
    </article>
  );
}

function AdminView({
  token,
  login,
  form,
  items,
  page,
  totalPages,
  limit,
  status,
  onLogin,
  onLogout,
  onLoginChange,
  onFormChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onLimit,
  onPrev,
  onNext,
}) {
  if (!token) {
    return (
      <section className="admin-view">
        <form className="panel login-panel" onSubmit={onLogin}>
          <div>
            <h2>Masuk Admin</h2>
            <p>Kelola barang memakai akun admin API.</p>
          </div>
          <label>
            <span>Username</span>
            <input value={login.username} onChange={(event) => onLoginChange({ ...login, username: event.target.value })} autoComplete="username" required />
          </label>
          <label>
            <span>Password</span>
            <input value={login.password} onChange={(event) => onLoginChange({ ...login, password: event.target.value })} type="password" autoComplete="current-password" required />
          </label>
          <button className="primary" type="submit">Masuk</button>
          {status && <div className="status" role="status">{status}</div>}
        </form>
      </section>
    );
  }

  return (
    <section className="admin-view">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Kelola Barang</h2>
        </div>
        <button onClick={onLogout} type="button">Keluar</button>
      </div>

      <form className="panel item-form" onSubmit={onSave}>
        <label>
          <span>Nama</span>
          <input value={form.nama} onChange={(event) => onFormChange({ ...form, nama: event.target.value })} minLength="3" required />
        </label>
        <label>
          <span>Kategori</span>
          <input value={form.kategori} onChange={(event) => onFormChange({ ...form, kategori: event.target.value })} minLength="3" required />
        </label>
        <label className="file-field">
          <span>Gambar</span>
          <input onChange={(event) => onFormChange({ ...form, image: event.target.files[0] || null })} type="file" accept="image/*" />
        </label>
        <div className="form-actions">
          <button className="primary" type="submit">Simpan</button>
          {form.id && <button onClick={onCancel} type="button">Batal</button>}
        </div>
      </form>

      <div className="status" role="status">{status}</div>
      <div className="admin-tools">
        <label>
          <span>Item admin per halaman</span>
          <select value={limit} onChange={(event) => onLimit(event.target.value)}>
            <option value="6">6</option>
            <option value="10">10</option>
            <option value="18">18</option>
          </select>
        </label>
      </div>
      <div className="admin-list">
        {items.map((item) => (
          <article className="admin-row" key={item.id}>
            {item.img_address ? <img className="admin-thumb" src={imageUrl(item.img_address)} alt={item.nama} /> : <div className="admin-thumb" aria-hidden="true" />}
            <div>
              <h3>{item.nama}</h3>
              <p>{item.kategori} - {item.updated_at}</p>
            </div>
            <div className="row-actions">
              <button onClick={() => onEdit(item)} type="button">Edit</button>
              <button className="danger" onClick={() => onDelete(item)} type="button">Hapus</button>
            </div>
          </article>
        ))}
      </div>
      <div className="pager" aria-label="Navigasi halaman admin">
        <button onClick={onPrev} disabled={page <= 1} type="button">Sebelumnya</button>
        <span>Halaman {page} dari {totalPages}</span>
        <button onClick={onNext} disabled={page >= totalPages} type="button">Berikutnya</button>
      </div>
    </section>
  );
}

function EditItemView({ form, item, status, onFormChange, onSave, onCancel }) {
  if (!form.id) {
    return (
      <section className="admin-view">
        <div className="detail-head">
          <div>
            <p className="eyebrow">Edit Barang</p>
            <h2>Belum ada barang dipilih</h2>
          </div>
          <button onClick={onCancel} type="button">Kembali</button>
        </div>
      </section>
    );
  }

  return (
    <section className="edit-view">
      <div className="detail-head">
        <div>
          <p className="eyebrow">Edit Barang</p>
          <h2>{item?.nama || form.nama}</h2>
        </div>
        <button onClick={onCancel} type="button">Kembali ke Admin</button>
      </div>

      <div className="edit-layout">
        <aside className="panel detail-panel">
          <div className="detail-preview">
            {item?.img_address ? <img src={imageUrl(item.img_address)} alt={item.nama} /> : <span>{form.nama.slice(0, 2).toUpperCase()}</span>}
          </div>
          <dl className="detail-list">
            <div>
              <dt>ID</dt>
              <dd>{form.id}</dd>
            </div>
            <div>
              <dt>Kategori sekarang</dt>
              <dd>{item?.kategori || form.kategori}</dd>
            </div>
            <div>
              <dt>Terakhir diperbarui</dt>
              <dd>{item?.updated_at || "-"}</dd>
            </div>
            <div>
              <dt>File gambar</dt>
              <dd>{item?.img_address || "Belum ada gambar"}</dd>
            </div>
          </dl>
        </aside>

        <form className="panel edit-form" onSubmit={onSave}>
          <label>
            <span>Nama barang</span>
            <input value={form.nama} onChange={(event) => onFormChange({ ...form, nama: event.target.value })} minLength="3" required />
          </label>
          <label>
            <span>Kategori</span>
            <input value={form.kategori} onChange={(event) => onFormChange({ ...form, kategori: event.target.value })} minLength="3" required />
          </label>
          <label className="file-field">
            <span>Ganti gambar</span>
            <input onChange={(event) => onFormChange({ ...form, image: event.target.files[0] || null })} type="file" accept="image/*" />
          </label>
          <div className="status" role="status">{status}</div>
          <div className="form-actions">
            <button className="primary" type="submit">Simpan Perubahan</button>
            <button onClick={onCancel} type="button">Batal</button>
          </div>
        </form>
      </div>
    </section>
  );
}
