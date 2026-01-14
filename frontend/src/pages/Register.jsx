import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from '../services/authService';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        city: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await registerUser(formData);
            alert("Cont creat cu succes!");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>Înregistrare</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input name="name" placeholder="Nume Complet" onChange={handleChange} required style={{ padding: '10px' }} />
                <input name="username" placeholder="Username" onChange={handleChange} required style={{ padding: '10px' }} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ padding: '10px' }} />
                <input name="city" placeholder="Oraș" onChange={handleChange} required style={{ padding: '10px' }} />
                <input name="password" type="password" placeholder="Parolă" onChange={handleChange} required style={{ padding: '10px' }} />

                <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Creează Cont
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Ai deja cont? <Link to="/login" style={{ color: '#007bff' }}>Login</Link>
            </p>
        </div>
    );
}