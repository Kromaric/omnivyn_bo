import axios from "axios";

// URL de l'API Laravel
const API_URL = import.meta.env.VITE_API_URL || "http://10.119.5.232:8000/api";

// Créer une instance axios
const laravelClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Intercepteur pour ajouter le token à chaque requête
laravelClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
laravelClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers login si non authentifié
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      // Optionnel: rediriger vers la page de login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default laravelClient;
