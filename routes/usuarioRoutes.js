import express from 'express'
import { autenticarUsuario, confirmarUsuario, registrarUsuario, comprobarEmail, comprobarToken, nuevoPassword, editarPerfil, cambiarPassword, obtenerPerfil } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', autenticarUsuario);
router.post('/registrar', registrarUsuario);
router.get('/confirmar/:token', confirmarUsuario);
router.post('/olvide-password', comprobarEmail);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
router.put('/editar-perfil', checkAuth, editarPerfil);
router.put('/cambiar-password', checkAuth, cambiarPassword);
router.get('/perfil', checkAuth, obtenerPerfil);

export default router;