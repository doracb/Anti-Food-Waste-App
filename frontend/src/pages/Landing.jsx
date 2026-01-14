import { Link } from 'react-router-dom';
import { FaLeaf, FaUsers, FaHandHoldingHeart, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { MdOutlineFoodBank } from 'react-icons/md';
import { getCurrentUser } from '../services/authService';

export default function Landing() {
    const user = getCurrentUser();

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            {!user && (
                <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                        <FaLeaf /> Anti Food Waste
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button style={{ background: 'transparent', border: '1px solid #007bff', color: '#007bff', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaSignInAlt /> Login
                            </button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <button style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaUserPlus /> Înregistrare
                            </button>
                        </Link>
                    </div>
                </nav>
            )}
            <header style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(to bottom, #e9f7ef, #ffffff)' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#2c3e50' }}>
                    Nu arunca mâncarea, <br />
                    <span style={{ color: '#28a745' }}>împarte-o cu prietenii!</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                    Gestionează frigiderul virtual, primește alerte de expirare și donează alimentele pe care nu le consumi comunității tale.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <Link to="/register">
                        <button style={{ padding: '15px 30px', fontSize: '1.1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(40, 167, 69, 0.3)' }}>
                            Începe Acum Gratuit
                        </button>
                    </Link>
                </div>
            </header>
            <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Cum funcționează?</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                    <div style={{ textAlign: 'center', padding: '30px', border: '1px solid #eee', borderRadius: '15px', background: 'white' }}>
                        <MdOutlineFoodBank size={50} color="#ffc107" style={{ marginBottom: '15px' }} />
                        <h3>Frigider Virtual</h3>
                        <p style={{ color: '#777' }}>Ține evidența alimentelor și primește notificări înainte să expire.</p>
                    </div>

                    <div style={{ textAlign: 'center', padding: '30px', border: '1px solid #eee', borderRadius: '15px', background: 'white' }}>
                        <FaUsers size={50} color="#007bff" style={{ marginBottom: '15px' }} />
                        <h3>Grupuri & Comunitate</h3>
                        <p style={{ color: '#777' }}>Creează grupuri cu prietenii, familia sau vecini și vezi ce au disponibil.</p>
                    </div>

                    <div style={{ textAlign: 'center', padding: '30px', border: '1px solid #eee', borderRadius: '15px', background: 'white' }}>
                        <FaHandHoldingHeart size={50} color="#e83e8c" style={{ marginBottom: '15px' }} />
                        <h3>Donează & Revendică</h3>
                        <p style={{ color: '#777' }}>Ai gătit prea mult? Postează oferta și cineva din grup o poate revendica (Claim).</p>
                    </div>
                </div>
            </section>
        </div>
    );
}