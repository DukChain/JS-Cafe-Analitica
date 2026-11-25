const { generarVentas } = require("./generador");
const {totalVendidoM, totalPorCiudad,} = require("./analitica");
const {valorVenta, ventaMayor,} = require("./explorar");
const { ventas } = require("./datos");

function primeraVenta(ventas, contador) {
  if (contador) {
    contador.pasos += 1;
  }

  if (!ventas || ventas.length === 0) {
    return null;
  }

  return ventas[0];
}

const tamanos = [100, 1000, 10000, 100000];
const resultadosTabla = [];



for (const n of tamanos) {
  const lote = generarVentas(n);

  const cPrimera = { pasos: 0 };
  const cTotal = { pasos: 0 };
  const vMayor = { pasos: 0 };
  const cCiudad = { pasos: 0 };

  primeraVenta(lote, cPrimera);
  totalVendidoM(lote, cTotal);
  ventaMayor(lote, vMayor);
  totalPorCiudad(lote, cCiudad);

  resultadosTabla.push({
    n,
    primera_Venta: cPrimera.pasos,
    total_Vendido: cTotal.pasos,
    venta_Mayor: vMayor.pasos,
    total_Por_Ciudad: cCiudad.pasos,
  });
}
/*
console.table(resultadosTabla);
*/

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


