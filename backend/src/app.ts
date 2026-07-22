import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { faultsRouter } from "./routes/faults.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/faults", faultsRouter);

// Serves the built frontend when present (after `npm run build`), so a
// single deployed process can serve both the API and the SPA on one
// origin. Absent in local dev, where the two run as separate processes.
const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDistPath = join(__dirname, "..", "..", "frontend", "dist");

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      next();
      return;
    }
    res.sendFile(join(frontendDistPath, "index.html"));
  });
}

// Anything under /api/* not handled above is a real 404, not the SPA shell.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});
