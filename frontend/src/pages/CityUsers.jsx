import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { getUsersInCity } from '../services/userService';
import { FaCity, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function CityUsers() {
    const [users, setUsers] = useState([]);
    const [myCity, setMyCity] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.city) {
            setMyCity(currentUser.city);
            loadUsers(currentUser.city);
        }
    }, []);

    const loadUsers = async (city) => {
        try {
            const data = await getUsersInCity(city);
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>
                <FaCity color="#6f42c1" style={{ marginRight: '10px' }} />
                Comunitatea din {myCity}
            </h1>
            <p>Acești utilizatori locuiesc în același oraș cu tine!</p>

            {loading ? <p>Căutăm vecini...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {users.length === 0 ? <p>Nu am găsit alți utilizatori în {myCity}.</p> :
                        users.map(user => (
                            <div key={user.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', textAlign: 'center', background: 'white' }}>
                                <FaUserCircle size={50} color="#ccc" />
                                <h3>{user.name}</h3>
                                <p style={{ color: '#666' }}>@{user.username}</p>
                                <Link to={`/profile/${user.id}`}>
                                    <button style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                                        Vezi Profil
                                    </button>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
}