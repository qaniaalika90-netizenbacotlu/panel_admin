import { useState } from "react";
import { getHealth } from "../lib/api";

export default function Health() {
  const [result, setResult] = useState(null);

  const ping = async () => {
    const res = await getHealth();
    setResult(res);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-gold mb-4">API Health</h2>
      <button onClick={ping} className="btn-gold">Ping</button>
      <pre className="mt-4 bg-black/40 rounded-lg p-4 border border-white/10 text-sm">
        {JSON.stringify(result ?? { hint: "Klik Ping untuk cek /health" }, null, 2)}
      </pre>
    </section>
  );
}
