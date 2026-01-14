import { useState, useEffect } from 'react';
import { getCurrentUserId } from '../services/authService';
import { getUserGroups, createGroup, addMemberByEmail } from '../services/groupService';
import { FaUsers, FaPlus, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Group() {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [activeGroupId, setActiveGroupId] = useState(null);

    const userId = getCurrentUserId();

    useEffect(() => {
        if (userId) {
            loadGroups();
        }
    }, [userId]);

    const loadGroups = async () => {
        try {
            const data = await getUserGroups();
            setGroups(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName) return;
        try {
            await createGroup(newGroupName);
            setNewGroupName('');
            loadGroups();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleInvite = async (groupId) => {
        if (!inviteEmail) return;
        try {
            await addMemberByEmail(groupId, inviteEmail);
            alert(`L-am adăugat pe ${inviteEmail} în grup!`);
            setInviteEmail('');
            setActiveGroupId(null);
        } catch (error) {
            alert("Eroare: " + error.message);
        }
    };

    if (!userId) {
        return <div style={{ padding: '20px' }}>Trebuie să te loghezi.</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333' }}>
                <FaUsers size={36} color="#007bff" /> Grupurile Mele
            </h1>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '15px' }}>Creează un grup nou</h3>
                <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Nume grup (ex: Colegi de apartament)"
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        <FaPlus /> Creează
                    </button>
                </form>
            </div>
            <div style={{ display: 'grid', gap: '20px' }}>
                {groups.map(group => (
                    <div key={group.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '10px', position: 'relative', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '50%' }}>
                                <FaUsers color="#007bff" size={20} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{group.name}</h2>
                                <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>Creat de ID: ...{group.owner_id.slice(-4)}</p>
                            </div>
                        </div>
                        <Link to={`/group/${group.id}`}>
                            <button style={{
                                background: '#6c757d', color: 'white', border: 'none',
                                padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold',
                                marginTop: '15px'
                            }}>
                                Vezi Detalii & Membri
                            </button>
                        </Link>
                        <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaUserPlus color="#666" /> Invită un prieten:
                            </p>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input
                                    placeholder="Email prieten"
                                    value={activeGroupId === group.id ? inviteEmail : ''}
                                    onChange={(e) => {
                                        setActiveGroupId(group.id);
                                        setInviteEmail(e.target.value);
                                    }}
                                    style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button
                                    onClick={() => handleInvite(group.id)}
                                    style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0 15px', fontWeight: 'bold' }}
                                >
                                    Adaugă
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}