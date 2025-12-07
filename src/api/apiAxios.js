import axios from "axios";

const API = '/api'

export const productRequest = () => axios.get(`${API}/productos`);