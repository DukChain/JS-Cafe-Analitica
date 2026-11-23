const PRODUCTOS = [
  "Origen Huila 500 g",
  "Origen Nariño 250 g",
  "Origen Sierra 500 g",
  "Prensa francesa",
  "Molino manual",
];

const PRECIOS = [42000, 26000, 45000, 95000, 120000];

const CIUDADES = ["Medellín", "Bogotá", "Cali", "Pereira"];

function elegirAleatorio(lista) {
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

function enteroEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarVentas (n) {
  const ventasGeneradas = [];

  if (n <= 0) {
    return ventasGeneradas;
  }

  const maxClientes = Math.max(1, Math.floor(n / 3));

  for (let i = 0; i < n; i++) {
    const idxProducto = Math.floor(Math.random() * PRODUCTOS.length);
    const numCliente = enteroEntre(1, maxClientes);

    ventasGeneradas.push({
      id: i + 1,
      fecha: "2026-09-01",
      cliente: `C${String(numCliente).padStart(2, "0")}`,
      producto: PRODUCTOS[idxProducto],
      ciudad: elegirAleatorio(CIUDADES),
      cantidad: enteroEntre(1, 5),
      precio: PRECIOS[idxProducto],
    });
  }

  return ventasGeneradas;
}

module.exports = {
  generarVentas,
};