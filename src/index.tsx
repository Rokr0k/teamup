import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/nanum-gothic";
import "./index.scss";
import App from "./App";

const container = document.getElementById("root");
const root = container && createRoot(container);
root?.render(
  <>
    <App />
    <a href="https://github.com/Rokr0k/teamup" className="watermark">
      Rokr0k &copy; {new Date().getFullYear()}
    </a>
  </>
);
