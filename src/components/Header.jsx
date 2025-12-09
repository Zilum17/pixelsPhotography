
import { PiShoppingCart, PiSlidersHorizontal, PiUser } from 'react-icons/pi'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <header className="z-100 min-w-290 w-full h-16 fixed top-0 left-0 flex items-center justify-center bg-(--steel-100) p-1 gap-3 shadow-md">
      <div className="w-56 h-full flex items-center justify-between p-2"> 
        <img src="http://192.168.1.13:8080/pixelsPhoto/images/LogoPixelPhotography.jpg" className="h-10 w-10" alt="logo" />
        <h1 className="uppercase text-sm text-center font-medium">Pixel Photography</h1>
      </div>
      <span className='h-full w-0.5 bg-(--steel-200) mr-5 ml-5'></span>
      <nav className="min-w-140 w-160 h-full flex items-center justify-center gap-8 uppercase">
        <Link to="/" className="cursor-pointer text-sm p-2 hover:text-rose-600 transition-colors duration-200">Inicio</Link>
        <Link to="/products" className="cursor-pointer text-sm p-2 hover:text-rose-600 transition-colors duration-200">Productos</Link>
        <Link to="/graph" className="cursor-pointer text-sm p-2 hover:text-rose-600 transition-colors duration-200">Mas Vendidos</Link>
        <Link to="/history" className="cursor-pointer text-sm p-2 hover:text-rose-600 transition-colors duration-200">Mis Compras</Link>
      </nav>
      <span className='h-full w-0.5 bg-(--steel-200) mr-5 ml-5'></span>
      <div className="w-56 h-full flex items-center justify-center gap-2"> 
        <Link to="/cart" className="cursor-pointer p-2 hover:text-rose-600 transition-colors duration-200"><PiShoppingCart size={22}/></Link>
        <Link to="/user" className="cursor-pointer p-2 hover:text-rose-600 transition-colors duration-200"><PiUser size={22}/></Link>
        {/* <Link to="/settings" className="cursor-pointer p-2 hover:text-rose-600 transition-colors duration-200"><PiSlidersHorizontal size={22}/></Link> */}
      </div>
    </header>
  )
}

export default Header