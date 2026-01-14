const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export const setUser = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        return null;
    }
    return JSON.parse(userStr);
}

export const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

export const getCurrentUserId = () => {
    const user = getCurrentUser();
    return user ? user.id : null;
}

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Eroare de înregistrare');
    }

    const data = await response.json();

    if (data.token) {
        setUser(data);
    }

    return data;
}

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Date incorecte');
    }

    const user = await response.json();

    if (user && user.token) {
        setUser(user);
    }

    return user;
}