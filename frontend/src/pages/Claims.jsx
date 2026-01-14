import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';

export default function Claims() {
    return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
            <FaBoxOpen size={60} color="#ffc107" style={{ marginBottom: '20px' }} />
            <h1>Produsele Tale Revendicate</h1>
            <p>Aici vor apărea alimentele pe care le-ai rezervat de la alți utilizatori.</p>

            <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px', display: 'inline-block' }}>
                <p>Momentan nu ai revendicat nimic.</p>
                <Link to="/city/available">
                    <button style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
                        Mergi la Marketplace
                    </button>
                </Link>
            </div>
        </div>
    );
}