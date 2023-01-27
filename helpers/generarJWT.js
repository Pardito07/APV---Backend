import jwt from 'jsonwebtoken'

const generarJWT = datos => {
    const { id, nombre, email } = datos;

    return jwt.sign( { id, email, nombre }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

export default generarJWT;