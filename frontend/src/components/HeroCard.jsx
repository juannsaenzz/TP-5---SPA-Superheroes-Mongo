import { Link } from 'react-router-dom';

const HeroCard = ({ heroe }) => {
    return (
        <div className="hero-card">
            <Link to={`/heroe/${heroe._id}`}>
                {/* IMAGEN */}
                <div style={{ height: '280px', overflow: 'hidden' }}>
                    <img
                        src={`/images/${heroe.imagenes[0]}`}
                        alt={heroe.nombre}
                        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                </div>

                {/* TEXTO CON ANIMACIÓN */}
                <div className="hero-card-info">
                    <h2 style={{
                        margin: '0 0 5px 0',
                        fontSize: '18px',
                        textTransform: 'uppercase',
                        fontWeight: '900',
                        color: '#fff'
                    }}>
                        {heroe.nombre}
                    </h2>

                    <p className="hero-card-subtitle">
                        {heroe.nombre_real || 'IDENTIDAD CLASIFICADA'}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default HeroCard;