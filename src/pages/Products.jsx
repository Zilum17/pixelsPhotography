import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useProduct } from "../context/ProductContext";
import SkeletonLoader from "../components/SkeletonLoader";
import CirclePulseLoader from "../components/CirclePulseLoader"; // Asumiendo que tienes este componente
import Footer from "../components/Footer";
import getImageUrl from "../utils/getImageUrl";

const Products = () => {
  const { products, loading, getProducts, productsLoading } = useProduct(); // Asegúrate de que productsLoading esté disponible

  useEffect(() => {
    getProducts(); 
  }, [getProducts]);

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '$ 0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen pt-16 pb-12 flex flex-col items-center p-4">
          <SkeletonLoader type="list" count={10} />
        </main>
      </>
    );
  }

  if (!products || products.length === 0) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen pt-20 pb-12 flex flex-col items-center p-4">
          <h1 className="text-xl text-zinc-700">No se encontraron productos.</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-20 pb-12 flex flex-col items-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div
              key={product.producto_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-zinc-200"
            >
              <Link to={`/product/${product.producto_id}`} className="flex items-start">
                
                {/* ⬅️ BLOQUE DE IMAGEN (IZQUIERDA) */}
                <div className="size-30 min-w-30 p-6 bg-white rounded-md flex items-center justify-center">
                  {
                    productsLoading ?
                    <CirclePulseLoader /> :
                    <img 
                      src={getImageUrl(product.producto_id.toString())} 
                      alt="Imagen del Producto"
                      className="w-full h-full object-contain"
                    />
                  }
                </div>

                {/* CONTENIDO DEL PRODUCTO (DERECHA) */}
                <div className="p-4 grow">
                  <h2 className="text-lg font-semibold text-rose-600 hover:underline">
                    {product.nombre}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    ID: {product.producto_id} | {product.es_accesorio ? 'Accesorio' : 'Cámara'}
                  </p>
                  <div className="mt-2 text-xl font-bold text-zinc-900">
                    {formatCurrency(product.precio_unitario)}
                  </div>
                  <p className="text-sm text-zinc-700 mt-2 line-clamp-2">
                    {product.descripcion}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
};

export default Products;