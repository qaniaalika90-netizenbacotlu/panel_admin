// src/pages/Banks.jsx
import { useEffect, useState } from "react";
import { listBanks, createBank, updateBank, deleteBank } from "../lib/api";

const emptyForm = {
  name: "", account_name: "", account_number: "",
  method_type: "bank", status: "active",
};

export default function Banks() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listBanks();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createBank(form);
      setForm(emptyForm);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const saveRow = async (row) => {
    try {
      await updateBank(row.id, row);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this bank?")) return;
    try {
      await deleteBank(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl text-yellow-400 mb-4">Banks / Payment Channels</h2>

      {/* Add form */}
      <form onSubmit={submit} className="bg-[#0f172a] border border-white/5 rounded-lg p-4 mb-6 grid grid-cols-6 gap-3">
        <input className="bg-neutral-900 text-gray-200 px-3 py-2 rounded" placeholder="Name (e.g. BCA / OVO)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="bg-neutral-900 text-gray-200 px-3 py-2 rounded" placeholder="Account name" value={form.account_name} onChange={e=>setForm({...form,account_name:e.target.value})}/>
        <input className="bg-neutral-900 text-gray-200 px-3 py-2 rounded" placeholder="Account number" value={form.account_number} onChange={e=>setForm({...form,account_number:e.target.value})}/>
        <select className="bg-neutral-900 text-gray-200 px-3 py-2 rounded" value={form.method_type} onChange={e=>setForm({...form,method_type:e.target.value})}>
          <option value="bank">Bank</option>
          <option value="ewallet">E-Wallet</option>
          <option value="va">Virtual Account</option>
        </select>
        <select className="bg-neutral-900 text-gray-200 px-3 py-2 rounded" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button disabled={saving} className="px-3 py-2 rounded bg-yellow-600/30 text-yellow-300 hover:bg-yellow-600/40">
          {saving ? "Saving..." : "Add"}
        </button>
      </form>

      {/* List */}
      <div className="bg-[#0f172a] rounded-lg border border-white/5">
        <div className="grid grid-cols-8 text-sm px-4 py-2 border-b border-white/5 text-gray-400">
          <div>ID</div><div>Name</div><div>Acc Name</div><div>Acc No</div><div>Type</div><div>Status</div><div>Updated</div><div>Action</div>
        </div>
        {loading ? (
          <div className="p-6 text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-gray-400">No data.</div>
        ) : (
          items.map((row) => (
            <Row key={row.id} row={row} onSave={saveRow} onDelete={remove} />
          ))
        )}
      </div>
    </div>
  );
}

function Row({ row, onSave, onDelete }) {
  const [edit, setEdit] = useState(row);
  return (
    <div className="grid grid-cols-8 px-4 py-2 border-b border-white/5 text-gray-200">
      <div>{row.id}</div>
      <input className="bg-neutral-900 text-gray-200 px-2 py-1 rounded" value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})}/>
      <input className="bg-neutral-900 text-gray-200 px-2 py-1 rounded" value={edit.account_name} onChange={e=>setEdit({...edit,account_name:e.target.value})}/>
      <input className="bg-neutral-900 text-gray-200 px-2 py-1 rounded" value={edit.account_number} onChange={e=>setEdit({...edit,account_number:e.target.value})}/>
      <select className="bg-neutral-900 text-gray-200 px-2 py-1 rounded" value={edit.method_type} onChange={e=>setEdit({...edit,method_type:e.target.value})}>
        <option value="bank">Bank</option>
        <option value="ewallet">E-Wallet</option>
        <option value="va">VA</option>
      </select>
      <select className="bg-neutral-900 text-gray-200 px-2 py-1 rounded" value={edit.status} onChange={e=>setEdit({...edit,status:e.target.value})}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div>{new Date(row.updated_at).toLocaleString()}</div>
      <div className="flex gap-2">
        <button onClick={()=>onSave(edit)} className="px-2 py-1 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40">Save</button>
        <button onClick={()=>onDelete(row.id)} className="px-2 py-1 rounded bg-red-600/30 text-red-300 hover:bg-red-600/40">Delete</button>
      </div>
    </div>
  );
}
