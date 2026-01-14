import { getCurrentUserId } from "./authService";

const getHeaders = () => ({
    'Content-Type': 'application/json'
});

const findUserByEmail = async (email) => {
    const response = await fetch(`/api/users?q=${email}`);
    if (!response.ok) {
        throw new Error('Utilizatorul nu fost găsit');
    }
    const user = await response.json();
    return user.id;
};

export const createGroup = async (groupName) => {
    const ownerId = getCurrentUserId();
    const response = await fetch('/api/groups', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: groupName, owner_id: ownerId }),
    });
    if (!response.ok) {
        throw new Error('Eroare la crearea grupului');
    }
    return await response.json();
};

export const getUserGroups = async () => {
    const userId = getCurrentUserId();
    const response = await fetch(`/api/groups/user/${userId}`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Eroare la preluarea grupurilor');
    }
    return await response.json();
};

export const addMemberByEmail = async (groupId, email) => {
    try {
        const friendId = await findUserByEmail(email);
        const response = await fetch(`/api/groups/${groupId}/members`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ user_id: friendId, tag: 'member' })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Eroare la adăugare');
        }
    } catch (error) {
        throw (error);
    }
};

export const getGroupDetails = async (groupId) => {
    const response = await fetch(`/api/groups/${groupId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Nu am putut încărca grupul');
    return await response.json();
};

export const updateMemberTag = async (groupId, userId, newTag) => {
    const response = await fetch(`/api/groups/${groupId}/members/${userId}/tag`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ tag: newTag })
    });
    if (!response.ok) throw new Error('Eroare la actualizarea etichetei');
    return await response.json();
};

export const leaveGroup = async (groupId) => {
    const userId = getCurrentUserId();
    const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ user_id: userId })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Eroare la părăsirea grupului');
    }

    return true;
};

export const getGroupFoods = async (groupId) => {
    const response = await fetch(`/api/groups/${groupId}/foods`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Nu am putut încărca alimentele grupului');
    return await response.json();
};