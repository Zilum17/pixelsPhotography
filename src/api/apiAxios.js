import axios from "axios";

const API = '/api'

export const productRequest = () => axios.get(`${API}/productos`);
export const clientRequest = (data) => axios.post(`${API}/cliente`, data);
export const orderRequest = (data) => axios.post(`${API}/pedido`, data);