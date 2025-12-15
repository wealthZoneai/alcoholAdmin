import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // 🔹 Default style for all toasts
            style: {
              background: "#1e293b", // dark slate background
              color: "#fff",
              borderRadius: "10px",
              padding: "12px 16px",
              fontWeight: 500,
            },
            // 🔹 Success toast style
            success: {
              style: {
                background: "#16a34a", // green-600
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#16a34a",
              },
            },
            // 🔹 Error toast style
            error: {
              style: {
                background: "#dc2626", // red-600
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#dc2626",
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
