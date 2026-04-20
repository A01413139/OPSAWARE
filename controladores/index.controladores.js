import { db_connect } from "../utils/db.js";

const sql = db_connect();

export const getAPI = (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
};

export const postAPI = (req, res) => {
  res.json({ mensaje: "POST recibido", datos: req.body });
};

export const getPreguntas = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM preguntas ORDER BY RANDOM() LIMIT 10");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarSesion = async (req, res) => {
  const { user_id, puntaje, completada } = req.body;
  try {
    await sql.query(
      "INSERT INTO sesiones (user_id, simulacion_id, puntaje, completada) VALUES ($1, 1, $2, $3)",
      [user_id, puntaje, completada]
    );
    res.json({ mensaje: "Sesión registrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};