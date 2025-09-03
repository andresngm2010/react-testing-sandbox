import { useMemo, useState } from "react";

const initialRows = [
  { id: 3, status: "PAID",    nombre: "", accion: "" },
  { id: 1, status: "PENDING", nombre: "", accion: "" },
  { id: 2, status: "PAID",    nombre: "", accion: "" },
];

export default function DynamicTableDemo() {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [asc, setAsc] = useState(true);
  const [nameInput, setNameInput] = useState("");

  // Vista filtrada + ordenada
  const view = useMemo(() => {
    const t = query.trim().toLowerCase();
    const filtered = rows.filter((r) =>
      `${r.id} ${r.status} ${r.nombre || ""}`.toLowerCase().includes(t)
    );
    const sorted = [...filtered].sort((a, b) => (asc ? a.id - b.id : b.id - a.id));
    return sorted;
  }, [rows, query, asc]);

  // Aplica el "nombre" a todas las filas que cumplan el filtro actual
  const applyNameToFiltered = () => {
    const t = query.trim().toLowerCase();
    setRows((rs) =>
      rs.map((r) => {
        const hayMatch = `${r.id} ${r.status} ${r.nombre || ""}`
          .toLowerCase()
          .includes(t);
        return hayMatch ? { ...r, nombre: nameInput } : r;
      })
    );
  };

  // Accion por fila (botón dentro de la tabla)
  const saludar = (id) => {
    const when = new Date().toLocaleTimeString();
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, accion: `Saludado ${when}` } : r))
    );
  };

  return (
    <section>
      <h2>Tabla dinámica</h2>

      {/* Filtro de filas */}
      <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
        <label>
          <span>Filtro (ID/Status/Nombre): </span>
          <input
            data-testid="q"
            placeholder="Filtrar por texto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        {/* Entrada del nombre + Enter */}
        <label>
          <span>Nombre para aplicar a filas filtradas: </span>
          <input
            data-testid="name-input"
            placeholder="Escribe un nombre y presiona Enter"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyNameToFiltered()}
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button data-testid="apply-name" onClick={applyNameToFiltered}>
            Aplicar nombre a filtrados (Enter)
          </button>
          <button
            data-testid="sortId"
            onClick={() => setAsc(!asc)}
          >
            Ordenar por ID ({asc ? "ASC" : "DESC"})
          </button>
        </div>
      </div>

      {/* Tabla */}
      <table data-testid="orders-grid" border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {view.map((r) => (
            <tr data-testid={`row-${r.id}`} key={r.id}>
              <td>{r.id}</td>
              <td>{r.status}</td>
              <td data-testid={`cell-nombre-${r.id}`}>{r.nombre || ""}</td>
              <td>
                <button
                  data-testid={`btn-saludar-${r.id}`}
                  onClick={() => saludar(r.id)}
                >
                  Saludar
                </button>
                <span
                  data-testid={`cell-accion-${r.id}`}
                  style={{ marginLeft: 8 }}
                >
                  {r.accion || "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ejemplo extra: toggle de estado por si lo necesitas */}
      <button
        style={{ marginTop: 8 }}
        onClick={() => {
          setRows((rs) =>
            rs.map((r) =>
              r.id === 2 ? { ...r, status: r.status === "PAID" ? "PENDING" : "PAID" } : r
            )
          );
        }}
      >
        Toggle estado (id=2)
      </button>
    </section>
  );
}
