import axios, { AxiosRequestConfig } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const APIBaseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`;

const config: AxiosRequestConfig = {
  baseURL: APIBaseURL,
  withCredentials: true,
  timeout: 5000,
};

const epAPI = applyCaseMiddleware(axios.create(config));

export default epAPI;
