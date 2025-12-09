// src/pages/OrderHistory.jsx

import { useEffect } from "react"
import Header from "../components/Header"
import { useOrderHistory } from "../context/OrderHistoryContext";
import SkeletonLoader from "../components/SkeletonLoader";

const OrderHistory = () => {
    const { 
        orderHistory, 
        historyLoading, 
        historyError, 
        fetchOrderHistory 
    } = useOrderHistory();

    useEffect(() => {
        fetchOrderHistory();
    }, [fetchOrderHistory]);

    const formatCurrency = (amount) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return '$ 0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(num);
    }
    
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;

            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
          console.log(e)
            return dateString;
        }
    }

    const getStatusStyle = (status) => {
        if (status === 'Pagado') {
            return 'bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full text-xs';
        }
        return 'bg-yellow-100 text-yellow-700 font-medium px-2 py-1 rounded-full text-xs';
    }

    return (
        <>
            <Header />
            <main className="w-full min-h-screen pt-16 pb-12 flex flex-col items-center">
                <section className="w-full max-w-4xl m-4 bg-white rounded-lg shadow-xl overflow-hidden">
                    <h1 className="p-4 text-xl font-semibold text-zinc-800 border-b">
                        Historial de Pedidos
                    </h1>
                    
                    {historyLoading && (
                        <div className="p-4">
                            <SkeletonLoader type="table" rows={5} /> 
                        </div>
                    )}
                    
                    {historyError && (
                        <div className="p-4 text-center text-red-600">
                            Error al cargar: {historyError}
                        </div>
                    )}

                    {!historyLoading && orderHistory.length === 0 && !historyError && (
                        <div className="p-4 text-center text-zinc-500">
                            No hay pedidos registrados en tu historial.
                        </div>
                    )}

                    {!historyLoading && orderHistory.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ID Pedido</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {orderHistory.map((order) => (
                                        <tr key={order.pedido_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                                                #{String(order.pedido_id).padStart(5, '0')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                                {formatDate(order.fecha_pedido)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                                {formatCurrency(order.total_pedido)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusStyle(order.estado)}>
                                                    {order.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default OrderHistory