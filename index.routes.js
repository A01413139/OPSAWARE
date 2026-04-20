import { Router } from "express";
import { getAPI, postAPI, getPreguntas, registrarSesion } from "./controladores/index.controladores.js";

const router = Router();

router.get("/", getAPI);
router.post("/", postAPI);
router.get("/preguntas", getPreguntas);
router.post("/sesion", registrarSesion);

router.post("/login", async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const sql = req.app.locals.sql;

    const result = await sql.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [correo, clave]
    );

    if (result.rows.length > 0) {
      const usuario = result.rows[0];

      res.json({
        ok: true,
        usuario: usuario.first_name,
        email: usuario.email
      });
    } else {
      res.status(401).json({
        ok: false,
        mensaje: "Correo o clave incorrectos"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error del servidor"
    });
  }
});

export default router;