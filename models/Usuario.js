import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    sitioweb: {
        type: String,
        required: false,
        default: ''
    },
    telefono: {
        type: Number,
        required: false,
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    pacientes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Paciente'
        }
    ]
},
    {
        timestamps: true
    }
);

usuarioSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function(formularioPassword){
    return await bcryptjs.compare(formularioPassword, this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;