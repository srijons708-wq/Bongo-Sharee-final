import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { PageHeader, StatusBadge } from '../components/admin/AdminUI.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { products as demoProducts } from '../data/products';
import { categories as demoCategories } from '../data/categories';
import { productsApi, categoriesApi, adminProductsApi } from '../lib/api';

const emptyProduct = {
  name: '', slug: '', description: '', category: demoCategories[0]?.slug || '', price: '', comparePrice: '',
  sku: '', stock: '', fabric: '', color: '', sizes: 'Free Size', featured: false, isNew: false, onSale: false,
};

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(demoCategories);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => { Promise.all([productsApi.list({}), categoriesApi.list()]).then(([ps, cs]) => { setProducts(ps); setCategories(cs.length ? cs : demoCategories); }).catch(() => setProducts(demoProducts)).finally(() => setLoading(false)); }, []);

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      ...p,
      sizes: p.sizes.join(', '),
      sku: p.sku || `BS-${p.id.toUpperCase()}`,
    });
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : null, stock: Number(form.stock), sizes: form.sizes.split(',').map((x) => x.trim()).filter(Boolean), slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };
    try { const saved = await adminProductsApi.save(payload, editingId); const safeSaved = { ...saved, images: saved.images?.length ? saved.images : (editingId ? (products.find((p) => p.id === editingId)?.images || []) : ['https://images.unsplash.com/photo-1610030181087-540f829a4c2a?w=900&q=80']), rating: saved.rating ?? 0, reviewCount: saved.reviewCount ?? 0, has360: saved.has360 ?? false }; setProducts((prev) => editingId ? prev.map((p) => p.id === editingId ? { ...p, ...safeSaved } : p) : [safeSaved, ...prev]); setModalOpen(false); showToast(editingId ? 'Product updated' : 'Product created'); } catch (e) { showToast(e.message || 'Could not save product', 'error'); }
  };

  const remove = async (id) => { try { await adminProductsApi.remove(id); setProducts((prev) => prev.filter((p) => p.id !== id)); showToast('Product deleted'); } catch (e) { showToast(e.message || 'Could not delete product', 'error'); } };

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        action={
          <Button size="sm" onClick={openNew}>
            <Plus size={14} /> Add Product
          </Button>
        }
      />

      <div className="flex items-center gap-2 border border-ink/20 px-3 py-2 mb-6 max-w-sm bg-warmwhite">
        <Search size={15} className="text-muted shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU"
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      {loading && <p className="text-sm text-muted mb-4">Loading catalog…</p>}
      <div className="border border-ink/10 bg-warmwhite overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-ink/10">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-9 h-11 object-cover bg-ink/5 shrink-0" />
                    <span className="text-ink line-clamp-1 max-w-[220px]">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted capitalize">{p.category.replace('-', ' ')}</td>
                <td className="px-5 py-3 text-ink">${p.price}</td>
                <td className="px-5 py-3">
                  <span className={p.stock <= 5 ? 'text-burgundy font-semibold' : 'text-ink'}>{p.stock}</span>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.stock > 0 ? 'Active' : 'Inactive'} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(p)} aria-label="Edit" className="text-muted hover:text-burgundy"><Pencil size={15} /></button>
                    <button onClick={() => remove(p.id)} aria-label="Delete" className="text-muted hover:text-burgundy"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No products match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <LabeledInput label="Name" required value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <LabeledInput label="SKU" value={form.sku} onChange={(v) => setForm((f) => ({ ...f, sku: v }))} />
          </div>
          <LabeledTextarea label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy bg-warmwhite"
              >
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <LabeledInput label="Price ($)" type="number" required value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
            <LabeledInput label="Compare Price ($)" type="number" value={form.comparePrice} onChange={(v) => setForm((f) => ({ ...f, comparePrice: v }))} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <LabeledInput label="Fabric" value={form.fabric} onChange={(v) => setForm((f) => ({ ...f, fabric: v }))} />
            <LabeledInput label="Color" value={form.color} onChange={(v) => setForm((f) => ({ ...f, color: v }))} />
            <LabeledInput label="Stock" type="number" required value={form.stock} onChange={(v) => setForm((f) => ({ ...f, stock: v }))} />
          </div>
          <LabeledInput label="Sizes (comma-separated)" value={form.sizes} onChange={(v) => setForm((f) => ({ ...f, sizes: v }))} />
          <div className="flex flex-wrap gap-6 pt-1">
            <Checkbox label="Featured" checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
            <Checkbox label="New Arrival" checked={form.isNew} onChange={(v) => setForm((f) => ({ ...f, isNew: v }))} />
            <Checkbox label="On Sale" checked={form.onSale} onChange={(v) => setForm((f) => ({ ...f, onSale: v }))} />
          </div>
          <Button type="submit" className="w-full mt-2">{editingId ? 'Save Changes' : 'Create Product'}</Button>
        </form>
      </Modal>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide text-muted mb-1.5 block">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy"
      />
    </label>
  );
}

function LabeledTextarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide text-muted mb-1.5 block">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy"
      />
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-burgundy" />
      {label}
    </label>
  );
}
