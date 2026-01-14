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
}

export const createGroup = async (groupData) => {
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
}

export const getUserGroups = async () => {
    const userId = getCurrentUserId();
    const response = await fetch(`/api/groups/user/${userId}`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Eroare la preluarea grupurilor');
    }
    return await response.json();
}

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
}