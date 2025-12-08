import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 unauthorized responses (token expired/invalid)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============= INTERFACES =============

export interface User {
    id: number;
    username: string;
    email: string;
    password?: string | null;
}

export interface SignUpData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    usernameOrEmail: string;
    password: string;
}

// Specific response for signup/login
export interface AuthResponse {
    success: boolean;
    message: string;
    user: User | null;
    token: string | null;
}

// ============= AUTH FUNCTIONS =============

// Sign up function
export const signUp = async (userData: SignUpData): Promise<AuthResponse> => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data: AuthResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            message: 'Network error occurred',
            user: null,
            token: null,
        };
    }
};

// Login function
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data: AuthResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Network error occurred',
            user: null,
            token: null,
        };
    }
};

// Google Authentication function
        export const googleAuth = async (token: string): Promise<AuthResponse> => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/google`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({token}),
                });

                return await response.json();
            } catch (error) {
                console.error('Google auth error:', error);
                return {
                    success: false,
                    message: 'Google authentication failed',
                    user: null,
                    token: null,
            };
        }
    };

export default api;