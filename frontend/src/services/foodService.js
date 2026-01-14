import {getCurrentUserId} from './authService';

const getHeaders = () => ({
    "Content-Type": "application/json",
});

export const getMyFoods = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error("User neautentificat!");
    }
    const response = await fetch(`/api/foods/user/${userId}`);
    if (!response.ok) {
        throw new Error("Eroare la preluarea produselor.");
    }
    return await response.json();
};

export const addFood = async (foodData) => { 
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error("User neautentificat!");
    }
    const payload = {
        ...foodData,
        user_id: userId, 
    };
    const response = await fetch(`/api/foods`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Eroare la adăugarea produsului.");
    }
    return await response.json();
};

export const deleteFood = async (foodId) => {
    const response = await fetch(`/api/foods/${foodId}`, {
        method: 'DELETE',
    }); 
    if (!response.ok) throw new Error("Eroare la ștergerea produsului."); 
};

export const shareFood = async (foodId) => {
    const userId = getCurrentUserId();
    const response = await fetch(`/api/foods/${foodId}/available/${userId}`, {
        method: 'PATCH',
    });
    if (!response.ok) throw new Error("Eroare la partajarea produsului.");
    return await response.json();
};

export const getCityFoods = async (city) => {
    const response = await fetch(`/api/foods/city/${city}`);
    if (!response.ok) throw new Error("Eroare la încărcarea produselor."); 
    return await response.json();
};

export const getFoodById = async (id) => {
    const response = await fetch(`/api/foods/${id}`);
    if (!response.ok) throw new Error("Eroare la încărcarea detaliilor produsului.");
    return await response.json();
};