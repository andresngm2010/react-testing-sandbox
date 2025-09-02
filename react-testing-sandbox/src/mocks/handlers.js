import { http, HttpResponse, delay } from "msw";

const ORDERS = [
  {id:1,status:"PAID"},
  {id:2,status:"PENDING"},
  {id:3,status:"PAID"},
];

export const handlers = [
  http.get("/api/orders", async ({ request }) => {
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode"); // "504" | "error" | "hang"
    const ms = Number(url.searchParams.get("delay") || "0");
    if (ms > 0) await delay(ms);

    if (mode === "504") {
      return new HttpResponse("Gateway Timeout", { status: 504 });
    }
    if (mode === "error") {
      // Simula caída de red
      return HttpResponse.error();
    }
    if (mode === "hang") {
      // Deja la request “colgada” para que el cliente haga timeout por su cuenta
      // (equivalente a delay infinito)
      await new Promise(() => {}); // nunca resuelve
    }

    // Respuesta normal
    const status = (url.searchParams.get("status") || "").toUpperCase();
    const data = status ? ORDERS.filter(o => o.status === status) : ORDERS;
    return HttpResponse.json(data);
  }),
  http.get("/export.csv", ()=>{
    const csv = ["id,status", ...ORDERS.map(o=>`${o.id},${o.status}`)].join("\n");
    return new HttpResponse(csv, { headers: { "Content-Type":"text/csv" } });
  }),
  http.post("/upload", async ({ request })=>{
    // Aquí podrías leer FormData si quisieras validar
    return HttpResponse.json({ ok:true });
  })
];
