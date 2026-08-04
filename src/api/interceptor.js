
import axiosInstance from "./axios";

/**
 * REQUEST INTERCEPTOR
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("hrms_admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // ⚠️ Login request pe 401 aana normal hai (galat password) —
      // isse "session expired" nahi maanna, warna galat password pe bhi
      // poora page reload/redirect ho jayega.
      const isLoginRequest = error.config?.url?.includes("/auth/login");

      switch (error.response.status) {
        case 401:
          if (!isLoginRequest) {
            sessionStorage.clear();
            window.location.href = "/login";
          }
          break;

        case 403:
          console.log("Forbidden");
          break;

        case 500:
          console.log("Server Error");
          break;

        default:
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;