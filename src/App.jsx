import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("health");
  const [loading, setLoading] = useState(false);
  const [healthResult, setHealthResult] = useState(null);
  const [loginError, setLoginError] = useState("");

  // Cek token di localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    const form = new FormData(e.target);
    const body = {
      username: form.get("username"),
      password: form.get("password"),
    };

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data?.error || "Login gagal");
        return;
      }

      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
      } else {
        setLoginError("Token tidak ditemukan di response");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setToken(null);
    setPage("health");
  }

  async function pingHealth() {
    setLoading(true);
    setHealthResult(null);
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      setHealthResult(data);
    } catch (err) {
      setHealthResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  // ========= RENDER ===========

  if (!token) {
    // Belum login → tampilkan halaman login
    return (
      <div style={styles.full}>
        <div style={styles.loginCard}>
          <h2 style={{ marginBottom: 16 }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label>Username</label>
              <input name="username" defaultValue="admin" style={styles.input} />
            </div>
            <div>
              <label>Password</label>
              <input
                name="password"
                type="password"
                defaultValue="Adminna123"
                style={styles.input}
              />
            </div>

            {loginError && (
              <div style={{ color: "#ff6b6b", fontSize: 14 }}>{loginError}</div>
            )}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Sudah login → tampilkan dashboard sederhana
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <span style={{ fontWeight: "bold" }}>Admin Panel</span>{" "}
          <span style={{ fontSize: 12, opacity: 0.7 }}>v0.1</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <nav style={styles.nav}>
        {["health", "deposits", "withdrawals", "members", "history", "banks"].map(
          (key) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              style={{
                ...styles.navBtn,
                ...(page === key ? styles.navBtnActive : {}),
              }}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          )
        )}
      </nav>

      <main style={styles.main}>
        {page === "health" && (
          <section>
            <h2>API Health</h2>
            <p>Ping</p>
            <button onClick={pingHealth} style={styles.button} disabled={loading}>
              {loading ? "Checking..." : "Ping /health"}
            </button>
            {healthResult && (
              <pre style={styles.pre}>{JSON.stringify(healthResult, null, 2)}</pre>
            )}
          </section>
        )}

        {page !== "health" && (
          <section>
            <h2 style={{ textTransform: "capitalize" }}>{page}</h2>
            <p>Halaman ini belum di-implementasi. Nanti bisa diisi data asli.</p>
          </section>
        )}
      </main>

      <footer style={styles.footer}>© 2025 — Admin Panel</footer>
    </div>
  );
}

const styles = {
  full: {
    minHeight: "100vh",
    background: "#050816",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  loginCard: {
    background: "#111827",
    padding: 24,
    borderRadius: 12,
    width: 320,
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  input: {
    width: "100%",
    marginTop: 4,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #374151",
    background: "#020617",
    color: "#e5e7eb",
  },
  button: {
    marginTop: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "none",
    background: "#fbbf24",
    color: "#111827",
    fontWeight: 600,
    cursor: "pointer",
  },
  app: {
    minHeight: "100vh",
    background: "#020617",
    color: "#e5e7eb",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "12px 24px",
    borderBottom: "1px solid #111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #4b5563",
    background: "transparent",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: 12,
  },
  nav: {
    padding: "8px 24px",
    display: "flex",
    gap: 8,
    borderBottom: "1px solid #111827",
  },
  navBtn: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "none",
    background: "#111827",
    color: "#9ca3af",
    fontSize: 13,
    cursor: "pointer",
  },
  navBtnActive: {
    background: "#fbbf24",
    color: "#111827",
    fontWeight: 600,
  },
  main: {
    flex: 1,
    padding: "24px",
  },
  pre: {
    marginTop: 16,
    padding: 16,
    background: "#020617",
    borderRadius: 8,
    fontSize: 13,
    overflowX: "auto",
  },
  footer: {
    padding: "12px 24px",
    borderTop: "1px solid #111827",
    fontSize: 12,
    opacity: 0.6,
  },
};

export default App;
