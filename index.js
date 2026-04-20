import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { db_connect } from "./utils/db.js";
import indexRoutes from "./index.routes.js";

dotenv.config();

const app = express();
const sql = db_connect();

// 🔗 hacer disponible la DB en rutas
app.locals.sql = sql;

// 🧠 necesario para usar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ middlewares
app.use(cors());
app.use(express.json());

app.use(express.static("../HTML"));

// ✅ servir frontend (carpeta HTML)
app.use(express.static(path.join(__dirname, "../HTML")));

// ✅ ruta raíz → login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../HTML/index.html"));
});

// ✅ rutas API
app.use(indexRoutes);

// 🚀 iniciar servidor
async function main() {
  try {
    const result = await sql.query("SELECT VERSION()");
    console.log("✅ Conexión exitosa a PostgreSQL");
    console.log(result.rows[0].version);
    app.listen(8080, () => {
      console.log("🚀 Servidor en http://localhost:8080");
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();