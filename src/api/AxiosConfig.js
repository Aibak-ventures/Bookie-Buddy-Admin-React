import axios from 'axios';



const apiUrl = import.meta.env.VITE_API_BASE_URL;




const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, optional: include if you use cookies/session auth
});

export default apiClient;



// interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
