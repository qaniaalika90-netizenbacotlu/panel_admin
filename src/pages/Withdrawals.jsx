import { useEffect, useState } from "react";
import { listWithdrawals, approveWithdraw, rejectWithdraw } from "../lib/api";

export default function Withdrawals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await listWithdrawals();
    setRows(res?.items ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const doApprove = async (id) => { await approveWithdraw(id); load(); };
  const doReject  = async (id) => { await rejectWithdraw(id);  load(); };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gold">Withdrawals</h2>
        <button onClick={load} className="btn-gold">Refresh</button>
      </div>
      <div className="overflow-x-auto border border-white/10 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>ID</Th><Th>User</Th><Th>Amount</Th><Th>Status</Th><Th>Time</Th><Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4 text-center text-gray-400" colSpan={6}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-4 text-center text-gray-400" colSpan={6}>No data.</td></tr>
            ) : rows.map(r => (
              <tr key={r.id} className="border-t border-white/5">
                <Td>{r.id}</Td>
                <Td>{r.username}</Td>
                <Td>{formatIDR(r.amount)}</Td>
                <Td>
                  {r.status === "approved" && <span className="badge-green">approved</span>}
                  {r.status === "pending"  && <span className="badge-amber">pending</span>}
                  {r.status === "rejected" && <span className="badge-red">rejected</span>}
                </Td>
                <Td>{formatDate(r.created_at)}</Td>
                <Td className="text-right space-x-2">
                  <button className="btn-gold" onClick={() => doApprove(r.id)}>Approve</button>
                  <button className="btn-gold" onClick={() => doReject(r.id)}>Reject</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children, className="" }) {
  return <th className={`px-3 py-2 text-left font-semibold text-gray-300 ${className}`}>{children}</th>;
}
function Td({ children, className="" }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function formatIDR(x){ return new Intl.NumberFormat("id-ID").format(x||0); }
function formatDate(d){ return new Date(d).toLocaleString(); }
