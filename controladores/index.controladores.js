import { db_connect } from "../utils/db.js";
import bcrypt from "bcrypt";

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

export const registrarUsuario = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const username = (first_name + last_name).toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 1000);

  try {
    const existe = await sql.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    const hash = await bcrypt.hash(password, 10);

    await sql.query(
      `INSERT INTO users (first_name, last_name, username, email, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [first_name, last_name, username, email, hash]
    );

    res.json({ mensaje: "Usuario creado correctamente." });

    const { first_name, last_name, email, role, password } = req.body;

await sql.query(
  `INSERT INTO users (first_name, last_name, username, email, password, role)
   VALUES ($1, $2, $3, $4, $5, $6)`,
  [first_name, last_name, username, email, hash, role || 'externo']
);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarSesion = async (req, res) => {
  const { user_id, puntaje, completada, nivel_alcanzado, preguntas_correctas, preguntas_incorrectas, dificultad } = req.body;
  try {
    await sql.query(
      `INSERT INTO sesiones (user_id, simulacion_id, puntaje, completada, nivel_alcanzado, preguntas_correctas, preguntas_incorrectas, dificultad)
       VALUES ($1, 1, $2, $3, $4, $5, $6, $7)`,
      [user_id, puntaje, completada, nivel_alcanzado || 1, preguntas_correctas || 0, preguntas_incorrectas || 0, dificultad || 'facil']
    );
    res.json({ mensaje: "Sesión registrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEstadisticas = async (req, res) => {
  try {
    const nivelMax = await sql.query(
      "SELECT MAX(nivel_alcanzado) as max FROM sesiones"
    );

    const aciertos = await sql.query(
      "SELECT SUM(preguntas_correctas) as correctas, SUM(preguntas_incorrectas) as incorrectas FROM sesiones"
    );

    const jugadores = await sql.query(
      "SELECT COUNT(DISTINCT user_id) as total FROM sesiones"
    );

    const porNivel = await sql.query(
      `SELECT nivel_alcanzado, COUNT(*) as partidas,
       ROUND(AVG(preguntas_correctas::decimal / NULLIF(preguntas_correctas + preguntas_incorrectas, 0) * 100), 1) as tasa_acierto
       FROM sesiones
       GROUP BY nivel_alcanzado
       ORDER BY nivel_alcanzado`
    );

    const porDificultad = await sql.query(
      `SELECT dificultad, SUM(preguntas_correctas) as correctas, SUM(preguntas_incorrectas) as incorrectas
       FROM sesiones
       GROUP BY dificultad`
    );

    const ranking = await sql.query(
      `SELECT u.first_name, u.last_name, MAX(s.nivel_alcanzado) as nivel, SUM(s.puntaje) as total
       FROM sesiones s
       JOIN users u ON u.user_id = s.user_id
       GROUP BY u.user_id, u.first_name, u.last_name
       ORDER BY total DESC
       LIMIT 5`
    );

    const historial = await sql.query(
      `SELECT u.first_name, u.last_name, s.puntaje, s.nivel_alcanzado, s.fecha
       FROM sesiones s
       JOIN users u ON u.user_id = s.user_id
       ORDER BY s.fecha DESC
       LIMIT 5`
    );

    res.json({
      nivelMax: nivelMax.rows[0].max || 0,
      correctas: aciertos.rows[0].correctas || 0,
      incorrectas: aciertos.rows[0].incorrectas || 0,
      jugadores: jugadores.rows[0].total || 0,
      porNivel: porNivel.rows,
      porDificultad: porDificultad.rows,
      ranking: ranking.rows,
      historial: historial.rows
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};