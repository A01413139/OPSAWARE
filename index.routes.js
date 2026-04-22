import { Router } from "express";
import { getAPI, postAPI, getPreguntas, registrarSesion, registrarUsuario } from "./controladores/index.controladores.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", getAPI);
router.post("/", postAPI);
router.get("/preguntas", getPreguntas);
router.post("/sesion", registrarSesion);
router.post("/registro", registrarUsuario);

router.post("/login", async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const sql = req.app.locals.sql;

    const result = await sql.query(
      "SELECT * FROM users WHERE email = $1",
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: "Correo o clave incorrectos" });
    }

    const usuario = result.rows[0];

    // Compara la clave con el hash guardado
    const match = await bcrypt.compare(clave, usuario.password);

    if (!match) {
      return res.status(401).json({ ok: false, mensaje: "Correo o clave incorrectos" });
    }

    res.json({
      ok: true,
      usuario: usuario.first_name,
      email: usuario.email,
      user_id: usuario.user_id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error del servidor" });
  }
});


export default router;