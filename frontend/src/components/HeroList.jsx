import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroCard from './HeroCard';

const HeroList = ({ casa }) => {
    const [heroes, setHeroes] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        // Definimos la ruta según la casa seleccionada 
        const ruta = casa ? `/${casa.toLowerCase()}` : '';
        axios.get(`http://localhost:5000/api/superheroes${ruta}`)
            .then(res => setHeroes(res.data))
            .catch(err => console.error("Error al traer héroes", err));
    }, [casa]);

    // REQUERIMIENTO 12: Filtro por nombre del lado del cliente 
    const heroesFiltrados = heroes.filter(h =>
        h.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={{ padding: '20px' }}>
            <input
                type="text"
                placeholder="BUSCAR PERSONAJE..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                    width: '100%',
                    padding: '15px',
                    marginBottom: '30px',
                    backgroundColor: '#202020',
                    border: '1px solid #393939',
                    color: 'white',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {heroesFiltrados.map(h => (
                    <HeroCard key={h._id} heroe={h} />
                ))}
            </div>
        </div>
    );
};

export default HeroList;