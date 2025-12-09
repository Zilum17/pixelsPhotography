import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import SkeletonLoader from "../components/SkeletonLoader";
import Header from "../components/Header";
import CirclePulseLoader from "../components/CirclePulseLoader";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import getImageUrl from "../utils/getImageUrl";

const Product = () => {
  const {getProduct, product, loading} = useProduct();
  const { addToCart } = useCart();
  const params = useParams(); 
  const navigate = useNavigate();
  const productId = params.id;
  const [selectImg, setSelectImg] = useState(1);
  const imageElements = [];

  useEffect(() => {
    getProduct(productId);
  }, [productId, getProduct]);

  for (let i = 0; i < 3; i++) {
    const imageNumber = i + 1;
    const isLoadingOrNoId = loading || !product?.producto_id;
    const baseClasses = "size-30 min-h-30 p-6 bg-white border rounded-md flex items-center justify-center cursor-pointer transition-all duration-200";
    const isSelected = imageNumber === selectImg;
    const selectedClasses = isSelected
      ? "border border-rose-500" 
      : "border border-gray-300";   
      
    const finalClasses = `${baseClasses} ${selectedClasses}`;
    imageElements.push(
      <a 
        key={i}
        className={finalClasses}
        onClick={() => setSelectImg(imageNumber)}
      >
        {
          isLoadingOrNoId ?
          (
            <CirclePulseLoader />
          ) : 
          (
            <img 
              src={getImageUrl(product.producto_id.toString(),imageNumber)} 
              alt={`Vista ${imageNumber} del Producto`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          )
        }
      </a>
    );
  }

  const formatNumberForDisplay = (number) => {
    const num = parseFloat(number);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  const mesesInteres = (precio) => {
    return precio/12;
  }

  const handleAddToCartAndNavigate = () => {
    if (product && product.producto_id) {
      addToCart(product.producto_id, product.cantidad);
      navigate('/order'); 
    } else {
      console.warn("Producto no cargado, no se puede añadir al carrito.");
    }
  };

  const handleAddToCart = () => {
    if (product && product.producto_id) {
      addToCart(product.producto_id, product.cantidad);
    } else {
      console.warn("Producto no cargado, no se puede añadir al carrito.");
    }
  };

  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-16 pb-12 flex flex-col items-center">
        <section className="w-240 min-h-200 h-200 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden p-4 flex items-center justify-between gap-4 relative">
          <div className="h-full w-full p-4 flex flex-col items-center justify-start gap-4">
            <div className="size-120 min-h-120 shadow-lg p-16 bg-white rounded-md flex items-center justify-center">
              {
                loading || !product?.producto_id ?
                <CirclePulseLoader size="100px"/> :
                <img 
                  src={getImageUrl(product.producto_id.toString(), selectImg)} 
                  alt="Imagen del Producto"
                  className="w-full h-full object-contain"
                />
              }
            </div>
            <div className="w-120 h-40 flex items-center justify-evenly">
              {imageElements}
            </div>
          </div>
          <div className="h-full min-w-80 rounded-md border border-(--steel-400) flex flex-col justify-start p-6 gap-4">
            {loading ? <SkeletonLoader type="text" /> : <h1 className="uppercase font-medium text-xl">{product.nombre}</h1>}
            {loading ? <SkeletonLoader type="text" /> : <p className="text-2xl font-medium text-rose-600">$ {formatNumberForDisplay(product.precio_unitario)}</p>}
            {loading ? <SkeletonLoader type="text" /> : <p className="text-sm text-rose-600 bg-rose-100 w-fit px-1 block">12 meses sin intereses de $ {formatNumberForDisplay(mesesInteres(product.precio_unitario))}</p>}
            {loading ? <SkeletonLoader type="text" /> : <h1 className="text-sm text-justify">{product.descripcion}</h1>}
            <p className="uppercase font-medium">Stock disponible</p>
            {loading ? <SkeletonLoader type="text" /> : <p>Disponible: {product.stock_actual}</p>}
            <span className="h-full"></span>
            <button onClick={handleAddToCartAndNavigate} className="h-12 min-h-12 w-full flex items-center justify-center rounded-sm bg-rose-600 text-white uppercase cursor-pointer font-medium tracking-[0.2rem]">
              Comprar
            </button>
            <button onClick={handleAddToCart} className="h-12 min-h-12 w-full flex items-center justify-center rounded-sm bg-rose-100 text-red-600 border cursor-pointer border-rose-600 uppercase font-medium tracking-[0.2rem]">
              Agregar al Carrito
            </button>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  )
}

export default Product