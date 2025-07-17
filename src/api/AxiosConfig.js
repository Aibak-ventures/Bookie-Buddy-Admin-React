import axios from 'axios';
import API_URLS from './ApiUrl';



const apiUrl = import.meta.env.VITE_API_BASE_URL;




const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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





// for refresh token

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and hasn't been retried already
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint — backend should read refresh token from cookies
        const refreshResponse = await apiClient.post(API_URLS.REFRESH_TOKEN_URL, null); // no body needed if using cookie

        const newAccessToken = refreshResponse.data.access;
        sessionStorage.setItem('access', newAccessToken);

        // Update the failed request with the new token and retry
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Optional: logout user
        sessionStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



export const refreshToken = async () =>{
    try {
        // Call refresh endpoint — backend should read refresh token from cookies
        const refreshResponse = await apiClient.post(API_URLS.REFRESH_TOKEN_URL, null); // no body needed if using cookie

        const newAccessToken = refreshResponse.data.access;
        console.log("new acess token",newAccessToken);
        
        sessionStorage.setItem('access', newAccessToken);

        // Update the failed request with the new token and retry
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // // Optional: logout user
        // sessionStorage.clear();
        // return Promise.reject(refreshError);
        console.log("error",refreshError);
        
      }
}