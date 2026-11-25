const {totalCiudadCadena, ventasPorCiudad}  = require("./explorar");

const CATALOGO = [
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Molino manual", precio: 120000 },
]

const CIUDADES = ["Medellín", "Bogotá", "Cali", "Pereira"]

function elegirAleatorio(lista) {
  const indice = Math.floor(Math.random() * lista.length)
  return lista[indice];
}

function enteroEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generarVentas(n) {
  const ventasGeneradas = []

  if (n <= 0) {
    return ventasGeneradas
  }

  const maxClientes = Math.max(1, Math.floor(n / 3))

  for (let i = 0; i < n; i++) {
    const numCliente = enteroEntre(1, maxClientes)
    const item = elegirAleatorio(CATALOGO)

    ventasGeneradas.push({
      id: i + 1,
      fecha: "2026-09-01",
      cliente: `C${String(numCliente).padStart(2, "0")}`,
      producto: item.producto,
      ciudad: elegirAleatorio(CIUDADES),
      cantidad: enteroEntre(1, 5),
      precio: item.precio,
    })
  }

  return ventasGeneradas
}

























module.exports = {
  generarVentas,
};