import axios from "axios";

const API = 'http://192.168.1.13:8080/pixelsPhoto/api'

export const productRequest = () => axios.get(`${API}/productos`);
export const clientRequest = (data) => axios.post(`${API}/cliente`, data);
export const orderRequest = (data) => axios.post(`${API}/pedido`, data);
export const updatePedidoRequest = (data) => axios.post(`${API}/factura/actualizar_estado`, data);
export const detallePedidoRequest = async (pedidoId) => axios.get(`${API}/detalle_pedido?pedido_id=${pedidoId}`);
export const allOrdersRequest = async () => axios.get(`${API}/pedidos`);