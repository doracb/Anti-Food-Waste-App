import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyClaims } from '../services/claimService';
import { getCurrentUser } from '../services/authService';

export default function Claims() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const user = getCurrentUser();

    useEffect(() => {
        const loadClaims = async () => {
            try {
                const data = await getMyClaims();
                setClaims(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) loadClaims();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'accepted': return '#d4edda';
            case 'rejected': return '#f8d7da'; 
            default: return '#fff3cd';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'accepted': return 'Acceptat ✅';
            case 'rejected': return 'Respins ❌';
            default: return 'În Așteptare ⏳';
        }
    };

    if (!user) return <div style={{padding: 20}}>Autentificare necesară.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>📦 Revendicările Tale</h1>
                <p>Lista alimentelor pe care le-ai solicitat.</p>
            </div>

            {loading && <p>Se încarcă...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {!loading && claims.length === 0 && (
                <div style={styles.emptyState}>
                    <p>Nu ai revendicat niciun produs momentan.</p>
                    <Link to="/marketplace" style={styles.btnLink}>Mergi la Marketplace</Link>
                </div>
            )}

            <div style={styles.grid}>
                {claims.map((claim) => (
                    <div key={claim.id} style={{...styles.card, borderLeft: `5px solid ${getStatusColor(claim.status).replace('da','00').replace('cd','aa')}`}}>
                        
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <h3 style={{marginTop:0}}>{claim.Food ? claim.Food.name : 'Produs Șters'}</h3>
                            <span style={{
                                padding: '5px 10px', 
                                borderRadius: '15px', 
                                backgroundColor: getStatusColor(claim.status),
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {getStatusText(claim.status)}
                            </span>
                        </div>

                        <p style={{color: '#666', fontSize: '0.9rem'}}>
                            Data cererii: {new Date(claim.createdAt).toLocaleDateString()}
                        </p>
                        
                        {claim.Food && (
                             <p>Cantitate: {claim.Food.quantity_value} {claim.Food.quantity_unit}</p>
                        )}

                        {claim.status === 'accepted' && (
                            <div style={{marginTop: '10px', padding: '10px', background: '#e3f2fd', borderRadius: '5px'}}>
                                <strong>Succes!</strong> Poți contacta proprietarul pentru a ridica produsul.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    },
    header: {
        borderBottom: '1px solid #eee',
        marginBottom: '20px',
        paddingBottom: '10px'
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    card: {
        border: '1px solid #eee',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px'
    },
    btnLink: {
        display: 'inline-block',
        marginTop: '10px',
        padding: '10px 20px',
        background: '#28a745',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold'
    }
};