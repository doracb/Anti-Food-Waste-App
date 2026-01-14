import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCityFoods } from "../services/foodService";
import { getCurrentUser } from "../services/authService";

export default function MarketPlace() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const user = getCurrentUser();

    const loadMarketPlace = async () => {
        try {
            const data = await getCityFoods(user.city);
            setFoods(data);
        } catch (err) {
            setLoading(false);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect( () => {
        if (user && user.city) loadMarketPlace();
        else {
            setLoading(false);
            setError("Trebuie să ai un oraș setat în profil pentru a vizualiza produsele disponibile");
        }
    }, []);

    const filteredFoods = foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDaysUntilExpiration = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expirationDate = new Date(dateString);
        const diffTime = expirationDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (!user) return <div style={{padding: '20px'}}>Autentificare necesară!</div>

    return (
        <div style={{maxWidth: '1000px', margin: '0 auto', padding: '20px'}}>
            <div style={styles.header}>
                <h1>Marketplace - {user.city}</h1>
                <p>Vezi ce alimente sunt disponibile în orașul tău</p>
            </div>

            <div style={{marginBottom: '20px'}}>
                <input 
                type="text"
                placeholder="Caută produse (ex. lactate...)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchBar}
                />
            </div>

            {error && <p style={{color: 'red'}}>{error}</p>}

            {loading ? <p>Căutam produse în apropiere...</p> : (
                <div style={styles.grid}>
                    {filteredFoods.length === 0 && !error && (
                        <p>Nu am găsit niciun produs momentan în {user.city}</p>
                    )}

                    {filteredFoods.map((food) => {
                        const daysLeft = getDaysUntilExpiration(food.expiration_date);
                        const ownerName = food.User ? (food.User.name || food.User.username) : "Necunoscut";

                        return (
                            <div key={food.id} style = {styles.card}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.categoryTag}>{food.category}</span>
                                    <span style={styles.ownerTag}>{ownerName}</span>
                                </div>

                                <h3>{food.name}</h3>

                                <div style={{margin: '10px 0'}}>
                                    <p>Cantitate: <strong>{food.quantity_value} {food.quantity_unit}</strong></p>
                                    <p style={{color: daysLeft <= 3 ? '#d9534f' : '#333'}}>
                                        Expiră în {daysLeft} zile
                                    </p>
                                </div>

                                <Link to={`/food/${food.id}`} style={styles.linkButton}>
                                    Vezi Detalii și Revendică
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    header: {
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    searchBar: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
    },
    card: {
        border: '1px solid #eee',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.02s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px'
    },
    categoryTag: {
        fontSize: '0.8em',
        backgroundColor: '#e9ecef',
        padding: '4px 8px',
        borderRadius: '15px',
        color: '#495057'
    },
    ownerTag: {
        fontSize: '0.8em',
        backgroundColor: '#e9ecef',
        padding: '4px 8px',
        borderRadius: '15px',
        color: '#0d47a1',
        fontWeight: 'bold'
    },
    linkButton: {
        display: 'block',
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '15px',
        fontWeight: 'bold'
    }
}