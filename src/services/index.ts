import axios from "axios";

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

export default httpClient;
