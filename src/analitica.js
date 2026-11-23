const { ventas } = require('./datos')
const { valorVenta } = require('./explorar')


const totalVendidoM = (items) =>
    items
        .map((venta) => venta.cantidad * venta.precio)
        .reduce((total, monto) => total + monto, 0);

//console.log(`El total vendido es: ${totalVendidoM(ventas)}`)

const unidadesVendidasM = (items) =>
    items
        .reduce((total, venta) => total + venta.cantidad, 0);

//console.log(`El total de unidades vendidas es: ${unidadesVendidasM(ventas)}`)
const ventasPorCiudadM = (lista, ciudadExistente) => {
  const objetivo = (ciudadExistente ?? "").trim().toLowerCase();

  return lista
    .filter((venta) => ((venta.ciudad ?? "").trim().toLowerCase() === objetivo))
    .reduce((acumulado, venta) => acumulado + (venta.cantidad * venta.precio), 0);
};

//console.log(ventasPorCiudadM(ventas, "medellín "));   

const totalPorCiudad = (ventas) =>
  ventas.reduce((tCiudad, item) => {
    const clave = (item.ciudad ?? "").trim().toLowerCase()
    tCiudad[clave] = (tCiudad[clave] ?? 0) + valorVenta(item)
    return tCiudad;
  }, {});

/*console.log(totalPorCiudad(ventas));
console.log(JSON.stringify(totalPorCiudad(ventas), null, 2));
const resumenCiudades = totalPorCiudad(ventas);

Object.entries(resumenCiudades).forEach(([ciudad, total]) => {
  console.log(`- ${ciudad}: ${total}`);
});
console.table(totalPorCiudad(ventas));
*/

const unidadesPorProducto = (ventas) =>
  ventas.reduce((uProducto, item) => {
    const clave = (item.producto ?? "").trim().toLowerCase()
    uProducto[clave] = (uProducto[clave] ?? 0) + item.cantidad
    return uProducto;
  }, {});

//console.log(JSON.stringify(unidadesPorProducto(ventas), null, 2));

const topProductosPorValor = (ventas, k) => {
  if ( k <= 0) return []

  const acumulador = ventas.reduce((acc, item) => {
    const clave = (item.producto ?? "").trim().toLowerCase()
    acc[clave] = (acc[clave] ?? 0) + item.cantidad * item.precio
    return acc;
  }, {});

  return Object.entries(acumulador)
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, k);
};

//console.log(topProductosPorValor(ventas, 4));


//------------------------------
//MINI RETO 4

const ventasDelDia = (lista, fecha) => {
  const fechaObjetivo = (fecha ?? "").trim();
  return lista.filter((venta) => (venta.fecha ?? "").trim() === fechaObjetivo);
};


module.exports = {
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia
}
