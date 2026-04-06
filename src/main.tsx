import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("CRITICAL RUNTIME ERROR:", error);
  // Optional: add a simple fallback UI in case of total failure
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444; font-family: sans-serif;">
      <h2>System Initialisation Failure</h2>
      <p>A fatal error occurred during bootstrap. Please check the console for details.</p>
    </div>`;
  }
}
