import { useParams, Link } from 'react-router-dom';
import { FaAppleAlt, FaArrowLeft } from 'react-icons/fa';

export default function FoodDetails() {
    const { id } = useParams();

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>

                <FaAppleAlt size={80} color="#ff6b6b" style={{ marginBottom: '20px' }} />

                <h1 style={{ color: '#333' }}>Detalii Aliment</h1>

                <p style={{ fontSize: '1.1rem', color: '#666' }}>
                    Vizualizezi produsul cu ID-ul:
                </p>
                <code style={{ background: '#eee', padding: '5px 10px', borderRadius: '4px', fontSize: '1.2rem', display: 'block', margin: '10px 0' }}>
                    {id}
                </code>

                <div style={{ marginTop: '30px', padding: '15px', background: '#e3f2fd', borderRadius: '8px', color: '#0d47a1' }}>
                    <strong>Notă:</strong> Această pagină este momentan în construcție.
                    <br />
                    Colegul tău va implementa aici afișarea detaliilor complete (calorii, descriere, etc).
                </div>

                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px', margin: '30px auto 0', padding: '10px 20px', background: 'transparent', border: '1px solid #666', borderRadius: '5px', cursor: 'pointer', color: '#666' }}>
                        <FaArrowLeft /> Îmapoi la Frigider
                    </button>
                </Link>
            </div>
        </div>
    );
}