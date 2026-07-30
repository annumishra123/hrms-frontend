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
      switch (error.response.status) {
        case 401:
          sessionStorage.clear();
          window.location.href = "/login";
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