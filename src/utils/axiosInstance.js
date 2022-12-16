import axios from "axios";

const { host, hostname, protocol } = window.location;

/**
 * Create axios instance with baseurl
 */
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_NODE_ENV === 'production' ? `${protocol}//${host}/api` : `${protocol}//${hostname}:5000/api`
})

/**
 * Intercept all the requests made by client and append jwt token
 */
axiosInstance.interceptors.request.use((request) => {
    request.headers['Content-Type'] = 'application/json';
    if (!request.url.startsWith('/auth') || request.url === '/auth/user') {
        request.headers['Authorization'] = `Bearer ${localStorage.getItem('__UPSKL_TOKEN__')}`;
    }
    return request;
})

export default axiosInstance;