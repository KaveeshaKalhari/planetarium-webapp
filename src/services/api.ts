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

    // ─── BLOG INTERFACES ──────────────────────────────────────────────────────────

export interface BlogResponse {
    id: number;
    title: string;
    category: string;
    content: string;
    excerpt: string;
    imageUrl: string | null;
    status: string;
    authorName: string;
    authorEmail: string;
    submittedAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
}

export interface BlogRequest {
    title: string;
    category: string;
    content: string;
    imageUrl?: string | null;
}

// ─── BLOG API FUNCTIONS ───────────────────────────────────────────────────────

export const submitBlog = async (request: BlogRequest): Promise<BlogResponse> => {
    const res = await api.post('/blogs', request);
    return res.data;
};

export const getApprovedBlogs = async (): Promise<BlogResponse[]> => {
    const res = await api.get('/blogs');
    return res.data;
};

export const getMyBlogs = async (): Promise<BlogResponse[]> => {
    const res = await api.get('/blogs/my');
    return res.data;
};

export const getPendingBlogs = async (): Promise<BlogResponse[]> => {
    const res = await api.get('/blogs/admin/pending');
    return res.data;
};

export const approveBlog = async (blogId: number): Promise<BlogResponse> => {
    const res = await api.put(`/blogs/admin/${blogId}/approve`);
    return res.data;
};

export const rejectBlog = async (blogId: number): Promise<BlogResponse> => {
    const res = await api.put(`/blogs/admin/${blogId}/reject`);
    return res.data;
};

export const deleteBlog = async (blogId: number): Promise<void> => {
    await api.delete(`/blogs/admin/${blogId}`);
};

export default api;