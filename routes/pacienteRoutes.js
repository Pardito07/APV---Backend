import express from 'express';
import { obtenerPacientes, obtenerPaciente, agregarPaciente, editarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, obtenerPacientes)
router.post('/agregar', checkAuth, agregarPaciente);
router.route('/:id').get(checkAuth, obtenerPaciente).put(checkAuth, editarPaciente).delete(checkAuth, eliminarPaciente);

export default router;