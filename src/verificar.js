const { ventas } = require('./datos')
const { totalVendidoM, unidadesVendidasM, ventasPorCiudadM } = require('./analitica')
const { valorVenta, totalVendido, unidadesVendidas, ventaMayor, ticketPromedio, ventasPorCiudad } = require('./explorar')


const estadoComparativo = (etiqueta, resultadoA, resultadoB) => {
  const estado = resultadoA === resultadoB ? "OK" : "DIFERENTE";
  console.log(`${etiqueta}: ${estado} (${resultadoA} vs ${resultadoB})`)
}




//Total Vendido  -  OK
estadoComparativo(
  "Total Vendido",
  totalVendido(ventas),
  totalVendidoM(ventas)
);

//Unidades Vendidas  -  OK
estadoComparativo(
  "Unidades Vendidas",
  unidadesVendidas(ventas),
  unidadesVendidasM(ventas)
);

//Ventas por Ciudad  -  OK
console.log('El total de cada Ciudad es:');
estadoComparativo(
  "Ventas por ciudad (Medellín)",
  ventasPorCiudad(ventas, "Medellín"),
  ventasPorCiudadM(ventas, "medellín ")
);




//-----------------------------

console.log(JSON.stringify(totalPorCiudad(ventas), null, 2));

console.log(JSON.stringify(unidadesPorProducto(ventas), null, 2));

console.log(topProductosPorValor(ventas, 4));