const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Hero = require('./models/Hero');

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONEXIÓN A LA BASE DE DATOS
mongoose.connect('mongodb://localhost:27017/db_superheroes')
    .then(() => console.log('Conexión exitosa a mongo-tp6'))
    .catch(err => console.error('Error de conexión:', err));

const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar imágenes en el Frontend
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../frontend/public/images/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.body.casa + '-' + req.body.nombre.replace(/\s+/g, '-') + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. RUTAS DE LECTURA (READ) [cite: 93, 100]

// Obtener todos los superhéroes (Ruta /) 
app.get('/api/superheroes', async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los datos', error }); // Feedback de fracaso 
    }
});

// Obtener solo Marvel (Ruta /marvel) 
app.get('/api/superheroes/marvel', async (req, res) => {
    try {
        const heroes = await Hero.find({ casa: 'Marvel' });
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al filtrar por Marvel', error });
    }
});

// Obtener solo DC (Ruta /dc) 
app.get('/api/superheroes/dc', async (req, res) => {
    try {
        const heroes = await Hero.find({ casa: 'DC' });
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al filtrar por DC', error });
    }
});

// Detalle de personaje por ID [cite: 94]
app.get('/api/superheroes/:id', async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);
        if (!hero) return res.status(404).json({ mensaje: 'Héroe no encontrado' });
        res.json(hero);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en la búsqueda de detalle', error });
    }
});

// 3. OPERACIONES DE ESCRITURA

// Cargar nuevo superhéroe (POST)
app.post('/api/superheroes', upload.array('imagenes', 5), async (req, res) => {
    try {
        const imagenesSubidas = req.files ? req.files.map(file => file.filename) : [];

        const datosHeroe = {
            ...req.body,
            equipamiento: req.body.equipamiento ? req.body.equipamiento.split(',') : [],
            imagenes: imagenesSubidas
        };
        const nuevoHeroe = new Hero(datosHeroe);
        await nuevoHeroe.save();
        res.status(201).json({ mensaje: '¡Superhéroe cargado con éxito!', data: nuevoHeroe });
    } catch (error) {
        res.status(400).json({ mensaje: 'Fallo al cargar', error });
    }
});

// Actualizar superhéroe (PUT)
app.put('/api/superheroes/:id', upload.array('imagenes', 5), async (req, res) => {
    try {
        const heroeExistente = await Hero.findById(req.params.id);
        if (!heroeExistente) return res.status(404).json({ mensaje: 'No existe el héroe' });

        let imagenesQueQuedan = [];
        if (req.body.imagenesViejas) {
            imagenesQueQuedan = JSON.parse(req.body.imagenesViejas);
        }

        if (req.files && req.files.length > 0) {
            const nombresNuevos = req.files.map(file => file.filename);
            imagenesQueQuedan = [...imagenesQueQuedan, ...nombresNuevos];
        }

        const datosActualizados = {
            ...req.body,
            equipamiento: req.body.equipamiento ? req.body.equipamiento.split(',').map(i => i.trim()) : [],
            imagenes: imagenesQueQuedan
        };

        const heroeActualizado = await Hero.findByIdAndUpdate(req.params.id, datosActualizados, { new: true });
        res.json({ mensaje: '¡Actualización exitosa!', data: heroeActualizado });
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: 'Error al actualizar', error });
    }
});

// Eliminar superhéroe 
app.delete('/api/superheroes/:id', async (req, res) => {
    try {
        await Hero.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Héroe eliminado correctamente' }); // Feedback de éxito 
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo eliminar el registro', error });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor operativo en puerto ${PORT}`));