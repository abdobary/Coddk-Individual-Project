import axios from "axios";

const API = axios.create({
  baseURL: "https://educational-platform-backend.vercel.app/api"
  //baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;