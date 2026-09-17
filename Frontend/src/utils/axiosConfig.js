import axios from 'axios';

// هنا بنقوله لو احنا أونلاين استخدم رابط الباك إند الحقيقي، لو محلي استخدم localhost
const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-url.onrender.com' // هنغير الرابط ده بعدين لما نرفع الباك إند
        : 'http://localhost:5000'
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;