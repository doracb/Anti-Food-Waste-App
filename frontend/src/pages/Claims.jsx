import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyClaims, getClaimsOnMyFood, updateClaimStatus } from '../services/claimService';
import { getCurrentUser } from '../services/authService';
import { FaArrowRight, FaCheck, FaTimes, FaInbox, FaPaperPlane } from 'react-icons/fa';

export default function Claims() {
    const [myClaims, setMyClaims] = useState([]);
    const [incomingClaims, setIncomingClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const user = getCurrentUser();

    useEffect(() => {
        if (user) loadAllClaims();
    }, []);

    const loadAllClaims = async () => {
        setLoading(true);
        try {
            const [myData, incomingData] = await Promise.all([
                getMyClaims(),
                getClaimsOnMyFood()
            ]);
            setMyClaims(myData);
            setIncomingClaims(incomingData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (claimId, newStatus) => {
        try {
            await updateClaimStatus(claimId, newStatus);
            loadAllClaims();
            alert(`Cererea a fost ${newStatus === 'accepted' ? 'acceptată' : 'respinsă'}!`);
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return '#d4edda';
            case 'rejected': return '#f8d7da';
            default: return '#fff3cd';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'accepted': return 'Acceptat';
            case 'rejected': return 'Respins';
            default: return 'În Așteptare';
        }
    };

    if (!user) return <div style={{ padding: 20 }}>Autentificare necesară.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Centrul de Revendicări</h1>
                <p>Gestionează cererile trimise și primite.</p>
            </div>

            {loading && <p>Se încarcă...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#007bff' }}>
                    <FaInbox /> Cereri Primite de la Vecini
                </h2>

                {!loading && incomingClaims.length === 0 && (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Nu ai nicio cerere pentru produsele tale momentan.</p>
                )}

                <div style={styles.grid}>
                    {incomingClaims.map((claim) => (
                        <div key={claim.id} style={{ ...styles.card, borderLeft: '5px solid #007bff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{claim.Food ? claim.Food.name : 'Produs Șters'}</h3>
                                    <p style={{ margin: 0, color: '#555' }}>
                                        Solicitant: <strong>{claim.User ? (claim.User.name || claim.User.username) : 'Utilizator Șters'}</strong>
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: '#888' }}>
                                        Din orașul: {claim.User ? claim.User.city : '-'}
                                    </p>
                                </div>

                                <span style={{
                                    padding: '5px 10px',
                                    borderRadius: '15px',
                                    backgroundColor: getStatusColor(claim.status),
                                    fontSize: '0.8rem', fontWeight: 'bold'
                                }}>
                                    {getStatusText(claim.status)}
                                </span>
                            </div>

                            {claim.status === 'pending' && (
                                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleStatusUpdate(claim.id, 'accepted')}
                                        style={styles.btnAccept}
                                    >
                                        <FaCheck /> Acceptă
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(claim.id, 'rejected')}
                                        style={styles.btnReject}
                                    >
                                        <FaTimes /> Respinge
                                    </button>
                                </div>
                            )}

                            {claim.status === 'accepted' && (
                                <div style={{ marginTop: '10px', color: 'green', fontSize: '0.9rem' }}>
                                    ✅ Ai acceptat cererea. Vecinul va veni să ridice produsul.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

            <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#28a745' }}>
                    <FaPaperPlane /> Ce ai cerut tu
                </h2>

                {!loading && myClaims.length === 0 && (
                    <div style={styles.emptyState}>
                        <p>Nu ai revendicat niciun produs momentan.</p>
                        <Link to="/marketplace" style={styles.btnLink}>Mergi la Marketplace</Link>
                    </div>
                )}

                <div style={styles.grid}>
                    {myClaims.map((claim) => (
                        <div key={claim.id} style={{ ...styles.card, borderLeft: `5px solid ${getStatusColor(claim.status).replace('da', '00').replace('cd', 'aa')}` }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ marginTop: 0 }}>{claim.Food ? claim.Food.name : 'Produs Șters'}</h3>
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

                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                Data cererii: {new Date(claim.createdAt).toLocaleDateString()}
                            </p>

                            {claim.status === 'accepted' && (
                                <div style={{ marginTop: '10px', padding: '10px', background: '#e3f2fd', borderRadius: '5px' }}>
                                    <strong>Succes!</strong> Poți contacta proprietarul pentru a ridica produsul.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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