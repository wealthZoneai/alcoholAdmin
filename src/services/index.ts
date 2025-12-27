import axios from "axios";
import endpoints from "./endpoints";

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

const httpClient = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "http://localhost:8080/",
  headers: {
    deviceType: "Web",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    // ✅ Only proceed if requiresAuth is true
    if (config.requiresAuth) {
      const token = localStorage.getItem("token");

      // ✅ Add Authorization header only if token exists
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No token found in localStorage. Request may be unauthorized.");
      }
    }

    // ✅ Handle FormData (if uploading files)
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle 401 errors
httpClient.interceptors.response.use(
  (response) => {
    // ✅ "backend also print" - Global Logger
    console.log(`API RESPONSE [${response.config.url}]:`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops and only refresh for authorized requests
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry && originalRequest.requiresAuth) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("token");
        const refreshTokenValue = localStorage.getItem("refreshToken");

        if (!token || !refreshTokenValue) {
          throw new Error("No token/refreshToken found");
        }

        // Call refresh endpoint 
        const response = await axios.post(
          `${httpClient.defaults.baseURL}${endpoints.refreshToken}`,
          {
            token,
            refreshToken: refreshTokenValue,
          },
          {
            headers: { deviceType: "Web" },
          }
        );

        if (response.data) {
          console.log("REFRESH RESPONSE:", response.data); // ✅ Log the backend response
          // ✅ Correctly handles "accessToken" or "token"
          const newToken = response.data.token || response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          if (newToken) {
            localStorage.setItem("token", newToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Update original request header
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

            // Retry original request
            return httpClient(originalRequest);
          }
        }

      } catch (refreshError) {
        console.error("Session refresh failed.", refreshError);
        // Only redirect if the request that failed actually required authentication
        if (originalRequest.requiresAuth) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");

          // Redirect to Login
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
