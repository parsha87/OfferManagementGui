import axios from 'axios';
import config from '../config'; // Make sure this exports `apiUrl`

let setLoader: (loading: boolean) => void = () => { };

// Allow LoaderContext to inject the state setter
export const setLoaderHandler = (setter: (loading: boolean) => void) => {
    console.log("Loader handler set");
    setLoader = setter;
}

// Create an Axios instance
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
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('No token found. Redirecting to login.');
            window.location.href = '/';
        }

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
        } else if (error.response.status === 401) {
            console.warn('Unauthorized (401). Redirecting to login.');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        } else if (error.response.status === 500) {
            console.warn('Server error (500). Redirecting to login.');
            window.location.href = '/';
        } else {
            alert(`Error: ${error.response.status} - ${error.response.statusText}`);
        }

        return Promise.reject(error);
    }
);

export default api;
