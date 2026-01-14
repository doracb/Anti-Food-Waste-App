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
                {/* Partea Colegului (Mâncare) */}
                <Link to="/dashboard" style={styles.link}>
                    <FaCarrot /> Frigider
                </Link>
                <Link to="/city/available" style={styles.link}>
                    <FaStore /> Marketplace
                </Link>

                {/* Partea Ta (Social) */}
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
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold' },
  logoLink: { color: '#2ecc71', textDecoration: 'none' },
  menu: { display: 'flex', gap: '20px' },
  link: { 
    color: '#ecf0f1', 
    textDecoration: 'none', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    fontSize: '1rem',
    transition: 'color 0.2s'
  },
  userSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  profileLink: { 
    color: 'white', 
    textDecoration: 'none', 
    display: 'flex', 
    alignItems: 'center',
    fontWeight: 'bold'
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #e74c3c',
    color: '#e74c3c',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  }
};