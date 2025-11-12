import { useEffect, useState } from "react";
import { listUsers } from "../lib/api";

export default function Members() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await listUsers();
    setRows(res?.items ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gold">Members</h2>
        <button onClick={load} className="btn-gold">Refresh</button>
      </div>
      <div className="overflow-x-auto border border-white/10 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>Username</Th><Th>Balance</Th><Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4 text-center text-gray-400" colSpan={3}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-4 text-center text-gray-400" colSpan={3}>No users.</td></tr>
            ) : rows.map(r => (
              <tr key={r.username} className="border-t border-white/5">
                <Td>{r.username}</Td>
                <Td>{formatIDR(r.balance)}</Td>
                <Td>{formatDate(r.created_at)}</Td>
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
