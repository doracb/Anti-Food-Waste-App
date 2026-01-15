import { getCurrentUserId, getCurrentUser } from './authService';

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

export const getUserProfile = async (userId) => {
    const id = userId || getCurrentUserId();

    const response = await fetch(`${API_URL}/api/users/${id}`, {
        headers: getAuthHeaders() 
    });

    if (!response.ok) throw new Error('Nu am putut încărca profilul');
    return await response.json();
}

export const updateUserProfile = async (data) => {
    const id = getCurrentUserId();

    const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), 
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Nu am putut actualiza profilul');
    return await response.json();
};

export const getUsersInCity = async (city) => {
    const response = await fetch(`${API_URL}/api/users/city/${city}`, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Nu am găsit utilizatori în acest oraș');
    return await response.json();
};