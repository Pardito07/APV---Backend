import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js';
import { emailRegistro, emailRecuperarPassword } from '../helpers/email.js';
import generarJWT from '../helpers/generarJWT.js';

const registrarUsuario = async (req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email });

    if(usuario){
        const error = new Error('El usuario ya esta registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const usuarioAlmacenado = new Usuario(req.body);
        usuarioAlmacenado.token = generarId();
        await usuarioAlmacenado.save();
        emailRegistro(usuarioAlmacenado);
        res.json({ msg: 'Usuario registrado correctamente, revisa tu email para confirmar tu cuenta' })
    } catch (error) {
        console.log(error);
    }
}

const confirmarUsuario = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ token });

    if(!usuario){
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }

    usuario.token = '';
    usuario.confirmado = true;
    await usuario.save();
    res.json({ msg: 'Usuario autenticado correctamente' });
}

const autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    if(!await usuario.comprobarPassword(password)){
        const error = new Error('La contraseña es incorrecta');
        return res.status(400).json({ msg: error.message });
    }

    const datos = {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
    }

    res.json({
        _id: usuario._id,
        token: generarJWT(datos)
    });
}

const comprobarEmail = async (req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email });

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    usuario.token = generarId();
    await usuario.save();
    emailRecuperarPassword(usuario);
    res.json({ msg: 'Hemos enviado un email con las instrucciones para reestablecer tu contraseña' });
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    
    const usuario = await Usuario.findOne({ token });

    if(!usuario){
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    res.json({ msg: 'Token válido y el usuario existe' });
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if(!usuario){
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    usuario.password = password;
    usuario.token = '';
    await usuario.save();
    
    res.json({ msg: 'Contraseña reestablecida correctamente' });
}

const editarPerfil = async (req, res) => {
    const { id } = req.usuario;

    const usuario = await Usuario.findById(id);

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.sitioweb = req.body.sitioweb
    usuario.telefono = req.body.telefono
    usuario.email = req.body.email || usuario.email;

    await usuario.save();
    res.json(usuario);
}

const cambiarPassword = async (req, res) => {
    const { id } = req.usuario;

    const usuario = await Usuario.findById(id);

    if(!usuario){
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if(!await usuario.comprobarPassword(req.body.password)){
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({ msg: error.message });
    }

    usuario.password = req.body.password;
    await usuario.save();
    res.json({ msg: 'Password actualizado correctamente' });
}

const obtenerPerfil = async (req, res) => {
    const { id } = req.usuario;

    const usuario = await Usuario.findById(id).select('_id nombre email telefono sitioweb');

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(401).json({ msg: error.message });
    }

    res.json(usuario);
}

export {
    autenticarUsuario,
    registrarUsuario,
    confirmarUsuario,
    comprobarEmail,
    comprobarToken,
    nuevoPassword,
    editarPerfil,
    cambiarPassword,
    obtenerPerfil
}