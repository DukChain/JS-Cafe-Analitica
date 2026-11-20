const { ventas } = require('./datos')

// MINIRETO 1

console.log('Cantidad de registros:', ventas.length)


console.log('Primer registro:', ventas[0]);
console.log('Último registro:', ventas[ventas.length - 1])


console.log('Producto en posición 4:', ventas[4].producto)


console.table(ventas)


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

console.log('El total de ventas es:',totalVendido(ventas));

function unidadesVendidas(ventas) {
    
    let totalUnidades = 0;

    for (const unidades of ventas) {
        
       totalUnidades = totalUnidades + unidades.cantidad
    }

    return totalUnidades
}

console.log('La cantidad vendida es:',unidadesVendidas(ventas));


function ventaMayor(ventas) {
    let Mayor = ventas[0];

  for (const VMayor of ventas) {
    if (valorVenta(VMayor) > valorVenta(Mayor)) {
      Mayor = VMayor;
    }
  }

  return Mayor;
}

console.log('La venta mayor es:',ventaMayor(ventas))


function TotalCantidades(ventas) {
    let TCantidad = 0
    for (const Cantidades of ventas) {
    
        if (Cantidades.cantidad>0) {
            TCantidad = TCantidad + 1
        }
    }

    return TCantidad    
}

function ticketPromedio(ventas) {
    
    let Tprom = totalVendido(ventas)/TotalCantidades(ventas)


    return Tprom
}

console.log('EL promedio es:',ticketPromedio(ventas));


function ventasPorCiudad(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();
  let totalCiudad = 0;

  for (const ventaC of ventas) {
    const ciudadVenta = ventaC.ciudad.trim().toLowerCase();

    if (ciudadVenta === ciudadBuscada) {
      totalCiudad += valorVenta(ventaC);
    }
  }

  return totalCiudad;
}

console.log('El total de cada Ciudad es:');
console.log('Medellín -',ventasPorCiudad(ventas, "Medellín"))
console.log('Bogotá -',ventasPorCiudad(ventas, "Bogotá"))      
console.log('Cali -',ventasPorCiudad(ventas, "Cali"))         
console.log('Pereira -',ventasPorCiudad(ventas, "Pereira"))     


