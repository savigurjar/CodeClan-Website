// src/utils/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "https://codeclan-backend.onrender.com",
  // baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error) // just reject the original error
);

export default axiosClient;
