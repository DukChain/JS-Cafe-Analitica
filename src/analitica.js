const { ventas } = require('./datos')
const { valorVenta } = require('./explorar')
const { generarVentas } = require("./generador");

/*ORIGINAL
const totalVendidoM = (items) =>
    items
        .map((venta) => venta.cantidad * venta.precio)
        .reduce((total, monto) => total + monto, 0);
*/

const totalVendidoM = (items, contador) =>
  items
    .map((venta) => {
      if (contador) contador.pasos += 1; // Visita cada venta en map
      return valorVenta(venta);
    })
    .reduce((total, monto) => {
      if (contador) contador.pasos += 1; // Suma/compara en reduce
      return total + monto;
    }, 0);

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

/*ORIGINAL
const totalPorCiudad = (ventas) =>
  ventas.reduce((tCiudad, item) => {
    const clave = (item.ciudad ?? "").trim().toLowerCase()
    tCiudad[clave] = (tCiudad[clave] ?? 0) + valorVenta(item)
    return tCiudad;
  }, {});
*/

const totalPorCiudad = (ventas, contador) =>
  ventas.reduce((tCiudad, item) => {
    if (contador) contador.pasos += 1; // Visita cada venta
    const clave = (item.ciudad ?? "").trim().toLowerCase();
    tCiudad[clave] = (tCiudad[clave] ?? 0) + valorVenta(item);
    return tCiudad;
  }, {})

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
  }, {})

//console.log(JSON.stringify(unidadesPorProducto(ventas), null, 2));

const topProductosPorValor = (ventas, k) => {
  if ( k <= 0) return []

  const acumulador = ventas.reduce((acc, item) => {
    const clave = (item.producto ?? "").trim().toLowerCase()
    acc[clave] = (acc[clave] ?? 0) + item.cantidad * item.precio
    return acc
  }, {})

  return Object.entries(acumulador)
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, k)
};

//console.log(topProductosPorValor(ventas, 4));


//MINIRETO 2 D2 S1

function clientesRecurrentes(ventas) {
  const recurrentes = [];

  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (
        ventas[i].cliente === ventas[j].cliente &&
        !recurrentes.includes(ventas[i].cliente)
      ) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }

  return recurrentes;
}

/*const tamanios = [1000, 2000, 4000, 8000, 16000,100000]



for (const n of tamanios) {
	const vuelta = generarVentas(n)
	const etiqueta= `clientesRecurrentes-${n}`
	
	console.time(etiqueta)
	const recurrentes=clientesRecurrentes(vuelta)
	console.timeEnd(etiqueta)
	
	console.log(`n = ${n} -> recurrentes encontrados: ${recurrentes.length}`)
}*/


//------------------------------
//MINI RETO 4 D1 S1

const ventasDelDia = (lista, fecha) => {
  const fechaObjetivo = (fecha ?? "").trim();
  return lista.filter((venta) => (venta.fecha ?? "").trim() === fechaObjetivo);
};



//MINI RETO 7 D2 S1




module.exports = {
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentes
}
