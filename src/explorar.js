const { ventas } = require('./datos')

// MINIRETO 1

/*
console.log('Cantidad de registros:', ventas.length)
console.log('Primer registro:', ventas[0]);
console.log('Último registro:', ventas[ventas.length - 1])
console.log('Producto en posición 4:', ventas[4].producto)
console.table(ventas)
*/

//MINIRETO 2

function valorVenta(ventas) {

    return ventas.cantidad * ventas.precio;
}


function totalVendido(ventas) {
    let TVendido = 0;

    for (const Tventa of ventas) {
        TVendido = TVendido + valorVenta(Tventa);
    }
    
    return TVendido
}

//console.log('El total de ventas es:',totalVendido(ventas));

function unidadesVendidas(ventas) {
    
    let totalUnidades = 0;

    for (const unidades of ventas) {
        
       totalUnidades = totalUnidades + unidades.cantidad
    }

    return totalUnidades
}

//console.log('La cantidad vendida es:',unidadesVendidas(ventas));

/*  ORIGINAL
function ventaMayor(ventas) {
    let Mayor = ventas[0];

  for (const VMayor of ventas) {
    if (valorVenta(VMayor) > valorVenta(Mayor)) {
      Mayor = VMayor;
    }
  }

  return Mayor;
}*/

function ventaMayor(ventas, contador) {
  if (ventas.length === 0) {
    return null;
  }

  let mayor = ventas[0];

  for (const ventaActual of ventas) {
    if (contador) {
      contador.pasos += 1;
    }

    if (valorVenta(ventaActual) > valorVenta(mayor)) {
      mayor = ventaActual;
    }
  }

  return mayor;
}

//console.log('La venta mayor es:',ventaMayor(ventas))


function TotalCantidades(ventas) {
    let TCantidad = 0
    for (const Cantidades of ventas) {
    
        if (Cantidades.cantidad>0) {
            TCantidad = TCantidad + 1
        }
    }

    return TCantidad    
}
/* ORIGINAL
function ticketPromedio(ventas) {
    
    let Tprom = totalVendido(ventas)/TotalCantidades(ventas)


    return Tprom
}
*/

function ticketPromedio(ventas) {
  if (!Array.isArray(ventas) || ventas.length === 0) {
    return 0;
  }

  const total = totalVendido(ventas);
  const cantidad = TotalCantidades(ventas);

  if (cantidad === 0) {
    return 0;
  }

  return total / cantidad;
}

//console.log('EL promedio es:',ticketPromedio(ventas));

//MINI RETO 7 D2 S1  (Ya se habia realizado anteriormente asi que no la repito)
function ventasPorCiudad(ventas, ciudad) {
  const ciudadBuscada = (ciudad ?? "").trim().toLowerCase();
  let totalCiudad = 0;

  for (const ventaC of ventas) {
    const ciudadVenta = (ventaC.ciudad ?? "").trim().toLowerCase();

    if (ciudadVenta === ciudadBuscada) {
      totalCiudad += valorVenta(ventaC);
    }
  }

  return totalCiudad;
}

//console.log('El total de cada Ciudad es:');  console.log('Medellín -',ventasPorCiudad(ventas, "Medellín"))  console.log('Bogotá -',ventasPorCiudad(ventas, "Bogotá"))  console.log('Cali -',ventasPorCiudad(ventas, "Cali"))  console.log('Pereira -',ventasPorCiudad(ventas, "Pereira"))     


//MINI RETO 7 D2 S1

const normalizar = (texto) => (texto ?? "").trim().toLowerCase();

const totalCiudadCadena = (ventas, ciudad, contador) => {
  const buscada = normalizar(ciudad);

  return ventas
    .map((venta) => {
      if (contador) contador.pasos += 1
      return { ...venta, ciudad: normalizar(venta.ciudad) }
    })
    .filter((venta) => {
      if (contador) contador.pasos += 1
      return venta.ciudad===buscada 
    })
    .map((venta) => {
      if (contador) contador.pasos += 1
      return valorVenta(venta)
    })
    .reduce((acc, monto) => {
      if (contador) contador.pasos += 1
      return acc + monto
    }, 0);
};


const totalCiudadUnaPasada = (ventas, ciudad, contador) => {
  const buscada = normalizar(ciudad);
  let total = 0;

  for (const venta of ventas) {
    if (contador) contador.pasos += 1;
    if (normalizar(venta.ciudad) === buscada) {
      total += valorVenta(venta);
    }
  }

  return total;
};
//console.log(totalCiudadCadena(ventas,"Medellín"))

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalCiudadCadena,
  totalCiudadUnaPasada
}