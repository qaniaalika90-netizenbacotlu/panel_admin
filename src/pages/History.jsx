import { useEffect, useState } from "react";
import { listHistory } from "../lib/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const size = 20;

  const load = async (p = page) => {
    setLoading(true); setError("");
    try {
      const { data } = await listHistory({ type, status, page: p, size });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || p);
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [type, status]);

  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <div className="p-6">
      <h2 className="text-amber-300 text-xl mb-4">History</h2>

      <div className="flex gap-3 mb-4">
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="all">All</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
        <button className="btn" onClick={()=>load(1)}>Refresh</button>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading ? <div>Loading…</div> : (
        <>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Type</th><th>Ref</th><th>User</th><th>Amount</th><th>Status</th><th>Time</th></tr>
            </thead>
            <tbody>
              {items.map(it=>(
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.type}</td>
                  <td>{it.ref_id}</td>
                  <td>{it.username}</td>
                  <td>{it.amount.toLocaleString()}</td>
                  <td><span className={`badge ${it.status}`}>{it.status}</span></td>
                  <td>{new Date(it.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex items-center gap-3">
            <button className="btn" disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button className="btn" disabled={page>=totalPages} onClick={()=>load(page+1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
