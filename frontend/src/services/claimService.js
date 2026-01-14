import { getCurrentUserId } from './authService';

const getHeaders = () => ({
    'Content-Type': 'application/json'
});

export const createClaim = async (foodId) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Trebuie să fii autentificat.");

    const response = await fetch('/api/claims', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            food_id: foodId,
            claimant_id: userId
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Eroare la revendicare");
    }
    return await response.json();
};

export const getMyClaims = async () => {
    const userId = getCurrentUserId();
    const response = await fetch(`/api/claims/user/${userId}`);
    
    if (!response.ok) {
        throw new Error("Nu am putut încărca revendicările.");
    }
    return await response.json();
};

export const getClaimsOnMyFood = async () => {
    const userId = getCurrentUserId();
    const response = await fetch(`/api/claims/owner/${userId}`);
    
    if (!response.ok) throw new Error("Eroare la încărcarea cererilor primite.");
    return await response.json();
};

export const updateClaimStatus = async (claimId, status) => {
    const userId = getCurrentUserId();
    const response = await fetch(`/api/claims/${claimId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, userId })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Eroare la actualizarea statusului");
    }
    return await response.json();
};