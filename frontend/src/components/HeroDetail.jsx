import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const HeroDetail = () => {
    const { id } = useParams();
    const [heroe, setHeroe] = useState(null);
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/superheroes/${id}`)
            .then(res => setHeroe(res.data))
            .catch(err => console.error("Error al traer el detalle", err));
    }, [id]);

    if (!heroe) return <div style={{ padding: '40px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>CARGANDO ARCHIVOS DE SH.I.E.L.D...</div>;

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '40px auto',
            padding: '0 20px',
            color: '#fff',
            animation: 'fadeIn 0.5s ease-in'
        }}>

            {/* Botón Volver (Estilo Marvel) */}
            <Link to="/" style={{
                display: 'inline-block',
                marginBottom: '20px',
                color: '#e62429',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '2px solid transparent',
                transition: 'border-color 0.2s'
            }}
                onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #e62429'}
                onMouseLeave={(e) => e.target.style.borderBottom = '2px solid transparent'}
            >
                &#8592; VOLVER
            </Link>

            <div style={{
                display: 'flex',
                gap: '40px',
                alignItems: 'flex-start',
                backgroundColor: '#202020',
                padding: '30px',
                borderRadius: '8px',
                border: '1px solid #333'
            }}>

                {/* COLUMNA IZQUIERDA: IMAGEN Y CARRUSEL */}
                <div style={{ flex: '0 0 40%', textAlign: 'center' }}>
                    <div style={{
                        backgroundColor: '#151515',
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                        borderBottom: '4px solid #e62429'
                    }}>
                        <img
                            src={`/images/${heroe.imagenes[imgIndex]}`}
                            alt={heroe.nombre}
                            style={{ width: '100%', borderRadius: '4px', display: 'block' }}
                        />
                    </div>

                    {/* Carrusel (Solo si hay más de 1 foto) */}
                    {heroe.imagenes.length > 1 && (
                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
                            <button
                                onClick={() => setImgIndex(prev => (prev > 0 ? prev - 1 : heroe.imagenes.length - 1))}
                                style={{ background: '#333', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                &#8592;
                            </button>

                            <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>
                                {imgIndex + 1} / {heroe.imagenes.length}
                            </span>

                            <button
                                onClick={() => setImgIndex(prev => (prev < heroe.imagenes.length - 1 ? prev + 1 : 0))}
                                style={{ background: '#e62429', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                &#8594;
                            </button>
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA: INFORMACIÓN */}
                <div style={{ flex: '1' }}>
                    {/* Logo con fondo arreglado (blend-mode para quitar el fondo blanco si el PNG no es transparente) */}
                    <div style={{ marginBottom: '15px' }}>
                        <img
                            src={`/logos/${heroe.casa.toLowerCase()}_logo.png`}
                            alt={`Logo ${heroe.casa}`}
                            style={{ height: '40px', mixBlendMode: 'lighten' }}
                        />
                    </div>

                    <h1 style={{
                        margin: '0 0 5px 0',
                        fontSize: '48px',
                        textTransform: 'uppercase',
                        fontWeight: '900',
                        letterSpacing: '1px'
                    }}>
                        {heroe.nombre}
                    </h1>

                    <h3 style={{ margin: '0 0 20px 0', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        {heroe.nombre_real || 'IDENTIDAD CLASIFICADA'}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px', borderTop: '1px solid #333', borderBottom: '1px solid #333', padding: '15px 0' }}>
                        <div>
                            <p style={{ margin: '0', color: '#777', fontSize: '12px', textTransform: 'uppercase' }}>Casa</p>
                            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '18px' }}>{heroe.casa}</p>
                        </div>
                        <div>
                            <p style={{ margin: '0', color: '#777', fontSize: '12px', textTransform: 'uppercase' }}>Año de Aparición</p>
                            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '18px' }}>{heroe.anio_aparicion}</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ color: '#e62429', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Biografía Oficial</h4>
                        <p style={{ lineHeight: '1.6', fontSize: '16px', color: '#ccc' }}>
                            {heroe.biografia}
                        </p>
                    </div>

                    {heroe.equipamiento && heroe.equipamiento.length > 0 && (
                        <div>
                            <h4 style={{ color: '#e62429', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Equipamiento</h4>
                            <ul style={{ paddingLeft: '20px', color: '#ccc', lineHeight: '1.6' }}>
                                {heroe.equipamiento.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroDetail;