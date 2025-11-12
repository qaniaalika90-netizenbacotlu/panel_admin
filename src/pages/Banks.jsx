import { useEffect, useState } from "react";
import { listBanks, createBank, updateBank, deleteBank } from "../lib/api";

export default function Banks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ bank_name:"", account_name:"", account_number:"", is_active:true });
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await listBanks();
      setItems(data.items || []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBank(form);
      setForm({ bank_name:"", account_name:"", account_number:"", is_active:true });
      load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  const onToggle = async (it) => {
    try {
      await updateBank(it.id, { ...it, is_active: !it.is_active });
      load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete bank?")) return;
    try {
      await deleteBank(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-amber-300 text-xl mb-4">Banks</h2>

      <form onSubmit={onSubmit} className="mb-6 grid gap-2" style={{maxWidth:480}}>
        <input required placeholder="Bank name" className="input" value={form.bank_name}
               onChange={e=>setForm({...form, bank_name:e.target.value})}/>
        <input required placeholder="Account name" className="input" value={form.account_name}
               onChange={e=>setForm({...form, account_name:e.target.value})}/>
        <input required placeholder="Account number" className="input" value={form.account_number}
               onChange={e=>setForm({...form, account_number:e.target.value})}/>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active}
                 onChange={e=>setForm({...form, is_active:e.target.checked})}/>
          Active
        </label>
        <button className="btn">Add Bank</button>
      </form>

      {error && <div className="alert">{error}</div>}
      {loading ? <div>Loading…</div> : (
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Bank</th><th>Account</th><th>Number</th><th>Active</th><th>Action</th></tr>
          </thead>
          <tbody>
          {items.map(it=>(
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.bank_name}</td>
              <td>{it.account_name}</td>
              <td>{it.account_number}</td>
              <td><button className="chip" onClick={()=>onToggle(it)}>{it.is_active ? "yes":"no"}</button></td>
              <td><button className="btn-danger" onClick={()=>onDelete(it.id)}>Delete</button></td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
