export default function DownloadsDemo(){
  const downloadClientCSV = ()=>{
    const csv = ["id,status","1,PAID","2,PENDING"].join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {href:url, download:"orders.csv"});
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const downloadFromServer = async ()=>{
    if (!window.USE_MSW) { alert("Activa MSW para XHR de /export.csv"); return; }
    const res = await fetch("/export.csv");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {href:url, download:"export.csv"});
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const uploadHiddenInput = (e)=>{
    const files = Array.from(e.target.files || []);
    alert("Subidos: " + files.map(f=>f.name).join(", "));
  };

  const onDrop = (e)=>{
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    alert("DnD: " + files.map(f=>f.name).join(", "));
  };

  return (
    <section>
      <h2>Descargas / Upload</h2>
      <div style={{display:"grid", gap:8}}>
        <button data-testid="dlCsv" onClick={downloadClientCSV}>Descargar CSV (cliente)</button>
        <button data-testid="dlBlob" onClick={downloadFromServer}>Descargar desde servidor (/export.csv)</button>

        <label style={{display:"inline-block"}}>
          <span>Upload (input oculto): </span>
          <input data-testid="upload" type="file" multiple style={{display:"none"}}
                 onChange={uploadHiddenInput} id="fileInput"/>
          <button onClick={()=>document.getElementById("fileInput").click()}>Seleccionar archivos…</button>
        </label>

        <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}
             data-testid="dropzone"
             style={{padding:16, border:"2px dashed #aaa", borderRadius:8}}>
          Arrastra y suelta archivos aquí
        </div>
      </div>
    </section>
  );
}
