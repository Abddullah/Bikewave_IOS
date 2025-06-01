import axios from 'axios';
import {EnvConfig} from '../config/envConfig';

const ApiManager = axios.create({
  baseURL: EnvConfig.api.baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default ApiManager;
