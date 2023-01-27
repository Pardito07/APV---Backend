import mongoose from 'mongoose'

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    propietario: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    fechaAlta: {
        type: Date,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true,
        trim: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
},
    {
        timestamps: true
    }
);

const Paciente = mongoose.model('Paciente', pacienteSchema);
export default Paciente