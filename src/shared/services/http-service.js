import axios from "axios";

const baseURL = "https://fyp-project-be.onrender.com/api";
const token = localStorage.getItem("auth-token") || null;

// instanceWithToken is used for requests that need the token
const axiosInstanceWithToken = axios.create({
  baseURL,
  headers: {
    authorization: `Bearer ${token}`,
  },
});

// axiosInstance is used for requests that don't need the token
const axiosInstance = axios.create({
  baseURL,
});

const httpService = {
  axiosInstance,
  axiosInstanceWithToken,
};

export default httpService;
