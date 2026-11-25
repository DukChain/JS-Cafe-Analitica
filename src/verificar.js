const { ventas } = require('./datos')
const { generarVentas } = require('./generador')
const { totalVendidoM, unidadesVendidasM, ventasPorCiudadM } = require('./analitica')
const { totalVendido, unidadesVendidas, ventasPorCiudad, totalCiudadCadena, totalCiudadUnaPasada } = require('./explorar')


const estadoComparativo = (etiqueta, resultadoA, resultadoB) => {
  const estado = resultadoA === resultadoB ? "OK" : "DIFERENTE";
  console.log(`${etiqueta}: ${estado} (${resultadoA} vs ${resultadoB})`)
}
/*
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
);*/




//-----------------------------
/*
console.log(JSON.stringify(totalPorCiudad(ventas), null, 2));

console.log(JSON.stringify(unidadesPorProducto(ventas), null, 2));

console.log(topProductosPorValor(ventas, 3));*/

const CIUDADES_PRUEBA = ["Medellín", "Bogotá", "Cali", "Pereira", " CALI ", "Quito"]
let todoOk = true

for (let rep = 0; rep < 20; rep++) {
  const lote = generarVentas(10000)

  for (const ciudad of CIUDADES_PRUEBA) {
    const a = totalCiudadCadena(lote, ciudad)
    const b = totalCiudadUnaPasada(lote, ciudad)

    if (a !== b) {
      todoOk = false
      console.log(`DIFERENTE en rep ${rep}, ${ciudad}: ${a} vs ${b}`)
    }
  }
}

console.log(todoOk ? "Todas las comparaciones OK" : "Hay diferencias")

const lote = generarVentas(10000);
const tabla = [];

for (const ciudad of ["Medellín", "Bogotá", "Cali", "Pereira", "Quito"]) {
  const cCadena = { pasos: 0 };
  const cUna = { pasos: 0 };

  totalCiudadCadena(lote, ciudad, cCadena);
  totalCiudadUnaPasada(lote, ciudad, cUna);

  tabla.push({ ciudad, n: lote.length, pasos_cadena: cCadena.pasos, pasos_una_pasada: cUna.pasos });
}

console.table(tabla);