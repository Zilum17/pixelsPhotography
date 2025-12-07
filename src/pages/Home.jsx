import { useEffect } from "react";
import Header from "../components/Header"
import { useProduct } from "../context/ProductContext";
import SkeletonLoader from "../components/SkeletonLoader";
import CirclePulseLoader from "../components/CirclePulseLoader";
import { Link } from "react-router-dom";
import { CardHome } from "../components/home/CardHome";

const Home = () => {
  const {getProducts, products, loading, cameras, accessories} = useProduct();
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
  }
  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-16 pb-12 flex flex-col items-center">
        <section className="w-240 min-h-100 h-100 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden p-4 flex items-center justify-between gap-4 relative">
          <span className="block h-full ml-2 mr-2 min-w-0.5 bg-(--steel-400)"></span>
          <div className="flex flex-col gap-1 pl-8 pr-16">
            <h1 className="text-3xl font-medium uppercase text-rose-500 mb-5">Las mejores camaras y accesorios para tus fotografias</h1>
            {loading ? <SkeletonLoader type="text" /> : <p className="uppercase font-medium text-xl">{products[0].nombre}</p>}
            {loading ? <SkeletonLoader type="text" /> : <p className="font-medium">${formatNumberForDisplay(products[0].precio_unitario)}</p>}
            {loading ? <SkeletonLoader type="text" /> : <p className="">Contamos con stock: {products[0].stock_actual}</p>}
            {loading ?
              <span className="cursor-not-allowed mt-5 bg-rose-600 text-white rounded-md w-40 h-10 flex items-center justify-center hover:bg-rose-700 transition-colors duration-200">
                Comprar
              </span>:
              <Link to={`/product/${products[0].producto_id.toString()}`} className="mt-5 bg-rose-600 text-white rounded-md w-40 h-10 flex items-center justify-center hover:bg-rose-700 transition-colors duration-200">
                Comprar
              </Link>
            }
          </div>
          <div className="bg-white size-92 min-w-92 flex items-center justify-center p-12 rounded-md">
            {
              loading ?
              <CirclePulseLoader /> :
              <img 
                src={`http://192.168.1.13:8080/pixelsPhoto/images/${products[0].producto_id.toString()}_1.jpg`} 
                alt="Imagen del Producto"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-400"
              />
            }
          </div>
        </section>
        <h2 className="w-240 px-2 py-5 text-lg uppercase">Camaras</h2>
        <section className="w-240 min-h-80 h-80 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden p-4 flex items-center justify-between gap-4 relative">
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={cameras[0]} />}
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={cameras[1]} />}
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={cameras[2]} />}
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={cameras[3]} />}
        </section>
        <section className="w-240 min-h-100 h-100 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden p-4 flex items-center justify-between gap-4 relative">
          <div className="bg-white size-92 min-w-92 flex items-center justify-center p-12 rounded-md">
            {
              loading ?
              <CirclePulseLoader /> :
              <img 
                src={`http://192.168.1.13:8080/pixelsPhoto/images/${products[8].producto_id.toString()}_1.jpg`} 
                alt="Imagen del Producto"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-400"
              />
            }
          </div>
          <div className="flex flex-col gap-1 pl-8 pr-16">
            <h1 className="text-3xl font-medium uppercase text-rose-500 mb-5">Los mejores accesorios para completar tu kit</h1>
            {loading ? <SkeletonLoader type="text" /> : <p className="uppercase font-medium text-xl">{products[8].nombre}</p>}
            {loading ? <SkeletonLoader type="text" /> : <p className="font-medium">${formatNumberForDisplay(products[8].precio_unitario)}</p>}
            {loading ? <SkeletonLoader type="text" /> : <p className="">Contamos con stock: {products[8].stock_actual}</p>}
            {loading ?
              <span className="cursor-not-allowed mt-5 bg-rose-600 text-white rounded-md w-40 h-10 flex items-center justify-center hover:bg-rose-700 transition-colors duration-200">
                Comprar
              </span>:
              <Link to={`/product/${products[8].producto_id.toString()}`} className="mt-5 bg-rose-600 text-white rounded-md w-40 h-10 flex items-center justify-center hover:bg-rose-700 transition-colors duration-200">
                Comprar
              </Link>
            }
          </div>
          <span className="block h-full ml-2 mr-2 min-w-0.5 bg-(--steel-400)"></span>
        </section>
        <h2 className="w-240 px-2 py-5 text-lg uppercase">Accesorios</h2>
        <section className="w-240 min-h-80 h-80 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden p-4 flex items-center justify-between gap-4 relative">
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={accessories[0]} />}
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={accessories[1]} />}
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={accessories[2]} />}
          {loading ? <SkeletonLoader type="product-card-home" /> : <CardHome data={accessories[3]} />}
        </section>
      </main>
      <footer className="bg-(--steel-100) w-full h-60">
        
      </footer>
    </>
  )
}
export default Home