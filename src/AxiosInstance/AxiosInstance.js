 import axios from "axios";
// Create a custom Axios instance



const axiosInstance = axios.create({
  baseURL: "https://communify-server.mrzera.in", 
});
// Add an interceptor to set the Authorization header
axiosInstance.interceptors.request.use((config) => {
  const jwtToken = localStorage.getItem("authToken");
  const adminAuthToken = localStorage.getItem("adminAuthToken");

  if (jwtToken!=="" || jwtToken !=="null") {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }

  if (adminAuthToken !== "" && adminAuthToken !== "null") {
    config.headers.Authorization = `Bearer ${adminAuthToken}`;
  }


  return config;
});
export default axiosInstance;


