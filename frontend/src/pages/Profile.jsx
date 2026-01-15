import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaMapMarkerAlt, FaSave, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../services/userService';
import { getCurrentUserId, setUser } from '../services/authService';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();

    const profileId = id || currentUserId;
    const isMyProfile = profileId === currentUserId;

    const [user, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', city: '' });

    useEffect(() => { loadProfile(); }, [profileId]);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile(profileId);
            setUserData(data);
            setFormData({ name: data.name, city: data.city });
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedUser = await updateUserProfile(formData);

            if (isMyProfile) {
                const newLocalStorageUser = { ...user, ...formData };
                setUser(newLocalStorageUser);
            }

            setIsEditing(false);
            loadProfile();
            alert('Profil actualizat!');
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Ești sigur că vrei să îți ștergi contul DEFINITIV? Această acțiune nu poate fi anulată.")) {
            return;
        }

        try {
            await deleteUserAccount();
            localStorage.removeItem('currentUser');
            alert("Contul a fost șters cu succes. Ne pare rău să te vedem plecând!");
            navigate('/login');
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    };

    if (!user) {
        return <div style={{ padding: '20px' }}>Se încarcă profilul...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <FaUserCircle size={80} color="#007bff" />
                <h1>{user.username}</h1>
                {isMyProfile && !isEditing && (
                    <button onClick={() => setIsEditing(true)} style={{ background: '#ffc107', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                        Editează Profilul
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                    <strong style={{ width: '100px' }}>Nume:</strong>
                    {isEditing ? (
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '5px' }} />
                    ) : (
                        <span>{user.name}</span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                    <FaMapMarkerAlt color="red" style={{ marginRight: '5px' }} />
                    <strong style={{ width: '80px' }}>Oraș:</strong>
                    {isEditing ? (
                        <input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} style={{ padding: '5px' }} />
                    ) : (
                        <span>{user.city}</span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                    <strong style={{ width: '100px' }}>Email:</strong>
                    <span>{user.email}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: '14px' }}>
                    <FaCalendarAlt style={{ marginRight: '5px' }} />
                    Membru din: {user.registration_date}
                </div>
            </div>

            {isEditing && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={handleUpdate} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <FaSave /> Salvează
                    </button>
                    <button onClick={() => setIsEditing(false)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                        Anulează
                    </button>
                </div>
            )}

            {isMyProfile && !isEditing && (
                <div style={{ marginTop: '50px', borderTop: '2px solid #ffeeba', paddingTop: '20px' }}>
                    <button
                        onClick={handleDeleteAccount}
                        style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        <FaTrash /> Șterge Contul
                    </button>
                </div>
            )}
        </div>
    );
}