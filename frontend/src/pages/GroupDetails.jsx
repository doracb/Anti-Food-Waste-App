import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGroupDetails, updateMemberTag, leaveGroup, getGroupFoods } from '../services/groupService';
import { getCurrentUserId } from '../services/authService';
import { FaUserTag, FaSignOutAlt, FaArrowLeft, FaUtensils, FaClock } from 'react-icons/fa';

export default function GroupDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();

    const [group, setGroup] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingMemberId, setEditingMemberId] = useState(null);
    const [tempTag, setTempTag] = useState('');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [groupData, foodsData] = await Promise.all([
                getGroupDetails(id),
                getGroupFoods(id)
            ]);

            setGroup(groupData);
            setFoods(foodsData);
        } catch (err) {
            alert(err.message);
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTag = async (memberId) => {
        try {
            await updateMemberTag(id, memberId, tempTag);
            setEditingMemberId(null);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLeaveGroup = async () => {
        if (!window.confirm("Ești sigur că vrei să părăsești grupul?")) return;
        try {
            await leaveGroup(id);
            navigate('/groups');
        } catch (err) {
            alert(err.message);
        }
    };

    const getDaysUntilExpiration = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expirationDate = new Date(dateString);
        const diffTime = expirationDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) return <div style={{ padding: 20 }}>Se încarcă detaliile grupului...</div>;
    if (!group) return null;

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/groups')} style={styles.backBtn}>
                <FaArrowLeft /> Înapoi la Grupuri
            </button>

            <div style={styles.header}>
                <div>
                    <h1 style={{ margin: '0 0 10px 0' }}>{group.name}</h1>
                    <span style={{ background: '#e3f2fd', color: '#0d47a1', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9rem' }}>
                        ID Grup: {group.id.slice(0, 8)}...
                    </span>
                </div>
                <button onClick={handleLeaveGroup} style={styles.leaveBtn}>
                    <FaSignOutAlt /> Părăsește
                </button>
            </div>

            <div style={styles.gridContainer}>
                <div style={styles.membersSection}>
                    <h3>Membrii ({group.members ? group.members.length : 0})</h3>

                    <div style={styles.membersList}>
                        {group.members && group.members.map(member => {
                            const memberTag = member.GroupMember ? member.GroupMember.tag : '';
                            const isMe = member.id === currentUserId;

                            return (
                                <div key={member.id} style={styles.memberCard}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={styles.avatar}>
                                            {member.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                {member.username} {isMe && "(Eu)"}
                                            </div>
                                            {member.id === group.owner_id && <span style={styles.ownerBadge}>👑 Admin</span>}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '5px' }}>
                                        {editingMemberId === member.id ? (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input
                                                    value={tempTag}
                                                    onChange={(e) => setTempTag(e.target.value)}
                                                    style={{ width: '100%', padding: '3px' }}
                                                />
                                                <button onClick={() => handleSaveTag(member.id)} style={{ cursor: 'pointer' }}>OK</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={styles.tagDisplay}>{memberTag || "-"}</span>
                                                {(isMe || currentUserId === group.owner_id) && (
                                                    <FaUserTag
                                                        style={{ cursor: 'pointer', color: '#888' }}
                                                        onClick={() => {
                                                            setEditingMemberId(member.id);
                                                            setTempTag(memberTag || '');
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={styles.fridgeSection}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaUtensils /> Frigiderul Comun
                    </h3>

                    {foods.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>
                            Niciun aliment disponibil momentan în acest grup.
                        </p>
                    ) : (
                        <div style={styles.foodGrid}>
                            {foods.map(food => {
                                const daysLeft = getDaysUntilExpiration(food.expiration_date);
                                const isMyFood = food.user_id === currentUserId;

                                return (
                                    <div key={food.id} style={styles.foodCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={styles.categoryBadge}>{food.category}</span>
                                            {isMyFood && <span style={{ fontSize: '0.8rem', color: '#888' }}>(al tău)</span>}
                                        </div>

                                        <h4 style={{ margin: '10px 0' }}>{food.name}</h4>

                                        <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '10px' }}>
                                            Cantitate: <strong>{food.quantity_value} {food.quantity_unit}</strong>
                                        </div>

                                        <div style={{ fontSize: '0.85rem', color: daysLeft <= 3 ? 'red' : 'green', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaClock /> Expiră în {daysLeft} zile
                                        </div>

                                        <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                De la: <strong>{food.User ? food.User.username : 'Unknown'}</strong>
                                            </div>

                                            {!isMyFood && (
                                                <Link to={`/food/${food.id}`} style={{ textDecoration: 'none' }}>
                                                    <button style={styles.claimBtn}>Vezi & Revendică</button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px'
    },
    backBtn: { background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', color: '#666' },
    leaveBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    membersList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    memberCard: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px', background: 'white', borderRadius: '8px',
        border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    avatar: {
        width: '40px', height: '40px', borderRadius: '50%', background: '#007bff',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
    },
    ownerBadge: { background: '#ffc107', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', marginLeft: '5px', color: '#333' },
    tagSection: { minWidth: '200px', display: 'flex', justifyContent: 'flex-end' },
    tagDisplay: { background: '#e9ecef', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9rem', color: '#555' },
    editBtn: { background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', padding: '5px' },
    saveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
    cancelBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
    fridgeSection: { marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center' },
    foodGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px'
    },
    foodCard: {
        background: 'white', padding: '15px', borderRadius: '10px',
        border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s'
    },
    categoryBadge: {
        background: '#e9ecef', color: '#495057', padding: '3px 8px', borderRadius: '10px',
        fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'
    },
    claimBtn: {
        width: '100%', marginTop: '10px', background: '#28a745', color: 'white',
        border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
    }
};