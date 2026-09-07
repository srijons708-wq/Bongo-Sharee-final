import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PageHeader, StatusBadge } from '../components/admin/AdminUI.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { coupons as demoCoupons } from '../data/demo';

const emptyCoupon = { code: '', discountType: 'percentage', discountAmount: '', minOrder: '', maxDiscount: '', expiry: '', usageLimit: '', active: true };

export default function AdminCoupons() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState(demoCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyCoupon);

  const create = (e) => {
    e.preventDefault();
    setCoupons((prev) => [
      {
        ...form,
        id: `co${Date.now()}`,
        code: form.code.toUpperCase(),
        discountAmount: Number(form.discountAmount),
        minOrder: Number(form.minOrder || 0),
        maxDiscount: Number(form.maxDiscount || form.discountAmount),
        usageLimit: Number(form.usageLimit || 0),
        used: 0,
      },
      ...prev,
    ]);
    showToast('Coupon created');
    setModalOpen(false);
    setForm(emptyCoupon);
  };

  const toggleActive = (id) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const remove = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon deleted');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Promotions"
        title="Coupons"
        action={<Button size="sm" onClick={() => setModalOpen(true)}><Plus size={14} /> Create Coupon</Button>}
      />

      <div className="border border-ink/10 bg-warmwhite overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-ink/10">
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">Discount</th>
              <th className="px-5 py-3 font-medium">Min Order</th>
              <th className="px-5 py-3 font-medium">Usage</th>
              <th className="px-5 py-3 font-medium">Expiry</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 text-ink font-mono font-semibold">{c.code}</td>
                <td className="px-5 py-3 text-muted">
                  {c.discountType === 'percentage' ? `${c.discountAmount}%` : `$${c.discountAmount}`} (max ${c.maxDiscount})
                </td>
                <td className="px-5 py-3 text-muted">${c.minOrder}</td>
                <td className="px-5 py-3 text-muted">{c.used} / {c.usageLimit}</td>
                <td className="px-5 py-3 text-muted">{c.expiry}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleActive(c.id)}>
                    <StatusBadge status={c.active ? 'Active' : 'Inactive'} />
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(c.id)} aria-label="Delete" className="text-muted hover:text-burgundy"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Coupon">
        <form onSubmit={create} className="space-y-4">
          <label className="block">
            <span className="text-xs tracking-wide text-muted mb-1.5 block">Code</span>
            <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy uppercase" />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Discount Type</span>
              <select value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy bg-warmwhite">
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Discount Amount</span>
              <input required type="number" value={form.discountAmount} onChange={(e) => setForm((f) => ({ ...f, discountAmount: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Minimum Order ($)</span>
              <input type="number" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Maximum Discount ($)</span>
              <input type="number" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Expiry Date</span>
              <input type="date" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Usage Limit</span>
              <input type="number" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
          </div>
          <Button type="submit" className="w-full mt-2">Create Coupon</Button>
        </form>
      </Modal>
    </div>
  );
}
