import { useEffect, useRef, useState } from "react";

/**
 * CONFIGURA AQUÍ tus orígenes:
 * - PARENT_ORIGIN: el origen del padre (esta app React con Vite)
 * - CHILD_ORIGIN:  el origen donde sirves child.html (otro puerto/dominio)
 *
 * Con Vite por defecto suele ser:
 *   PARENT_ORIGIN = "http://localhost:5173"
 *   CHILD_ORIGIN  = "http://localhost:5174"
 */
const PARENT_ORIGIN = window.location.origin;            // p.ej. http://localhost:5173
const CHILD_ORIGIN  = "http://localhost:5174";           // ⚠️ ajusta si usas otro puerto/dominio

// Demo same-origin (se mantiene con srcDoc)
const sameOriginSrcDoc = `
<!doctype html><meta charset="utf-8">
<button id="ok">OK</button>
<p id="msg">Listo</p>
<script>
  document.getElementById("ok").addEventListener("click", ()=>{
    document.getElementById("msg").textContent="OK presionado";
  });
<\/script>`;

export default function IframesDemo(){
  // Same-origin iframe
  const localRef = useRef(null);

  // Cross-origin iframe
  const remoteRef = useRef(null);
  const [log, setLog] = useState("");

  // Click dentro del iframe same-origin (se accede al DOM sin postMessage)
  const clickInside = () => {
    const doc = localRef.current.contentWindow.document;
    doc.getElementById("ok").click();
  };

  // Envía un PING al hijo (cross-origin) usando postMessage
  const sendPing = () => {
    if (!remoteRef.current?.contentWindow) return;
    remoteRef.current.contentWindow.postMessage(
      { type: "PING", payload: "hola 👋" },
      CHILD_ORIGIN // 🔐 targetOrigin exacto
    );
    setLog((l) => l + "PING enviado\n");
  };

  useEffect(() => {
    // Establecer src del iframe remoto (cross-origin real)
    if (remoteRef.current) {
      remoteRef.current.src = `${CHILD_ORIGIN}/child.html`;
    }

    // Handler de mensajes recibidos desde el hijo
    const onMsg = (event) => {
      // 🔐 Seguridad: acepta solo mensajes del CHILD_ORIGIN esperado
      if (event.origin !== CHILD_ORIGIN) return;

      const data = event.data;
      if (data?.type === "PONG") {
        setLog((l) => l + "PONG recibido\n");
      } else {
        setLog((l) => l + `Mensaje recibido: ${JSON.stringify(data)}\n`);
      }
    };

    window.addEventListener("message", onMsg);

    // Enviar PING automático tras cargar el iframe
    const onLoad = () => sendPing();
    remoteRef.current?.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("message", onMsg);
      remoteRef.current?.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <h2>Iframes</h2>

      <h3>Same-origin</h3>
      <iframe
        title="Reporte local"
        ref={localRef}
        srcDoc={sameOriginSrcDoc}
        style={{ width: "100%", height: 120, border: "1px solid #ccc" }}
      />
      <button data-testid="press-inside" onClick={clickInside}>
        Presionar botón dentro del iframe
      </button>

      <h3 style={{ marginTop: 16 }}>Cross-origin (postMessage)</h3>
      <p style={{ margin: 0 }}>
        Padre: <code>{PARENT_ORIGIN}</code> → Hijo: <code>{CHILD_ORIGIN}</code>
      </p>
      <iframe
        title="Widget remoto"
        ref={remoteRef}
        style={{ width: "100%", height: 100, border: "1px solid #ccc", marginTop: 8 }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={sendPing}>Enviar PING</button>
      </div>
      <pre data-testid="log" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{log}</pre>
    </section>
  );
}
