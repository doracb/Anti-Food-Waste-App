import {useState, useEffect} from 'react';
import { getMyFoods, addFood, deleteFood, shareFood } from '../services/foodService';
import { getCurrentUser } from '../services/authService';

export default function Dashboard() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [ formData, setFormData ] = useState({
        name: '',
        category: 'General',
        quantity_value: '',
        quantity_unit: 'buc',
        expiration_date: '',
    });

    const user = getCurrentUser();

    useEffect(() => {
        if (user) {
            loadFoods();
        }
    }, []);

    const loadFoods = async () => {
        try {
            const data = await getMyFoods();
            setFoods(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                quantity_value: formData.quantity_value ? parseFloat(formData.quantity_value) : null,
            };

            await addFood(payload);

            setFormData({
                name: '',
                category: 'General',
                quantity_value: '',
                quantity_unit: 'buc',
                expiration_date: '',
            });

            loadFoods();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (foodId) => {
        if (!window.confirm('Sigur doriți să ștergeți acest produs?')) return;
        try {
                await deleteFood(foodId);
                setFoods(foods.filter(food => food.id !== foodId));
            } catch (err) {
                alert(err.message);
            }
    };

    const handleShare = async (foodId) => {
        try {
            await shareFood(foodId); 
            alert('Produsul este acum vizibil si pentru ceilalti utilizatori.');
            loadFoods();
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

    if(!user) {
        return <div style={{padding: '20px'}}>Vă rugăm să vă autentificați.</div>;
    }

    return (
        <div style={{maxWidth: '1000px', margin: '0 auto', padding: '20px'}}>
            <h1>Frigiderul lui {user.name || user.username}</h1>
            <div style={styles.formContainer}>
                <h3>Adaugă un produs nou</h3>
                <form onSubmit={handleAddSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Nume Produs</label>
                        <input type="text" name="name" 
                    placeholder="Nume produs (ex: Iaurt cu fructe)" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Categoria</label>
                        <select name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        style={styles.input}>
                            <option value="General">General</option>
                            <option value="Lactate">Lactate</option>
                            <option value="Legume">Legume</option>
                            <option value="Fructe">Fructe</option>
                            <option value="Carne">Carne</option>
                            <option value="Bauturi">Panificație</option>
                            <option value="Dulciuri">Dulciuri</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Expirare</label>
                        <input type="date" name="expiration_date" 
                            value={formData.expiration_date} 
                            onChange={handleChange} 
                            required
                            style={styles.input}/>
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Cantitate</label>
                        <input type="number" 
                            step = "0.1"
                            name="quantity_value" 
                            value={formData.quantity_value} 
                            onChange={handleChange} 
                            style={{...styles.input, flex: 1}}
                            placeholder="Cantitate"/>
                        <input type="text" 
                            name="quantity_unit" 
                            value={formData.quantity_unit} 
                            onChange={handleChange} 
                            style={{...styles.input, width: '60px'}}
                            placeholder="buc"/>
                    </div>
                    <div>
                        <button type="submit" style={styles.addButton}>Adaugă Produs</button>
                    </div>
                </form>
            </div>
            {loading ? <p>Se încarcă frigiderul...</p> : (
                    <div style={styles.cardContainer}>
                        {foods.length === 0 && <p>Frigiderul este gol. Adaugă primele produse!</p>}

                        {foods.map((food) => {
                            const daysLeft = getDaysUntilExpiration(food.expiration_date);
                            let cardBackground = '#fff';
                            let statusText = `${daysLeft} zile`
                            let textColor = '#333'

                            if (daysLeft < 0) {
                                cardBackground = '#ffe6e6';
                                let statusText = 'Expirat'
                                let textColor = 'red'
                            } else if (daysLeft <= 3) {
                                cardBackground = '#fff0f0';
                                let statusText = 'Expirat'
                                let textColor = '#d9534f'
                            } else if (daysLeft <= 7) {
                                cardBackground = '#fffbe6';
                            }

                            return (
                                <div key={food.id} style={{...styles.card, backgroundColor: cardBackground}}>
                                    <div style={styles.cardHeader}>
                                        <span style={styles.categoryTag}>{food.category}</span>
                                        {food.is_available && <span style={styles.sharedTag}>Partajat Public</span>}
                                        <h3>{food.name}</h3>
                                        <p>Cantitate: <strong>{food.quantity_value} {food.quantity_unit}</strong></p>
                                        <p style={{ color: textColor, fontWeight: 'bold'}}>{statusText}</p>

                                        <div style={styles.actions}>
                                        {!food.is_available && daysLeft >= 0 && (
                                            <button onClick={() => handleShare(food.id)} style={styles.shareButton}>
                                                Share
                                            </button>
                                        )}

                                        {food.is_available && (
                                            <span style={{color: 'green', fontSize: '0.9em'}}>Disponibil în oraș</span>
                                        )}

                                        <button onClick={() => handleDelete(food.id)} style={styles.deleteButton}>
                                            Șterge
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
            )}
        </div> 
    );
}

const styles = {
    formContainer: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'flex-end'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px', 
        flex: '1 1 150px'
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
        boxSizing: 'border-box'
    },
    addButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        heihgt: '40px',
        width: '100%'
    },
    cardContainer: {
        display: 'flex',       
        flexWrap: 'wrap',      
        gap: '20px',           
        justifyContent: 'flex-start', 
    },
    card: {
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        flex: '1 1 280px',
        maxWidth: '350px',
        maxHeight: '250px'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
    },
    categoryTag: {
        fontSize: '0.8em',
        backgroundColor: '#e9ecef',
        padding: '4px 8px',
        borderRadius: '15px',
        fontWeight: 'bold',
        color: '#555'
    },
    sharedTag: {
        fontSize: '0.8em',
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '4px 8px',
        borderRadius: '15px',
        fontWeight: 'bold'
    },
    actions: {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
    },
    shareButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        flex: 1
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};