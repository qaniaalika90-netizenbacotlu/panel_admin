import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE; // = https://panel-api-backend.onrender.com

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Adminna123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login gagal");
      }

      // simpan token ke localStorage
      localStorage.setItem("admin_token", data.token);

      // redirect ke halaman utama panel
      navigate("/health", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="w-full max-w-sm bg-slate-800 p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4 text-center text-amber-400">
          Admin Login
        </h1>

        {error && (
          <div className="mb-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm disabled:opacity-60"
          >
            {loading ? "Login..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
