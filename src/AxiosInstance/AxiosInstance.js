import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://communify-server.mrzera.in",
});

axiosInstance.interceptors.request.use((config) => {
  const jwtToken = localStorage.getItem("authToken");
  const adminAuthToken = localStorage.getItem("adminAuthToken");
  console.log(jwtToken, "user ippo becvchath");
  
  if (jwtToken !== "" && jwtToken !== null) {
    console.log("User token found");
    // Additional check for token validity if needed
   
    // Set the Authorization header for user token
    config.headers.Authorization = `Bearer ${jwtToken}`;
  } else {
    console.log("Admin token found");
    // Additional check for admin token validity if needed

    // Set the Authorization header for admin token
    config.headers.Authorization = `Bearer ${adminAuthToken}`;
  }

  return config;
});

export default axiosInstance;
