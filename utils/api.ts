import axios, { AxiosRequestConfig } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const { APIBaseURL } = process.env;

const config: AxiosRequestConfig = {
  baseURL: APIBaseURL,
  withCredentials: true,
  timeout: 10000,
};

const epAPI = applyCaseMiddleware(axios.create(config));

export default epAPI;
