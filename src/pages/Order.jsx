import { useEffect } from "react"
import Header from "../components/Header"
import { useOrder } from "../context/OrderContext";

const Order = () => {
  const { createOrder } = useOrder();
  const { loadClientData } = useCliente();

  useEffect(() => {
    createOrder()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-16 pb-12 flex flex-col items-center">

      </main>
    </>
  )
}

export default Order