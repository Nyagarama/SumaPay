import { post, get } from 'axios';

const API_BASE_URL = 'https://sumapay.com';

// Login API call
const login = async (email, password) => {
    try {
        const response = await post(`${API_BASE_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Registration API call
const register = async (userData) => {
    try {
        const response = await post(`${API_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// Dashboard API call
const getDashboardData = async (token) => {
    try {
        const response = await get(`${API_BASE_URL}/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Dashboard error:', error);
        throw error;
    }
};

// Admin API call
const getAdminData = async (token) => {
    try {
        const response = await get(`${API_BASE_URL}/admin`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Admin error:', error);
        throw error;
    }
};

export default {
    login,
    register,
    getDashboardData,
    getAdminData
};