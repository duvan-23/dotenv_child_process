import mongoose from 'mongoose';

const mensajesCollection = 'mensajes';

const MensajesSchema= new mongoose.Schema({
    id:{type: Number, required: true},
    author: {
        id: {type: String, required: true},
        nombre: {type: String, required: true},
        apellido: {type: String, required: true},
        edad: {type: Number, required: true},
        alias: {type: String, required: true},
        avatar: {type: String, required: true},
    },
    text: {
        message:{type: String, required: true},
        fecha:{type: String, required: true}
    }
});

export  const mensajes = mongoose.model(mensajesCollection, MensajesSchema);