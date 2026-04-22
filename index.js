import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { db_connect } from "./utils/db.js";
import indexRoutes from "./index.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const sql = db_connect();
app.locals.sql = sql;

app.use(cors());
app.use(express.json());

app.use("/game", (req, res, next) => {
  if (req.url.endsWith(".br")) {
    res.setHeader("Content-Encoding", "br");
    if (req.url.includes(".js.br"))          res.setHeader("Content-Type", "application/javascript");
    if (req.url.includes(".wasm.br"))        res.setHeader("Content-Type", "application/wasm");
    if (req.url.includes(".data.br"))        res.setHeader("Content-Type", "application/octet-stream");
    if (req.url.includes(".symbols.json.br"))res.setHeader("Content-Type", "application/json");
  }
  next();
});

app.use(express.static(path.join(__dirname, "../HTML")));
app.use(indexRoutes);

async function main() {
  try {
    const result = await sql.query("SELECT VERSION()");
    console.log("Conexión exitosa ");
    console.log(result.rows[0].version);
    app.listen(8080, () => {
      console.log("Servidor en http://localhost:8080");
    });
  } catch (error) {
    console.error("error:", error.message);
  }
}

main();