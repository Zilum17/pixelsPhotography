import { Link } from "react-router-dom"

export const CardHome = ({data}) => {
  const formatNumberForDisplay = (number) => {
    const num = parseFloat(number);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  return (
    <Link to={`/product/${data.producto_id.toString()}`} className="min-w-54 w-54 h-full p-2 flex flex-col gap-1 items-center justify-between">
      <div className="bg-white size-40 min-w-40 flex items-center justify-center p-6 rounded-md">
      <img 
        src={`http://192.168.1.13:8080/pixelsPhoto/images/${data.producto_id.toString()}_1.jpg`} 
        alt="Imagen del Producto"
        className="w-full h-full object-contain hover:scale-105 transition-transform duration-400"
        loading="lazy"
      />
      </div>
      <p className="w-full h-12">{data.nombre}</p>
      <p className="w-full text-rose-600 font-medium">$ {formatNumberForDisplay(data.precio_unitario)}</p>
    </Link>
  )
}
