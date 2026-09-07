import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader, StatusBadge } from '../components/admin/AdminUI.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { categories as demoCategories } from '../data/categories';

const emptyCategory = { name: '', slug: '', description: '', image: '', status: 'Active' };

export default function AdminCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState(demoCategories.map((c) => ({ ...c, status: 'Active' })));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCategory);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyCategory);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm(c);
    setModalOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form, slug } : c)));
      showToast('Category updated');
    } else {
      setCategories((prev) => [...prev, { ...form, slug, id: slug || `cat${Date.now()}` }]);
      showToast('Category created');
    }
    setModalOpen(false);
  };

  const remove = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        action={<Button size="sm" onClick={openNew}><Plus size={14} /> Add Category</Button>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c) => (
          <div key={c.id} className="border border-ink/10 bg-warmwhite overflow-hidden">
            <div className="aspect-[16/9] bg-ink/5">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-display text-lg">{c.name}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-xs text-muted line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <button onClick={() => openEdit(c)} className="flex items-center gap-1.5 text-xs text-ink hover:text-burgundy"><Pencil size={13} /> Edit</button>
                <button onClick={() => remove(c.id)} className="flex items-center gap-1.5 text-xs text-ink hover:text-burgundy"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={save} className="space-y-4">
          <label className="block">
            <span className="text-xs tracking-wide text-muted mb-1.5 block">Name</span>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          </label>
          <label className="block">
            <span className="text-xs tracking-wide text-muted mb-1.5 block">Slug (auto-generated if blank)</span>
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          </label>
          <label className="block">
            <span className="text-xs tracking-wide text-muted mb-1.5 block">Description</span>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          </label>
          <label className="block">
            <span className="text-xs tracking-wide text-muted mb-1.5 block">Image URL</span>
            <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          </label>
          <label className="block">
            <span className="text-xs tracking-wide text-muted mb-1.5 block">Status</span>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy bg-warmwhite">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <Button type="submit" className="w-full mt-2">{editingId ? 'Save Changes' : 'Create Category'}</Button>
        </form>
      </Modal>
    </div>
  );
}
