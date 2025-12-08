import type {User} from '../services/api';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    return token !== null && token !== '';
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
};

/**
 * Clear authentication data (logout)
 */
export const clearAuth = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
};

/**
 * Store authentication data
 */
export const storeAuth = (token: string, user: User): void => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get auth token
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};