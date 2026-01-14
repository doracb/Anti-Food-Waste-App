import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
import { FaSignOutAlt, FaUserCircle, FaUsers, FaCarrot, FaStore } from 'react-icons/fa';

export default function Navbar() {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    if (!user) return null;

    return (
        <nav style={styles.nav}>
            {/* LOGO - Stânga */}
            <div style={styles.logo}>
                <Link to="/dashboard" style={styles.logoLink}>
                    FoodShare
                </Link>
            </div>

            <div style={styles.menu}>
                <Link to="/dashboard" style={styles.link}>
                    <FaCarrot /> Frigider
                </Link>
                <Link to="/city/available" style={styles.link}>
                    <FaStore /> Marketplace
                </Link>

                <Link to="/groups" style={styles.link}>
                    <FaUsers /> Grupuri
                </Link>
                <Link to="/city/users" style={styles.link}>
                    <FaUsers /> Vecini
                </Link>
            </div>

            <div style={styles.userSection}>
                <Link to="/profile" style={styles.profileLink}>
                    <FaUserCircle size={20} />
                    <span style={{ marginLeft: '5px' }}>{user.username}</span>
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn} title="Deconectare">
                    <FaSignOutAlt />
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        background: '#2c3e50',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'sticky', 
        top: 0,
        zIndex: 1000
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        flex: 1
    },
    logoLink: { color: '#2ecc71', textDecoration: 'none' },

    menu: {
        display: 'flex',
        gap: '30px',
        flex: 2,
        justifyContent: 'center'
    },

    link: {
        color: '#ecf0f1',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'color 0.2s'
    },

    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flex: 1,
        justifyContent: 'flex-end'
    },
    profileLink: {
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        background: 'rgba(255,255,255,0.1)',
        padding: '5px 10px',
        borderRadius: '20px'
    },
    logoutBtn: {
        background: '#c0392b',
        border: 'none',
        color: 'white',
        padding: '8px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '35px',
        height: '35px'
    }
};