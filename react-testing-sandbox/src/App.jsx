import { Link, Route, Routes } from "react-router-dom";
import XhrAsyncDemo from "./components/XhrAsyncDemo";
import IframesDemo from "./components/IframesDemo";
import DynamicTableDemo from "./components/DynamicTableDemo";
import DownloadsDemo from "./components/DownloadsDemo";
import ShadowDomDemo from "./components/ShadowDomDemo";

export default function App() {
  return (
    <div style={{fontFamily:"system-ui", padding:16}}>
      <h1>React Testing Sandbox</h1>
      <nav style={{display:"grid", gap:8, marginBottom:16}}>
        <Link to="/xhr">XHR / Async</Link>
        <Link to="/iframes">Iframes</Link>
        <Link to="/table">Tabla dinámica</Link>
        <Link to="/files">Descargas / Upload</Link>
        <Link to="/shadow">Shadow DOM</Link>
      </nav>
      <Routes>
        <Route path="/" element={<p>Elige un módulo 👆</p>} />
        <Route path="/xhr" element={<XhrAsyncDemo />} />
        <Route path="/iframes" element={<IframesDemo />} />
        <Route path="/table" element={<DynamicTableDemo />} />
        <Route path="/files" element={<DownloadsDemo />} />
        <Route path="/shadow" element={<ShadowDomDemo />} />
      </Routes>
    </div>
  );
}
