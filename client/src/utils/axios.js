import axios from 'axios';
import { SERVER_URL } from '../constants';

const axiosConfig = {
  baseURL: SERVER_URL,
  timeout: 30000
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.response.use(
  response => response,
  error =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    )
);

export default axiosInstance;
