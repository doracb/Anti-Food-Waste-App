import { FacebookShareButton, FacebookIcon } from "react-share";

export default function SocialShare({ foodId, foodName, ownerName }) {
    const baseUrl = window.location.origin;
    const productUrl = `${baseUrl}/food/${foodId}`;

    const instagramCaption = `Disponibil: ${foodName}! 
    Găsești acest produs la utilizatorul ${ownerName}.
    Vezi detalii și revendică aici: ${productUrl}
    #FoodSharing #NoWaste`;

    const copyForInstagram = () => {
            navigator.clipboard.writeText(instagramCaption);
            alert("Textul postării a fost copiat! Poți da Paste (Lipire) pe Instagram (Story/Feed).");
        };

        return (
            <div style={styles.container}>
                <p style={{fontSize: '0.8rem', margin: '0 0 5px 0', color: '#666'}}>Promovează pe:</p>
                <div style={styles.buttons}>
                    <FacebookShareButton url={productUrl} hashtag="#FoodSharing">
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <button onClick={copyForInstagram} style={styles.instaBtn} title="Copiază text pt Instagram">
                        IG
                    </button>
                </div>
            </div>
        );
}

const styles = {
    container: {
        marginTop: '10px',
        paddingTop: '5px',
        borderTop: '1px dashed #eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    buttons: {
        display: 'flex',
        gap: '10px',
    },
    instaBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)',
        color: 'white',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};