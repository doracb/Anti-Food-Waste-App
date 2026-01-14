import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await loginUser(email, password);
            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <FaSignInAlt color="#007bff" /> Autentificare
            </h2>

            {error && <p style={{ color: 'red', textAlign: 'center', background: '#ffe6e6', padding: '5px' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                    <FaEnvelope color="#666" style={{ marginRight: '10px' }} />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ border: 'none', outline: 'none', width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                    <FaLock color="#666" style={{ marginRight: '10px' }} />
                    <input
                        type="password"
                        placeholder="Parola"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ border: 'none', outline: 'none', width: '100%' }}
                    />
                </div>

                <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Intră în cont
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Nu ai cont? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold' }}>Înregistrează-te</Link>
            </p>
        </div>
    );
}