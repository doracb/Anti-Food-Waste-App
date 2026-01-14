import { getCurrentUserId } from './authService';

const getHeaders = () => ({
    'Content-Type': 'application/json'
});

export const getUserProfile = async (userId) => {
    const id = userId || getCurrentUserId();
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Nu am putut încărca profilul');
    return await response.json();
}

export const updateUserProfile = async (data) => {
    const id = getCurrentUserId();
    const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Nu am putut actualiza profilul');
    return await response.json();
};

export const getUsersInCity = async (city) => {
    const response = await fetch(`/api/users/city/${city}`);
    if (!response.ok) throw new Error('Nu am găsit utilizatori în acest oraș');
    return await response.json();
};