import jwtDecode from "jwt-decode";

const token = localStorage.getItem("auth-token");

const decodedToken = token ? jwtDecode(token) : '';

export default decodedToken;
