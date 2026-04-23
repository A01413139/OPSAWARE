import { db_connect } from "./utils/db.js";

const sql = db_connect();

async function crearTabla() {
  try {
    await sql.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        nombre VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tabla creada correctamente");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

crearTabla();