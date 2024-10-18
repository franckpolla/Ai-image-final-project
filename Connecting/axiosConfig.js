import axios from "axios";

// Set the base URL for all Axios requests
axios.defaults.baseURL = "http://localhost:3001/api";

// Enable sending cookies with cross-origin requests
axios.defaults.withCredentials = true;

// You can add more default settings here if needed
// For example:
// axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';

export default axios;
