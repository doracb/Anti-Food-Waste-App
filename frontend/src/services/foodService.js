import { getCurrentUserId, getCurrentUser } from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000');

const getAuthHeaders = () => {
    const user = getCurrentUser();
    const headers = {
        "Content-Type": "application/json",
    };

    if (user && user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
    }

    return headers;
};

export const getMyFoods = async () => {
    const user = getCurrentUser();
    if (!user || !user.id) {
        throw new Error("User neautentificat!");
    }

    const response = await fetch(`${API_URL}/api/foods/user/${user.id}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Eroare la preluarea produselor.");
    }
    return await response.json();
};

export const addFood = async (foodData) => { 
    const user = getCurrentUser();
    if (!user || !user.id) {
        throw new Error("User neautentificat!");
    }

    const payload = {
        ...foodData,
        user_id: user.id, 
    };

    const response = await fetch(`${API_URL}/api/foods`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Eroare la adăugarea produsului.");
    }
    return await response.json();
};

export const deleteFood = async (foodId) => {
    const response = await fetch(`${API_URL}/api/foods/${foodId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }); 
    
    if (!response.ok) throw new Error("Eroare la ștergerea produsului."); 
};

export const shareFood = async (foodId) => {
    const user = getCurrentUser();
    const response = await fetch(`${API_URL}/api/foods/${foodId}/available/${user.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Eroare la partajarea produsului.");
    return await response.json();
};

export const getCityFoods = async (city) => {
    const response = await fetch(`${API_URL}/api/foods/city/${city}`, {
        headers: { "Content-Type": "application/json" } 
    });

    if (!response.ok) throw new Error("Eroare la încărcarea produselor."); 
    return await response.json();
};

export const getFoodById = async (id) => {
    const response = await fetch(`${API_URL}/api/foods/${id}`, {
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Eroare la încărcarea detaliilor produsului.");
    return await response.json();
};