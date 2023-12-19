import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://communify-server.mrzera.in",
});

axiosInstance.interceptors.request.use((config) => {
  const jwtToken = localStorage.getItem("authToken");
  const adminAuthToken = localStorage.getItem("adminAuthToken");

  if (adminAuthToken !== "" && adminAuthToken !== "null") {
    // Additional check for admin token validity if needed

    // Set the Authorization header for admin token
    config.headers.Authorization = `Bearer ${adminAuthToken}`;
  } else if (jwtToken !== "" && jwtToken !== "null") {
    // Additional check for user token validity if needed

    // Set the Authorization header for user token
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }

  return config;
});

export default axiosInstance;
