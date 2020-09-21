import axios from 'axios';

const {
  REACT_APP_ACCESS_API_HOST,
  REACT_APP_ACCESS_API_PROTOCOL,
} = process.env;

const instance = axios.create({
  baseURL: `${REACT_APP_ACCESS_API_PROTOCOL}//${REACT_APP_ACCESS_API_HOST}`,
  withCredentials: true,
});

instance.interceptors.response.use((value) => value.data);

export default instance;
