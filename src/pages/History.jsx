// src/pages/History.jsx
import { useEffect, useState } from "react";
import { listHistory } from "../lib/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");      // '', 'deposit', 'withdraw'
  const [status, setStatus] = useState("");  // '', 'pending','approved','rejected'

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await listHistory({
        type: type || undefined,
        status: status || undefined,
        limit: 200,
      });
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [type, status]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-yellow-400">Transaction History</h2>
        <button onClick={fetchData} className="px-3 py-1 rounded bg-yellow-600/30 text-yellow-300 hover:bg-yellow-600/40">
          Refresh
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={type} onChange={e=>setType(e.target.value)} className="bg-neutral-900 text-gray-200 px-3 py-2 rounded">
          <option value="">All Type</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="bg-neutral-900 text-gray-200 px-3 py-2 rounded">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-[#0f172a] rounded-lg border border-white/5">
        <div className="grid grid-cols-6 text-sm px-4 py-2 border-b border-white/5 text-gray-400">
          <div>Type</div><div>User</div><div>Amount</div><div>Status</div><div>Time</div><div>ID</div>
        </div>
        {loading ? (
          <div className="p-6 text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-gray-400">No data.</div>
        ) : (
          items.map((x) => (
            <div key={`${x.type}-${x.id}`} className="grid grid-cols-6 px-4 py-2 border-b border-white/5 text-gray-200">
              <div className={x.type === "deposit" ? "text-emerald-300" : "text-cyan-300"}>{x.type}</div>
              <div>{x.username}</div>
              <div>{x.amount.toLocaleString()}</div>
              <div className={
                x.status === "approved" ? "text-emerald-400" :
                x.status === "rejected" ? "text-red-400" : "text-yellow-300"
              }>{x.status}</div>
              <div>{new Date(x.created_at).toLocaleString()}</div>
              <div>{x.id}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
