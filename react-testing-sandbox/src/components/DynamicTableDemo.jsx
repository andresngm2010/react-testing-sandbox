import { useMemo, useState } from "react";

const initialRows = [
  {id:3, status:"PAID"},
  {id:1, status:"PENDING"},
  {id:2, status:"PAID"},
];

export default function DynamicTableDemo(){
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [asc, setAsc] = useState(true);

  const view = useMemo(()=>{
    const t = query.trim().toLowerCase();
    const filtered = rows.filter(r=> `${r.id} ${r.status}`.toLowerCase().includes(t));
    const sorted = [...filtered].sort((a,b)=> asc ? a.id-b.id : b.id-a.id);
    return sorted;
  },[rows, query, asc]);

  return (
    <section>
      <h2>Tabla dinámica</h2>
      <input data-testid="q" placeholder="Filtrar por texto" value={query} onChange={e=>setQuery(e.target.value)} />
      <button data-testid="sortId" onClick={()=>setAsc(!asc)}>Ordenar por ID ({asc?"ASC":"DESC"})</button>
      <table data-testid="orders-grid" border="1" style={{marginTop:8, width:"100%"}}>
        <thead><tr><th>ID</th><th>Status</th></tr></thead>
        <tbody>
          {view.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.status}</td></tr>)}
        </tbody>
      </table>
      <button onClick={()=>{
        // “Editar” ficticio: cambia el estado del id=2 para probar asserts y XHR si activas MSW
        setRows(rs => rs.map(r=> r.id===2 ? {...r, status: r.status==="PAID"?"PENDING":"PAID"} : r));
      }}>Toggle estado (id=2)</button>
    </section>
  );
}
