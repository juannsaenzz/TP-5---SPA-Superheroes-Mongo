import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{
            backgroundColor: '#202020',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            borderBottom: '1px solid #393939',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '1px'
        }}>
            <Link to="/" style={{ color: '#fff' }}>Todos</Link>
            <Link to="/marvel" style={{ color: '#fff' }}>Marvel</Link>
            <Link to="/dc" style={{ color: '#fff' }}>DC</Link>
            <Link to="/admin" style={{ color: '#e62429' }}>Admin</Link> {/* Admin en rojo */}
        </nav>
    );
};

export default Navbar;