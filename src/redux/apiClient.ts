import axios from 'axios';
import store, {persistor} from '../redux';
import { LOGOUT } from './user/constants';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: 'https://dev-api.samuapp.com/api', // Replace with your API URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.accessToken; // Access token from Redux state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error status is 401 and if the request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const state = store.getState();
        const refreshToken = state.user.refreshToken;

        if (!refreshToken) {
          store.dispatch({type: LOGOUT}); // Log out user if no refresh token is available
          return Promise.reject(error);
        }

        const { data } = await axios.post('https://dev-api.samuapp.com/api/user/auth/login', {
            refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data;

        // Update Redux store with new tokens
        store.dispatch(
          setAccessToken({
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        processQueue(null, accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout()); // Log out user if refresh fails
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
