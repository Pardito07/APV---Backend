import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';

const checkAuth = async (req, res, next) => {
    let token;

    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = await Usuario.findById(decoded.id).select('nombre email');
            return next();
        }
    } catch (error) {
        return res.status(401).json({ msg: 'Hubo un error' });
    }

    if(!token){
        return res.status(404).json({ msg: 'Token no válido' });
    }

    next();
}

export default checkAuth;