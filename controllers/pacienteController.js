import Usuario from "../models/Usuario.js";
import Paciente from "../models/Paciente.js";

const obtenerPacientes = async (req, res) => {
    const { id } = req.usuario;

    const pacientes = await Paciente.find().where('veterinario').equals(id).select('nombre propietario email fechaAlta sintomas veterinario')

    if(!pacientes){
        const error = new Error('Pacientes no encontrados');
        return res.status(404).json({ msg: error.message });
    }

    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.usuario;

    const usuario = await Usuario.findById(id);

    if(!usuario){
        const error = new Error('Acción no válida');
        return res.status(401).json({ msg: error.message });
    }

    const paciente = await Paciente.findById(req.params.id).select('nombre propietario email fechaAlta sintomas');

    if(!paciente){
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    res.json(paciente);
}

const agregarPaciente = async (req, res) => {
    const usuario = await Usuario.findById(req.usuario._id);

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message })
    }

    try {
        const paciente = new Paciente(req.body);
        paciente.veterinario = req.usuario.id;
        usuario.pacientes.push(paciente._id);
        await Promise.allSettled([ await usuario.save(), await paciente.save() ]);
        res.json({
            _id: paciente._id,
            nombre: paciente.nombre,
            propietario: paciente.propietario,
            email: paciente.email,
            fechaAlta: paciente.fechaAlta,
            sintomas: paciente.sintomas,
            veterinario: paciente.veterinario
        });
    } catch (error) {
        console.log(error);
    }
}

const editarPaciente = async (req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if(paciente.veterinario.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message });
    }

    try {
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fechaAlta = req.body.fechaAlta || paciente.fechaAlta;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        await paciente.save();
        res.json(paciente);
    } catch (error) {
        console.log(error);
    }
    
}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({ error: error.message });
    }

    try {
        const usuario = await Usuario.findById(req.usuario._id);
        usuario.pacientes.pull(paciente._id);
        await Promise.allSettled([ await paciente.deleteOne(), await usuario.save() ]);
        res.json(paciente);
    } catch (error) {
        console.log(error);
    }
}

export{
    agregarPaciente,
    obtenerPacientes,
    editarPaciente,
    eliminarPaciente,
    obtenerPaciente
}