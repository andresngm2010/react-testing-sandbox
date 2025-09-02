export class UserCard extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.shadowRoot.innerHTML = `
      <style>
        .card{border:1px solid #ddd;padding:10px;border-radius:10px}
        .name{font-weight:600}
      </style>
      <div class="card">
        <div class="name" id="name">Cargando…</div>
        <button id="refresh">Actualizar</button>
      </div>`;
  }
  connectedCallback(){
    this.shadowRoot.getElementById("refresh")
      .addEventListener("click", ()=> this.load());
    this.load();
  }
  async load(){
    await new Promise(r=>setTimeout(r, 300)); // simula red
    const user = { name: "Andres Gomez" };
    this.shadowRoot.getElementById("name").textContent = user.name;
    this.dispatchEvent(new CustomEvent("user:loaded", {detail:user}));
  }
}
