import { getCurrentUser } from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000');

const getAuthHeaders = () => {
    const user = getCurrentUser();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }

    return headers;
};

export const createClaim = async (foodId) => {
    const user = getCurrentUser();
    if (!user) throw new Error("Trebuie să fii autentificat.");

    const response = await fetch(`${API_URL}/api/claims`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            food_id: foodId,
            claimant_id: user.id
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Eroare la revendicare");
    }
    return await response.json();
};

export const getMyClaims = async () => {
    const user = getCurrentUser();
    if (!user) return [];

    const response = await fetch(`${API_URL}/api/claims/user/${user.id}`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error("Nu am putut încărca revendicările.");
    }
    return await response.json();
};

export const getClaimsOnMyFood = async () => {
    const user = getCurrentUser();
    if (!user) return [];

    const response = await fetch(`${API_URL}/api/claims/owner/${user.id}`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
         if (response.status === 404) return [];
         throw new Error("Eroare la încărcarea cererilor primite.");
    }
    return await response.json();
};

export const updateClaimStatus = async (claimId, status) => {
    const user = getCurrentUser();
    
    const response = await fetch(`${API_URL}/api/claims/${claimId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, userId: user.id })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Eroare la actualizarea statusului");
    }
    return await response.json();
};