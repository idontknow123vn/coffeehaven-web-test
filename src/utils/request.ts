import axios from 'axios';
import { baseURL } from './baseURL';

const createAxiosInstance = (servicePath: string) => {
  return axios.create({
    baseURL: `${baseURL}/${servicePath}`,
    responseType: "json",
    headers: {
      "ngrok-skip-browser-warning": "true", // Thêm dòng này
    },
    // withCredentials: true,
  });
};

const identity = createAxiosInstance('api/auth');
const menuItems = createAxiosInstance('api/menu-items');
const manager = createAxiosInstance('api/manager');
const staff = createAxiosInstance('api/employee');
const headOffice = createAxiosInstance('api/head-office');
const order = createAxiosInstance('api/order');
const category = createAxiosInstance('api/categories');
const discount = createAxiosInstance('api/discount');

export { identity, menuItems, manager, staff, headOffice, order, category, discount };