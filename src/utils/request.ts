import axios from 'axios';
import { baseURL } from './baseURL';

const createAxiosInstance = (servicePath: string) => {
  return axios.create({
    baseURL: `${baseURL}/${servicePath}`,
    responseType: "json",
    withCredentials: true,
  });
};

const identity = createAxiosInstance('api/auth');
const menuItems = createAxiosInstance('api/menu-items');
const manager = createAxiosInstance('api/manager');

export { identity, menuItems, manager };