import { useEffect, useState } from "react";

export default function XhrAsyncDemo() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // src/components/XhrAsyncDemo.jsx (fragmentos)
  function fetchWithTimeout(url, { timeout = 3000, ...opts } = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(url, { ...opts, signal: controller.signal })
      .finally(() => clearTimeout(id));
  }


  async function fetchOrders(status) {
    if (!window.USE_MSW) {
        // Demo local sin backend real
        await new Promise(r => setTimeout(r, 600));
        const data = [{id:1,status:"PAID"},{id:2,status:"PENDING"},{id:3,status:"PAID"}];
        return status ? data.filter(o=>o.status===status) : data;
    }

    // CLIENT TIMEOUT: 2.5s
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    // Puedes forzar escenarios desde la UI mientras pruebas:
    params.set("delay", "2000");      // tardará 4s (verás el timeout del cliente)
    // params.set("mode", "504");        // simula 504
    // params.set("mode", "error");      // simula error de red
    // params.set("mode", "hang");       // queda colgado (cliente aborta)

    const res = await fetchWithTimeout(`/api/orders?${params.toString()}`, { timeout: 2500 });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  async function load() {
    setLoading(true); setErr("");
    try {
      const s = status.trim().toUpperCase();
      const data = await fetchOrders(s);
      setOrders(data);
    } catch (e) {
      setErr("Error al cargar");
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); /* load initial */ },[]);

  return (
    <section>
      <h2>XHR / Async</h2>
      <label>
        Estado (PAID/PENDING):{" "}
        <input data-testid="filter" value={status} onChange={e=>setStatus(e.target.value)} onKeyDown={e=>e.key==="Enter" && load()} />
      </label>
      <button data-testid="btn-load" onClick={load}>Cargar</button>
      {!loading ? null : <div id="spinner" aria-live="polite">Cargando…</div>}
      {err && <div role="alert">{err}</div>}
      <ul data-testid="orders-list">
        {orders.map(o=> <li key={o.id}>Order #{o.id} - {o.status}</li>)}
      </ul>
    </section>
  );
}
