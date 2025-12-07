import { useEffect } from "react"
import Header from "../components/Header"
import { useOrder } from "../context/OrderContext";
import { useCliente } from "../context/ClienteContext";
import { useCart } from "../context/CartContext";
import { useRef } from "react";
import { useProduct } from "../context/ProductContext";
import SkeletonLoader from "../components/SkeletonLoader";
import { useNavigate } from "react-router-dom";
import { useFacture } from "../context/FactureContext";
import { useCallback } from "react";


const Order = () => {

	const { createOrder } = useOrder();
	const { updatePedido, removeInvoiceData } = useFacture();
	const { loadCartData, clearCart } = useCart();
	const { loadClientData } = useCliente();
	const hasMounted = useRef(false);

	const { login, cliente, loading } = useCliente();
	const navigate = useNavigate();
	const { cartItems } = useCart();
	const { 
		products, 
		getProducts 
	} = useProduct();

	const parseCartToOrderDetails = useCallback((cartItems) => {
		return cartItems.map(item => ({
			producto_id: item.id, 
			cantidad: item.cantidad 
		}));
	}, []);

	useEffect(() => {
		getProducts();
		login('zuriel.espejel@gmail.com', '1715');
        removeInvoiceData();
	}, [getProducts, login, removeInvoiceData]);

	useEffect(() => {
		if (hasMounted.current) {
			return; 
		}
		hasMounted.current = true;
		const storedClientData = loadClientData();
		const storedCartData = loadCartData();
		
		if (!storedClientData || !storedClientData.id || storedCartData.length === 0) {
			return;
		}
		
		const details = parseCartToOrderDetails(storedCartData)
		createOrder(storedClientData.id, details)
	}, [createOrder, loadClientData, loadCartData, parseCartToOrderDetails]);

	const cartProducts = cartItems.map(cartItem => {
		if (!products || products.length == 0) {
			return null;
		}
		const productDetail = products.find(p => p.producto_id == cartItem.id);
		if (productDetail) {
			return {
				...productDetail,
				cantidad: cartItem.cantidad,
				totalItem: productDetail.precio_unitario * cartItem.cantidad,
			};
		}
		
		return null; 
	}).filter(item => item !== null);

	const formatNumberForDisplay = (number) => {
		const num = parseFloat(number);
		if (isNaN(num)) return '0.00';
		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(num);
	}
	const qtyItems = cartProducts.reduce((total, item) => total + item.cantidad, 0);
	const subTotal = cartProducts.reduce((total, item) => total + item.totalItem, 0);

	const facturar = async () => {
		try {
			await updatePedido(cliente)
			navigate('/facture')
			clearCart()
		} catch (error) {
			console.error("Error al finalizar la compra:", error);
		}
	}

	return (
		<>
			<Header />
			<main className="w-full min-h-screen pt-16 pb-12 flex flex-col items-center">
				<section className="w-200 min-h-50 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden flex flex-col gap-2">
					<h1 className="w-full min-h-10 flex items-center p-2 px-4 text-zinc-700 border-b border-(--steel-300) justify-center">
						Resumen de compra
					</h1>
					<p className="text-sm min-h-5 px-4">Productos: {qtyItems || 0}</p>
					<div className="text-sm min-h-5 px-4">Subtotal: $ {loading ? <SkeletonLoader type="text" /> : formatNumberForDisplay(subTotal) || 0}</div>
					<p className="text-sm min-h-5 px-4">Envio: <span className="text-rose-600">Gratis</span></p>
					<div className="text-lg min-h-10 px-4 font-medium">Total: <span className="text-rose-600">$ {loading ? <SkeletonLoader type="text" /> : formatNumberForDisplay(subTotal) || 0}</span></div>
				</section>
				<section className="w-200 min-h-50 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden flex flex-col gap-2">
					<h2 className="w-full min-h-10 flex items-center p-2 px-4 text-zinc-700 border-b border-(--steel-300)">Envio A:</h2>
					<div className="px-4 h-5">
						{loading ? <SkeletonLoader type="text" /> : (cliente?.direccion || 'N/A')}
					</div>
					<h2 className="w-full min-h-10 flex items-center p-2 px-4 text-zinc-700 border-b border-t border-(--steel-300)">Pedido a Nombre de:</h2>
					<div className="px-4 h-5">
						{loading ? <SkeletonLoader type="text" /> : (
							`${cliente?.nombre || ''} ${cliente?.apellido || ''}`.trim() || 'N/A'
						)}
					</div>
					<h2 className="w-full min-h-10 flex items-center p-2 px-4 text-zinc-700 border-b border-t border-(--steel-300)">Tiempo de Viaje:</h2>
					<p className="px-4 pb-2">4 dias</p>
				</section>
				<button
					onClick={facturar}
					className="w-100 min-h-12 m-4 uppercase bg-rose-600 text-lg text-white rounded-sm flex items-center justify-center cursor-pointer font-medium tracking-[0.2rem]"
					disabled={loading || cartItems.length === 0}
				>
					Finalizar Compra
				</button>
			</main>
		</>
	)
}

export default Order