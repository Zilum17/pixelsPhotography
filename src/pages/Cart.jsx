import { Link } from "react-router-dom";
import Header from "../components/Header"
import { useCart } from "../context/CartContext";
import { useProduct } from "../context/ProductContext";
import { useEffect } from "react";
import CirclePulseLoader from "../components/CirclePulseLoader";
import { PiMinus, PiPlus } from 'react-icons/pi'
const Cart = () => {
  const { checkCartEmpty, cartItems, updateQuantity, removeFromCart } = useCart();
  const { 
    products, 
    loading: productsLoading,
    getProducts 
  } = useProduct();

  const productsCart = [];

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartProducts = cartItems.map(cartItem => {
    if (!products || products.length == 0) {
        return [];
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
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  cartProducts.forEach( (product, index) => {
    productsCart.push(
      <section key={index} className="w-240 min-h-38 h-38 m-2 bg-(--steel-100) rounded-md shadow-md overflow-hidden flex items-center gap-2 p-4" >
        <div className="size-30 min-w-30 p-6 bg-white rounded-md flex items-center justify-center" >
          {
            productsLoading ?
            <CirclePulseLoader /> :
            <img 
              src={`http://192.168.1.13:8080/pixelsPhoto/images/${product.producto_id.toString()}_1.jpg`} 
              alt="Imagen del Producto"
              className="w-full h-full object-contain"
            />
          }
        </div>
        <div className="h-full w-full flex flex-col gap-2 p-2">
          <h1 className="uppercase font-medium text-rose-600 text-xl">{product.nombre}</h1>
          <p> $ {formatNumberForDisplay(product.totalItem)}</p>
        </div>
        <div className="h-full min-w-30 p-2 flex flex-col items-center justify-between">
          <div className="h-6 w-20 flex items-center justify-between gap-2">
            <a className="cursor-pointer" onClick={() => updateQuantity(product.producto_id, product.cantidad - 1)}><PiMinus/></a>
            <p>{product.cantidad || 0}</p>
            <a className="cursor-pointer" onClick={() => updateQuantity(product.producto_id, product.cantidad + 1)}><PiPlus/></a>
          </div>
          <a className="h-6 w-full flex items-center justify-center hover:text-rose-600 cursor-pointer" onClick={() => removeFromCart(product.producto_id)}>Eliminar</a>
        </div>
      </section>
    );
  });

  const qtyItems = cartProducts.reduce((total, item) => total + item.cantidad, 0);
  const subTotal = cartProducts.reduce((total, item) => total + item.totalItem, 0);
  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-16 pb-12 flex flex-col items-center">
        {
          checkCartEmpty() ? 
          <>
            <section className="w-240 min-h-50 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden flex flex-col items-end gap-2">
              <h1 className="w-full min-h-10 flex items-center p-2 px-4 text-zinc-700 border-b border-(--steel-300) justify-center">
                Resumen de compra
              </h1>
              <p className="text-sm min-h-5 px-4">Productos: {qtyItems || 0}</p>
              <p className="text-sm min-h-5 px-4">Subtotal: $ {formatNumberForDisplay(subTotal) || 0}</p>
              <p className="text-sm min-h-5 px-4">Envio: <span className="text-rose-600">Gratis</span></p>
              <p className="text-lg min-h-10 px-4 font-medium">Total: <span className="text-rose-600">$ {formatNumberForDisplay(subTotal) || 0}</span></p>
              <Link to="/order" className="min-h-10 m-4 uppercase bg-rose-600 text-sm text-white rounded-sm flex items-center justify-center cursor-pointer font-medium tracking-[0.2rem] w-40">Continuar</Link>
            </section>
            {productsCart}
          </>
          : 
            <section className="w-240 min-h-20 h-20 m-4 bg-(--steel-100) rounded-md shadow-md overflow-hidden p-4 flex items-center justify-between gap-4 relative">
              Sin Productos agregados . . .
            </section>  
        }
      </main>
    </>
  )
}

export default Cart