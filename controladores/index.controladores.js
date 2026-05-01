import { db_connect } from "../utils/db.js";
import bcrypt from "bcrypt";

const sql = db_connect();

export const getAPI = (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
};

export const postAPI = (req, res) => {
  res.json({ mensaje: "POST recibido", datos: req.body });
};

//Unity GET Preguntas, respuestas y POST progreso 
export const getPreguntasQuiz = async (req, res) => {
  const { nivel } = req.params;

  try {
    const preguntas = await sql.query(`
      SELECT p.id, p.questions_text
      FROM public."PREGUNTA" p
      WHERE p.level_id = $1
      ORDER BY RANDOM()
      LIMIT 6
  `, [nivel]);

    if (preguntas.rows.length === 0) {
      return res.status(404).json({ error: "No hay preguntas para ese nivel" });
    }

    const resultado = [];

    for (const pregunta of preguntas.rows) {
      const respuestas = await sql.query(`
        SELECT id, questions_id, answers_text, is_correct, points
        FROM public."RESPUESTA"
        WHERE questions_id = $1
      `, [pregunta.id]);

      resultado.push({
        id: pregunta.id,
        enunciado: pregunta.questions_text,
        respuestas: respuestas.rows
      });
    }

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPreguntaAlarma = async (req, res) => {
  try {
    const pregunta = await sql.query(`
      SELECT p.id, p.questions_text
      FROM public."PREGUNTA" p
      WHERE p.level_id = 4
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (pregunta.rows.length === 0) {
      return res.status(404).json({ error: "No hay preguntas de nivel 4 en la BD" });
    }

    const p = pregunta.rows[0];

    const respuestas = await sql.query(`
      SELECT id, questions_id, answers_text, is_correct, points
      FROM "RESPUESTA"
      WHERE questions_id = $1
    `, [p.id]);

    res.json({
      id: p.id,
      enunciado: p.questions_text,
      respuestas: respuestas.rows
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const guardarProgreso = async (req, res) => {
  const { id_usuario, id_nivel, sc_ganados, puntaje, intentos_usados, estado } = req.body;
 
  if (!id_usuario || !id_nivel) {
    return res.status(400).json({ error: "id_usuario e id_nivel son requeridos." });
  }
 
  try {
    // Verificar si ya existe un progreso para este usuario y nivel
    const existe = await sql.query(
      `SELECT id_progreso FROM public."PROGRESO"
       WHERE id_usuario = $1 AND id_nivel = $2`,
      [id_usuario, id_nivel]
    );
 
    if (existe.rows.length > 0) {
      await sql.query(
        `UPDATE public."PROGRESO"
         SET sc_ganados      = GREATEST(sc_ganados, $1),
             puntaje         = GREATEST(puntaje, $2),
             intentos_usados = intentos_usados + 1,
             estado          = $3,
             fecha_fin       = NOW()
         WHERE id_usuario = $4 AND id_nivel = $5`,
        [sc_ganados || 0, puntaje || 0, estado || 'completado', id_usuario, id_nivel]
      );
      return res.json({ mensaje: "Progreso actualizado correctamente." });
    }
 
    await sql.query(
      `INSERT INTO public."PROGRESO"
         (id_usuario, id_nivel, puntaje, sc_ganados, intentos_usados, estado, fecha_inicio, fecha_fin)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [id_usuario, id_nivel, puntaje || 0, sc_ganados || 0,
       intentos_usados || 1, estado || 'completado']
    );
 
    res.json({ mensaje: "Progreso registrado correctamente." });
 
  } catch (error) {
    console.error("[guardarProgreso] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  const { correo, clave } = req.body;
<<<<<<< HEAD
 
  if (!correo || !clave)
    return res.status(400).json({ ok: false, mensaje: "Correo y clave son requeridos." });
 
  try {
    const result = await sql.query(
      `SELECT id_usuario, nombre, correo, "contraseña"
=======

  if (!correo || !clave) {
    return res.status(400).json({ ok: false, mensaje: "Correo y clave son requeridos." });
  }

  try {
    const result = await sql.query(
      `SELECT id_usuario, nombre, correo, password, tipo_usuario
>>>>>>> e2a0726 (ultima act)
       FROM public."USUARIO"
       WHERE correo = $1`,
      [correo]
    );
<<<<<<< HEAD
 
    if (result.rows.length === 0)
      return res.status(401).json({ ok: false, mensaje: "Correo o clave incorrectos." });
 
    const usuario = result.rows[0];
 
    // Comparar contraseña en texto plano (como está en la BD ahora)
    // Si en el futuro se encripta, cambiar esto por bcrypt.compare
    if (clave !== usuario.contraseña)
      return res.status(401).json({ ok: false, mensaje: "Correo o clave incorrectos." });
 
    await sql.query(
      `UPDATE public."USUARIO" SET ultimo_acceso = NOW() WHERE id_usuario = $1`,
      [usuario.id_usuario]
    );
 
    res.json({
      ok:         true,
      usuario:    usuario.nombre,
      correo:     usuario.correo,
      user_id:    usuario.id_usuario  
    });
 
=======

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: "Correo o clave incorrectos." });
    }

    const usuario = result.rows[0];

    if (clave !== usuario.password) {
      return res.status(401).json({ ok: false, mensaje: "Correo o clave incorrectos." });
    }

    await sql.query(
      `UPDATE public."USUARIO"
       SET ultimo_acceso = NOW()
       WHERE id_usuario = $1`,
      [usuario.id_usuario]
    );

    res.json({
      ok: true,
      usuario: usuario.nombre,
      correo: usuario.correo,
      user_id: usuario.id_usuario,
      role: usuario.tipo_usuario
    });

>>>>>>> e2a0726 (ultima act)
  } catch (error) {
    console.error("[loginUsuario]", error.message);
    res.status(500).json({ ok: false, mensaje: "Error del servidor." });
  }
};
 
export const registrarUsuario = async (req, res) => {
  const { first_name, last_name, email, role, password } = req.body;

  const nombre = `${first_name} ${last_name}`;
  const tipoUsuario = role || "externo";

  // 🔐 Validación dominio
  if (tipoUsuario === "empleado") {
    if (!email.endsWith("@rockwell.com")) {
      return res.status(400).json({
        error: "Solo correos con dominio de la empresa pueden registrarse como empleados."
      });
    }
  }

  const idRol =
    tipoUsuario === "admin" ? 1 :
    tipoUsuario === "empleado" ? 4 :
    5;

  try {
    const existe = await sql.query(
      `SELECT id_usuario FROM public."USUARIO" WHERE correo = $1`,
      [email]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    await sql.query(
      `INSERT INTO public."USUARIO"
       (nombre, correo, "país", tipo_usuario, password, fecha_registro, id_rol)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
      [nombre, email, "México", tipoUsuario, password, idRol]
    );

    res.json({ mensaje: "Usuario creado correctamente." });

  } catch (error) {
    console.error("[registrarUsuario]", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const registrarSesion = async (req, res) => {
  const { id_usuario, id_nivel, puntaje, sc_ganados, intentos_usados, preguntas_correctas, preguntas_incorrectas } = req.body;
  
  if (!id_usuario || !id_nivel) {
    return res.status(400).json({ error: "id_usuario e id_nivel son requeridos." });
  }

  try {
    await sql.query(
      `INSERT INTO public."PROGRESO" (id_usuario, id_nivel, puntaje, sc_ganados, intentos_usados, estado, fecha_inicio, preguntas_correctas, preguntas_incorrectas)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)`,
      [id_usuario, id_nivel, puntaje || 0, sc_ganados || 0, intentos_usados || 1, 'en progreso', preguntas_correctas || 0, preguntas_incorrectas || 0]
    );
    res.json({ mensaje: "Sesión registrada correctamente" });
  } catch (error) {
    console.error("[registrarSesion] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getEstadisticas = async (req, res) => {
  try {
    const nivelMax = await sql.query(
      `SELECT MAX(id_nivel) as max FROM public."PROGRESO"`
    );

    const coins = await sql.query(
      `SELECT SUM(sc_ganados) as total_sc FROM public."PROGRESO"`
    );

    const jugadores = await sql.query(
      `SELECT COUNT(DISTINCT id_usuario) as total FROM public."PROGRESO"`
    );

    const porNivel = await sql.query(
      `SELECT id_nivel, COUNT(*) as partidas,
        ROUND(AVG(sc_ganados), 1) as sc_promedio
       FROM public."PROGRESO"
       GROUP BY id_nivel
       ORDER BY id_nivel`
    );

    /* const porDificultad = await sql.query(
      `SELECT dificultad, SUM(preguntas_correctas) as correctas, SUM(preguntas_incorrectas) as incorrectas
       FROM sesiones
       GROUP BY dificultad`
    ); */

    const ranking = await sql.query(
      `SELECT u.nombre, MAX(p.id_nivel) as nivel, SUM(p.sc_ganados) as total_sc
       FROM public."PROGRESO" p
       JOIN public."USUARIO" u ON u.id_usuario = p.id_usuario
       GROUP BY u.id_usuario, u.nombre
       ORDER BY total_sc DESC
       LIMIT 5`
    );

    /*
    const historial = await sql.query(
      `SELECT u.first_name, u.last_name, s.puntaje, s.nivel_alcanzado, s.fecha
       FROM sesiones s
       JOIN users u ON u.user_id = s.user_id
       ORDER BY s.fecha DESC
       LIMIT 5`
    );
    */

    res.json({
      nivelMax:  nivelMax.rows[0].max  || 0,
      totalSC:   coins.rows[0].total_sc || 0,
      jugadores: jugadores.rows[0].total || 0,
      porNivel:  porNivel.rows,
      ranking:   ranking.rows
      //porDificultad: porDificultad.rows,
      //historial: historial.rows
    });

  } catch (error) {
    console.error("[getEstadisticas]", error.message);
    res.status(500).json({ error: error.message });
  }
};