import axios from 'axios';
import {EnvConfig} from '../config/envConfig';

const ApiManager = axios.create({
  // baseURL: EnvConfig.api.baseUrl,
  baseURL: 'http://192.168.100.12:4000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default ApiManager;
