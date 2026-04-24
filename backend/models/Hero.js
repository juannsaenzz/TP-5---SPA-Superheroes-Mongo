const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nombre_real: { type: String },
    anio_aparicion: { type: Number, required: true },
    casa: { type: String, enum: ['Marvel', 'DC'], required: true },
    biografia: { type: String, required: true },
    equipamiento: [String],
    imagenes: {
        type: [String],
        validate: [v => v.length > 0, 'Debe tener al menos una imagen']
    },
    logo_casa: { type: String }
});

module.exports = mongoose.model('Hero', heroSchema, 'personajes');