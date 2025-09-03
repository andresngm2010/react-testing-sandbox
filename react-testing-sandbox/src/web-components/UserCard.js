export class UserCard extends HTMLElement {
  static get observedAttributes() { return ["name"]; }

  get name() { return this._name || ""; }
  set name(val) {
    this._name = (val ?? "").toString();
    this.#renderName();
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .card{border:1px solid #ddd;padding:10px;border-radius:10px}
        .name{font-weight:600}
        .row{display:flex;gap:8px;align-items:center;margin-top:8px}
        input{padding:6px 8px;border:1px solid #ccc;border-radius:8px;min-width:220px}
        button{padding:6px 10px;border:1px solid #ccc;border-radius:8px;cursor:pointer}
      </style>
      <div class="card">
        <div class="name" id="name" data-testid="uc-name" role="status" aria-live="polite">Cargando…</div>
        <div class="row">
          <input id="nameInput" data-testid="uc-name-input" placeholder="Escribe un nombre y presiona Enter" />
          <button id="refresh" data-testid="uc-refresh">Recargar</button>
        </div>
      </div>`;
  }

  connectedCallback() {
    // listeners
    const input = this.shadowRoot.getElementById("nameInput");
    const refreshBtn = this.shadowRoot.getElementById("refresh");

    // Enter -> aplicar nombre
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.#applyFromInput();
    });

    // Recargar (simula fetch y restaura)
    refreshBtn.addEventListener("click", () => this.load());

    // Si el atributo "name" ya viene definido, respétalo; si no, carga por defecto
    if (this.hasAttribute("name")) {
      this.name = this.getAttribute("name");
    } else {
      this.load();
    }
  }

  attributeChangedCallback(attr, _old, val) {
    if (attr === "name") this.name = val;
  }

  async load() {
    // Simula latencia de red
    await new Promise((r) => setTimeout(r, 300));
    const user = { name: "Andres Gomez" };
    this.name = user.name;
    this.dispatchEvent(new CustomEvent("user:loaded", { detail: user }));
  }

  // --------- privados ---------
  #applyFromInput() {
    const input = this.shadowRoot.getElementById("nameInput");
    const newName = input.value.trim();
    if (!newName) return;
    this.name = newName;
    // Limpia el input para facilitar validación de lectura
    input.value = "";
    // Evento para validar desde fuera del Shadow DOM
    this.dispatchEvent(new CustomEvent("user:updated", { detail: { name: this.name, source: "input" } }));
  }

  #renderName() {
    const nameEl = this.shadowRoot.getElementById("name");
    if (nameEl) nameEl.textContent = this.name || "—";
  }
}

