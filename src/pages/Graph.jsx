// src/components/TopProductsChart.jsx (Orientación Vertical)

import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSalesAnalytics } from '../context/SalesAnalyticsContext';
import SkeletonLoader from '../components/SkeletonLoader';
import Header from '../components/Header';

const Graph = () => {
  const { topProducts, loading, fetchTopSellingProducts } = useSalesAnalytics();

  useEffect(() => {
    fetchTopSellingProducts();
  }, [fetchTopSellingProducts]);

  if (loading) {
    return <SkeletonLoader type="image" height={400} />;
  }

  if (topProducts.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
        No hay datos de ventas disponibles para graficar el Top 10.
      </div>
    );
  }
  const ACORTAR_A = 15;
  const chartData = topProducts.map(item => ({
    nombre: item.nombre.length > ACORTAR_A 
      ? `${item.nombre.substring(0, ACORTAR_A)}...` 
      : item.nombre,
    Ventas: item.cantidad_vendida,
  }));

  return (
    <>
      <Header/>
      <div style={{ height: 600, padding: '20px' }} className='mt-18 w-240 mx-auto min-w-240'>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Top 10 Productos con Más Ventas</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 50, 
            }}
            // Se quita 'layout="vertical"' para usar el layout horizontal por defecto.
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* XAxis ahora usa la categoría (nombre) */}
            <XAxis 
              dataKey="nombre" 
              angle={-45}
              textAnchor="end" 
              height={50}
              interval={0}
            />
            {/* YAxis ahora usa el número (cantidad) */}
            <YAxis 
              type="number" 
              label={{ value: 'Cantidad Vendida', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value, name) => [`${value} unidades`, name]}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="Ventas" fill="#dc3545" name="Total Vendido" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Graph;