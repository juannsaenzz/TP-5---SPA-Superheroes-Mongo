import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminPanel = () => {
    const [heroes, setHeroes] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [heroeId, setHeroeId] = useState('');

    // Estado para el archivo de imagen
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
    const [imagenesGuardadas, setImagenesGuardadas] = useState([]);

    const estadoInicial = {
        nombre: '', nombre_real: '', anio_aparicion: '',
        casa: 'Marvel', biografia: '', equipamiento: ''
    };

    const [formData, setFormData] = useState(estadoInicial);

    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarHeroes();
    }, []);

    const cargarHeroes = async () => {
        const res = await axios.get('http://localhost:5000/api/superheroes');
        setHeroes(res.data);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejador para el archivo de imagen
    const handleImageChange = (e) => {
        setImagenesSeleccionadas(e.target.files);
    };

    const quitarImagenVieja = (nombreImagen) => {
        setImagenesGuardadas(imagenesGuardadas.filter(img => img !== nombreImagen));
    };

    const editarHeroe = (heroe) => {
        setModoEdicion(true);
        setHeroeId(heroe._id);
        setFormData({
            nombre: heroe.nombre,
            nombre_real: heroe.nombre_real || '',
            anio_aparicion: heroe.anio_aparicion,
            casa: heroe.casa,
            biografia: heroe.biografia,
            equipamiento: heroe.equipamiento ? heroe.equipamiento.join(', ') : ''
        });
        setImagenesSeleccionadas([]);
        setImagenesGuardadas(heroe.imagenes || []); // Reseteamos la imagen al editar
        window.scrollTo(0, 0);
    };

    const cancelarEdicion = () => {
        setModoEdicion(false);
        setHeroeId('');
        setFormData(estadoInicial);
        setImagenesSeleccionadas([]);
        setImagenesGuardadas([]);
        document.getElementById('imagenInput').value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataAEnviar = new FormData();
        dataAEnviar.append('nombre', formData.nombre);
        dataAEnviar.append('nombre_real', formData.nombre_real);
        dataAEnviar.append('anio_aparicion', formData.anio_aparicion);
        dataAEnviar.append('casa', formData.casa);
        dataAEnviar.append('biografia', formData.biografia);
        dataAEnviar.append('equipamiento', formData.equipamiento);
        dataAEnviar.append('imagenesViejas', JSON.stringify(imagenesGuardadas));

        // Agregamos todas las imágenes al FormData
        if (imagenesSeleccionadas && imagenesSeleccionadas.length > 0) {
            for (let i = 0; i < imagenesSeleccionadas.length; i++) {
                dataAEnviar.append('imagenes', imagenesSeleccionadas[i]);
            }
        }

        try {
            if (modoEdicion) {
                await axios.put(`http://localhost:5000/api/superheroes/${heroeId}`, dataAEnviar, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('¡Actualizado!', 'El superhéroe se modificó correctamente', 'success');
            } else {
                await axios.post('http://localhost:5000/api/superheroes', dataAEnviar, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('¡Éxito!', 'Héroe creado correctamente', 'success');
            }
            cancelarEdicion();
            cargarHeroes();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar la información', 'error');
        }
    };

    const eliminarHeroe = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/superheroes/${id}`);
                Swal.fire('Eliminado', 'El héroe fue borrado de la base de datos.', 'success');
                cargarHeroes();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar al héroe.', 'error');
            }
        }
    };

    const inputStyle = {
        padding: '12px', marginBottom: '10px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px', width: '100%', boxSizing: 'border-box'
    };

    // Lógica para filtrar la tabla en tiempo real
    const heroesFiltrados = heroes.filter(heroe => {
        return heroe.nombre.toLowerCase().includes(busqueda.toLowerCase());
    });
    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ textTransform: 'uppercase', borderBottom: '2px solid #e62429', paddingBottom: '10px' }}>Panel de Administración</h1>

            {/* FORMULARIO ESTILO OSCURO */}
            <form onSubmit={handleSubmit} style={{
                display: 'flex', flexDirection: 'column', gap: '5px',
                marginBottom: '40px', background: '#202020', padding: '30px', borderRadius: '8px', border: '1px solid #333'
            }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#e62429', textTransform: 'uppercase' }}>
                    {modoEdicion ? 'Editar Superhéroe' : 'Cargar Nuevo Superhéroe'}
                </h3>

                <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} required style={inputStyle} />
                <input name="nombre_real" placeholder="Nombre Real" value={formData.nombre_real} onChange={handleInputChange} style={inputStyle} />
                <input name="anio_aparicion" type="number" placeholder="Año de aparición" value={formData.anio_aparicion} onChange={handleInputChange} required style={inputStyle} />

                <select name="casa" value={formData.casa} onChange={handleInputChange} style={inputStyle}>
                    <option value="Marvel">Marvel</option>
                    <option value="DC">DC</option>
                </select>

                <textarea name="biografia" placeholder="Biografía" rows="4" value={formData.biografia} onChange={handleInputChange} required style={inputStyle} />
                <input name="equipamiento" placeholder="Equipamiento (separado por coma)" value={formData.equipamiento} onChange={handleInputChange} style={inputStyle} />

                {/* PREVISUALIZACIÓN DE IMÁGENES ACTUALES */}
                {modoEdicion && imagenesGuardadas.length > 0 && (
                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#151515', borderRadius: '4px', border: '1px solid #333' }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#aaa', fontSize: '12px', textTransform: 'uppercase' }}>
                            Vista previa de imagenes:
                        </p>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            {imagenesGuardadas.map((img, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={`/images/${img}`}
                                        alt={`Actual ${index + 1}`}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #555' }}
                                    />
                                    {/* BOTÓN DE BORRAR (TACHITO / X) */}
                                    <button
                                        type="button"
                                        onClick={() => quitarImagenVieja(img)}
                                        title="Eliminar esta imagen"
                                        style={{
                                            position: 'absolute', top: '-8px', right: '-8px',
                                            background: '#e62429', color: 'white', border: 'none',
                                            borderRadius: '50%', width: '24px', height: '24px',
                                            cursor: 'pointer', fontWeight: 'bold', display: 'flex',
                                            justifyContent: 'center', alignItems: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <label style={{ marginTop: '10px', fontWeight: 'bold', color: '#aaa' }}>Seleccionar Imágenes</label>
                <input id="imagenInput" type="file" accept="image/*" multiple onChange={handleImageChange} required={!modoEdicion} style={{ ...inputStyle, padding: '10px 0' }} />

                {/* PREVISUALIZACIÓN DE IMÁGENES NUEVAS SELECCIONADAS (Archivos locales) */}
                {imagenesSeleccionadas && imagenesSeleccionadas.length > 0 && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1b2a1b', borderRadius: '4px', border: '1px solid #28a745' }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#28a745', fontSize: '12px', textTransform: 'uppercase' }}>
                            Imágenes nuevas listas para subir:
                        </p>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            {/* Transformamos el FileList en un Array para poder recorrerlo */}
                            {Array.from(imagenesSeleccionadas).map((file, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Nueva ${index + 1}`}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '2px solid #28a745' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button type="submit" style={{ padding: '12px 25px', background: '#e62429', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>
                        {modoEdicion ? 'Actualizar Héroe' : 'Guardar Héroe'}
                    </button>
                    {modoEdicion && (
                        <button type="button" onClick={cancelarEdicion} style={{ padding: '12px 25px', background: '#555', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* BARRA DE BÚSQUEDA */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Buscar personaje..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 15px',
                        borderRadius: '6px',
                        border: '1px solid #333',
                        backgroundColor: '#151515',
                        color: '#fff',
                        fontSize: '16px',
                        outline: 'none',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #e62429'}
                    onBlur={(e) => e.target.style.border = '1px solid #333'}
                />
            </div>


            {/* LISTADO ESTILO OSCURO */}
            <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#202020', border: '1px solid #333' }}>
                <thead style={{ background: '#111', color: '#fff', textTransform: 'uppercase' }}>
                    <tr>
                        <th style={{ padding: '15px', borderBottom: '2px solid #e62429' }}>Nombre</th>
                        <th style={{ padding: '15px', borderBottom: '2px solid #e62429' }}>Casa</th>
                        <th style={{ padding: '15px', borderBottom: '2px solid #e62429' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {heroesFiltrados.map(h => (
                        <tr key={h._id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '12px 15px' }}>{h.nombre}</td>
                            <td style={{ padding: '12px 15px' }}>{h.casa}</td>
                            <td style={{ padding: '12px 15px', display: 'flex', gap: '10px' }}>
                                <button onClick={() => editarHeroe(h)} style={{ padding: '8px 15px', background: '#444', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>Editar</button>
                                <button onClick={() => eliminarHeroe(h._id)} style={{ padding: '8px 15px', background: 'transparent', color: '#e62429', border: '1px solid #e62429', cursor: 'pointer', borderRadius: '3px' }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;