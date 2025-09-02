import { useEffect, useRef, useState } from "react";
import { UserCard } from "../web-components/UserCard";

if (!customElements.get("user-card")) {
  customElements.define("user-card", UserCard);
}

export default function ShadowDomDemo(){
  const ref = useRef(null);
  const [lastEvent, setLastEvent] = useState("");

  useEffect(()=>{
    const el = ref.current;
    const onLoaded = (e)=> setLastEvent("Cargado: " + e.detail.name);
    el.addEventListener("user:loaded", onLoaded);
    return ()=> el.removeEventListener("user:loaded", onLoaded);
  },[]);

  return (
    <section>
      <h2>Shadow DOM</h2>
      <user-card ref={ref} data-testid="user-card"></user-card>
      <div aria-live="polite" style={{marginTop:8}}>{lastEvent}</div>
    </section>
  );
}
