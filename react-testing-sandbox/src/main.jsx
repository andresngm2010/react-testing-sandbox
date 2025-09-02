// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

async function start() {
  if (import.meta.env.DEV && window.USE_MSW) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      serviceWorker: { url: "/mockServiceWorker.js" }, // <- importante
      onUnhandledRequest: "bypass", // opcional: evita ruido en consola
    });
  }
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
start();

