import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById, deleteFood } from '../services/foodService';

export default function FoodDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const user = getCurrentUser();

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const data = await getFoodById(id);
                setFood(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Sigur ștergi acest produs?")) return;
        try {
            await deleteFood(id);
            alert("Produs șters cu succes!");
            navigate('/dashboard'); 
        } catch (err) {
            alert(err.message);
        }
    };

    const handleClaim = () => {
        
    };

    const getDaysUntilExpiration = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expirationDate = new Date(dateString);
        const diffTime = expirationDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) return <div style={styles.centerMsg}>Se încarcă detaliile... </div>;
    
    if (error) return (
        <div style={styles.centerMsg}>
            <h3 style={{color: 'red'}}>Eroare</h3>
            <p>{error}</p>
            <button onClick={() => navigate('/dashboard')} style={styles.backButton}>Înapoi</button>
        </div>
    );

    if (!food) return <div style={styles.centerMsg}>Produsul nu a fost găsit.</div>;

    const isOwner = user && user.id === food.user_id;
    const daysLeft = getDaysUntilExpiration(food.expiration_date);
    const ownerName = food.User ? (food.User.name || food.User.username) : "Necunoscut";

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                <div style={styles.header}>
                    <span style={styles.categoryTag}>{food.category}</span>
                    {food.is_available ? 
                        <span style={styles.statusAvailable}>Disponibil</span> : 
                        <span style={styles.statusPrivate}>Privat</span>
                    }
                </div>

                <h1 style={styles.title}>{food.name}</h1>
                
                <div style={styles.infoContainer}>
                    <div style={styles.row}>
                        <strong>Cantitate:</strong> 
                        <span>{food.quantity_value} {food.quantity_unit}</span>
                    </div>
                    
                    <div style={styles.row}>
                        <strong>Expiră în:</strong> 
                        <span style={{color: daysLeft <= 3 ? '#d9534f' : '#28a745', fontWeight: 'bold'}}>
                            {daysLeft} zile
                        </span> 
                        <span style={{fontSize: '0.8em', color: '#666'}}>
                            ({new Date(food.expiration_date).toLocaleDateString()})
                        </span>
                    </div>

                    <div style={styles.row}>
                        <strong>Proprietar:</strong> 
                        <span>{ownerName}</span>
                    </div>
                    
                    <div style={styles.row}>
                        <strong>Oraș:</strong> 
                        <span>{food.User ? food.User.city : '-'}</span>
                    </div>
                </div>

                <div style={styles.actions}>
                    {isOwner ? (
                        <button onClick={handleDelete} style={styles.deleteButton}>
                            Șterge Produsul
                        </button>
                    ) : (
                        <button 
                            onClick={handleClaim} 
                            style={styles.claimButton} 
                            disabled={!food.is_available}
                        >
                            {food.is_available ? "Revendică acest aliment" : " Indisponibil"}
                        </button>
                    )}
                    
                    <button onClick={() => navigate(-1)} style={styles.backButton}>
                        Înapoi
                    </button>
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    centerMsg: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem'
    },
    card: {
        background: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '1px solid #eee'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    title: {
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '2rem'
    },
    categoryTag: {
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    statusAvailable: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '6px 12px',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    statusPrivate: {
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        padding: '6px 12px',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    infoContainer: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    deleteButton: {
        padding: '15px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s'
    },
    claimButton: {
        padding: '15px',
        backgroundColor: '#4CAF50', 
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s'
    },
    backButton: {
        padding: '10px',
        backgroundColor: 'transparent',
        color: '#666',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px'
    }
};