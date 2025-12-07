import { useEffect } from "react";
import Header from "../components/Header"
import { useProduct } from "../context/ProductContext";
import SkeletonLoader from "../components/SkeletonLoader";
import CirclePulseLoader from "../components/CirclePulseLoader";
import { Link } from "react-router-dom";

const Home = () => {
  const {getProducts, products, loading} = useProduct();
  useEffect(() => {
    getProducts(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNumberForDisplay = (number) => {
    const num = parseFloat(number);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };
  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-16 flex flex-col items-center">
        <section className="w-240 min-h-100 h-100 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden p-4 flex items-center justify-between gap-4 relative">
          <span className="block h-full ml-2 mr-2 min-w-0.5 bg-(--steel-400)"></span>
          <div className="flex flex-col gap-1 pl-8 pr-16">
            <h1 className="text-3xl font-medium uppercase text-rose-500 mb-5">Las mejores camaras y accesorios para tus fotografias</h1>
            {loading ? <SkeletonLoader type="text" /> : <p className="uppercase font-medium text-xl">{products[0].nombre}</p>}
            {loading ? <SkeletonLoader type="text" /> : <p className="font-medium">${formatNumberForDisplay(products[0].precio_unitario)}</p>}
            {loading ? <SkeletonLoader type="text" /> : <p className="">Contamos con stock: {products[0].stock_actual}</p>}
            <Link to={`/product/${products[0].producto_id.toString()}`} className="mt-5 bg-rose-600 text-white rounded-md w-40 h-10 flex items-center justify-center hover:bg-rose-700 transition-colors duration-200">
              Comprar
            </Link>
          </div>
          <div className="bg-white size-92 min-w-92 flex items-center justify-center p-12 rounded-md">
            {
              loading ?
              <CirclePulseLoader /> :
              <img 
                src={`http://192.168.1.13:8080/pixelsPhoto/images/${products[0].producto_id.toString()}_1.jpg`} 
                alt={`Imagen del producto`} 
                className="max-w-full h-auto hover:scale-105 transition-transform duration-400"
              />
            }
          </div>
        </section>
      </main>
      <footer>
        
      </footer>
    </>
  )
}
export default Home