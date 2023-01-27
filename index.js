import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();

app.use(express.json());

dotenv.config();

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            callback(null, true)
        }else {
            callback(new Error('Error de CORS'));
        }
    }
}

app.use(cors(corsOptions));

conectarDB();

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});