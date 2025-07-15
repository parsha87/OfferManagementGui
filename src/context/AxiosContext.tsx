import axios from 'axios';
import config from '../config'; // Must export `apiUrl`
import { toast } from 'react-toastify';

let setLoader: (loading: boolean) => void = () => { };

// Allow React components (like context providers) to register a loader setter
export const setLoaderHandler = (setter: (loading: boolean) => void) => {
    console.log('Loader handler registered');
    setLoader = setter;
};

const LOGIN_PATH = '/'; // Change to '/login' if needed

// Create Axios instance
const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.warn('No token found in sessionStorage');
            return Promise.reject({ message: 'No token provided' });
        }

        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['Cache-Control'] = 'no-cache';

        // Show loader
        setLoader(true);

        return config;
    },
    (error) => {
        setLoader(false);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        setLoader(false);
        return response;
    },
    (error) => {
        setLoader(false);

        if (!error.response) {
            alert('Network error: Please check your internet connection.');
        } else {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    console.warn('Unauthorized (401). Redirecting to login.');
                    sessionStorage.removeItem('token');
                    window.location.href = "/";
                    break;

                case 500:
                    console.error('Server error (500):', data);
                    alert('Internal Server Error. Please try again later.');
                    break;

                default:
                    toast.error(`Error ${status}: ${data?.message || error.message}`);
                    break;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
