import axios from "axios";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  // withCredentials: true,
  // timeout: 120000,
});

apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const registerUser = (data) => {
  return apiClient.post("/users/register", data);
};

export const loginUser = (data) => {
  return apiClient.post("/users/login", data);
};

export const logout = () => {
  return apiClient.post("/users/logout");
};
