import React, { useMemo, useEffect } from "react";
import Header from "../components/Header";
import { useFacture } from "../context/FactureContext";
import { useProduct } from "../context/ProductContext";
import { useCliente } from "../context/ClienteContext";
import SkeletonLoader from "../components/SkeletonLoader";

// --- Información de la Empresa (Inventada) ---
const COMPANY_INFO = {
    name: "PixelsPhotography S.A. de C.V.",
    address: "Av. Principal #123, Col. Centro",
    city: "Ciudad Ejemplo, CP 90000",
    rfc: "PIX987654321A1",
    phone: "+52 55 1234 5678",
    email: "contacto@pixelsphotography.com",
};
const TAX_RATE = 0.16; // 16% de IVA

const Facture = () => {
    // Hooks de Contexto
    const { 
        invoice, 
        loading: invoiceLoading, 
        fetchOrderDetails, 
        orderDetails, 
        detailsLoading 
    } = useFacture();
    
    const { cliente, loading: clienteLoading } = useCliente();
    const { products } = useProduct();
    
    // Función para formatear números
    const formatCurrency = (number) => {
        const num = parseFloat(number);
        if (isNaN(num)) return '0.00';
        return num.toFixed(2);
    };

    // 🟢 1. Cargar detalles del pedido al montar
    useEffect(() => {
        fetchOrderDetails(); 
    }, [fetchOrderDetails]);
    
    // 🟢 2. UNIÓN DE DATOS Y CÁLCULO DE TOTALES
    const { fullDetails, calculations } = useMemo(() => {
        
        const isReady = products.length > 0 && orderDetails.length > 0;
        if (!isReady) {
            return { fullDetails: [], calculations: {} };
        }

        let subtotal = 0;
        
        const details = orderDetails.map(detail => {
            // Unir con el catálogo de productos para obtener el nombre
            const productInfo = products.find(p => p.producto_id === detail.producto_id) || {};
            
            const subtotalItem = detail.cantidad * (detail.precio_venta || 0);
            subtotal += subtotalItem;
            
            return {
                id: detail.producto_id,
                nombre: productInfo.nombre || `Producto ID: ${detail.producto_id}`,
                cantidad: detail.cantidad,
                precio_unitario: detail.precio_venta,
                subtotalItem: subtotalItem,
            };
        });

        const tax = subtotal * TAX_RATE;
        const finalTotal = subtotal + tax;

        return {
            fullDetails: details,
            calculations: { subtotal, tax, finalTotal }
        };
    }, [orderDetails, products]);


    // 🟢 3. Renderizado de carga y errores
    const overallLoading = invoiceLoading || clienteLoading || detailsLoading;

    if (overallLoading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-xl">Cargando datos de la factura...</p>
                </div>
            </>
        );
    }

    if (!invoice || !cliente || fullDetails.length === 0) {
        return (
            <>
                <Header />
                <div className="text-center mt-20 p-8 bg-red-100 border border-red-400 text-red-700 mx-auto max-w-4xl rounded-md">
                    <p className="text-xl font-semibold">No se pudo generar la factura.</p>
                    <p>Verifica que el pedido fue creado y que los detalles estén disponibles.</p>
                </div>
            </>
        );
    }

    // 🟢 4. Renderizado Final de la Factura con Diseño Avanzado
    return (
        <>
            <Header />
            <main className="min-h-screen pt-16 pb-12 bg-gray-50 flex justify-center">
                <div className="bg-white p-8 md:p-12 shadow-lg mx-auto my-8 max-w-4xl w-full font-sans text-gray-800 border border-gray-200">
                    
                    {/* ENCABEZADO Y DATOS DE LA EMPRESA */}
                    <div className="flex justify-between items-start mb-10 border-b pb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{COMPANY_INFO.name}</h1>
                            <p className="text-sm text-gray-600">{COMPANY_INFO.address}</p>
                            <p className="text-sm text-gray-600">{COMPANY_INFO.city}</p>
                            <p className="text-sm text-gray-600">RFC: {COMPANY_INFO.rfc}</p>
                            <p className="text-sm text-gray-600">Email: {COMPANY_INFO.email}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold text-gray-800">FACTURA</h2>
                            <p className="text-lg text-rose-600 font-bold">#{invoice.numero_factura}</p>
                            <p className="text-sm text-gray-600">ID Pedido: {invoice.pedido_id}</p>
                            <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString('es-MX')}</p>
                        </div>
                    </div>

                    {/* DATOS DEL CLIENTE */}
                    <div className="mb-10 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">FACTURAR A:</h3>
                        <p className="font-medium">{cliente?.nombre || 'N/A'} {cliente?.apellido || ''}</p>
                        <p className="text-sm text-gray-700">Email: {cliente.email}</p>
                        <p className="text-sm text-gray-700">Datos Fiscales: {invoice.datos_fiscales_cliente}</p>
                    </div>

                    {/* DETALLES DE LOS PRODUCTOS */}
                    <div className="mb-10">
                        <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Producto</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Cant.</th>
                                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">P. Unitario</th>
                                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fullDetails.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{item.nombre}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{item.cantidad}</td>
                                        <td className="py-3 px-4 text-right text-sm text-gray-800">${formatCurrency(item.precio_unitario)}</td>
                                        <td className="py-3 px-4 text-right text-sm text-gray-800">${formatCurrency(item.subtotalItem)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* TOTALES */}
                    <div className="flex justify-end pr-4 text-gray-800">
                        <div className="w-full md:w-1/3">
                            <div className="flex justify-between py-2 border-t border-gray-300">
                                <span className="font-semibold text-base">Subtotal:</span>
                                <span className="text-base">${formatCurrency(calculations.subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-t border-gray-300">
                                <span className="font-semibold text-base">Impuestos ({TAX_RATE * 100}%):</span>
                                <span className="text-base">${formatCurrency(calculations.tax)}</span>
                            </div>
                            <div className="flex justify-between py-3 border-y-2 border-rose-600 mt-2">
                                <span className="font-bold text-xl text-rose-700">TOTAL:</span>
                                <span className="font-bold text-xl text-rose-700">${formatCurrency(calculations.finalTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pie de página */}
                    <div className="text-center mt-12 pt-4 border-t border-gray-200 text-sm text-gray-500">
                        Gracias por tu compra con {COMPANY_INFO.name}.
                    </div>
                </div>
            </main>
        </>
    );
}

export default Facture;