import { Router } from "express";
import { getAPI, postAPI, registrarSesion, registrarUsuario,  getPreguntasQuiz, getPreguntaAlarma, guardarProgreso, getEstadisticas, loginUsuario } from "./controladores/index.controladores.js";
<<<<<<< HEAD
import bcrypt from "bcrypt";
=======
>>>>>>> e2a0726 (ultima act)

const router = Router();

router.get("/", getAPI);
router.post("/", postAPI);
router.post("/sesion", registrarSesion);
router.post("/registro", registrarUsuario);

//Agregados loginUsuario, getPreguntasQuiz, getPreguntaAlarma, guardarProgreso
//Modificados getEstadisticas
router.post("/login", loginUsuario);
router.get("/preguntas/quiz/:nivel", getPreguntasQuiz);
router.get("/preguntas/alarma",  getPreguntaAlarma);
router.post("/progreso", guardarProgreso);
router.get("/estadisticas", getEstadisticas);
<<<<<<< HEAD

router.post("/login", async (req, res) => {
  const { correo, clave } = req.body;
=======
>>>>>>> e2a0726 (ultima act)




export default router;