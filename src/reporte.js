const { ventas } = require('./datos')
const { totalVendidoM, unidadesVendidasM, ventasPorCiudadM,totalPorCiudad, unidadesPorProducto, topProductosPorValor,ventasDelDia } = require('./analitica')
const { TotalCantidades, totalVendido, ticketPromedio } = require('./explorar')


const formatoCOP = (valor) => Number(valor ?? 0).toLocaleString("es-CO");

const capitalizar = (texto = "") =>
  texto
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((palabra) => palabra[0].toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");

const mostrarReporte = () => {
  console.log("========================================");
  console.log("        REPORTE GENERAL DE VENTAS       ");
  console.log("========================================");

  // 1. Resumen general
  console.log("\n[1] RESUMEN GENERAL");
  console.log(`Total vendido:     $${formatoCOP(totalVendidoM(ventas))}`);
  console.log(`Unidades vendidas: ${formatoCOP(unidadesVendidasM(ventas))}`);
  console.log(`Ticket promedio:   $${formatoCOP(ticketPromedio(ventas))}`);

  // 2. Ventas por ciudad (claves normalizadas sin duplicados como "Bogotá" / "Bogotá ")
  console.log("\n[2] VENTAS POR CIUDAD");
  Object.entries(totalPorCiudad(ventas)).forEach(([ciudad, total]) => {
    console.log(`- ${capitalizar(ciudad).padEnd(14)} $${formatoCOP(total)}`);
  });

  // 3. Unidades por producto
  console.log("\n[3] UNIDADES POR PRODUCTO");
  Object.entries(unidadesPorProducto(ventas)).forEach(([producto, unidades]) => {
    console.log(`- ${capitalizar(producto).padEnd(22)} ${formatoCOP(unidades)} uds`);
  });

  // 4. Top 3 de productos por valor
  console.log("\n[4] TOP 3 PRODUCTOS POR VALOR");
  topProductosPorValor(ventas, 3).forEach(([producto, valor], idx) => {
    console.log(`${idx + 1}. ${capitalizar(producto).padEnd(20)} $${formatoCOP(valor)}`);
  });

  // 5. Resumen por día (con ventas y sin ventas) usando ventasDelDia
  const diaConVentas = ventasDelDia(ventas, "2026-09-01");
  console.log("\n--- Día con ventas (2026-09-01) ---");
  console.log(`Registros:       ${diaConVentas.length}`);
  console.log(`Unidades:        ${unidadesVendidasM(diaConVentas)}`);
  console.log(`Total vendido:   $${formatoCOP(totalVendidoM(diaConVentas))}`);
  console.log(`Ticket promedio: $${formatoCOP(ticketPromedio(diaConVentas))}`);

  const diaSinVentas = ventasDelDia(ventas, "2026-09-10");
  console.log("\n--- Día sin ventas (2026-09-10) ---");
  console.log(`Registros:       ${diaSinVentas.length}`);
  console.log(`Unidades:        ${unidadesVendidasM(diaSinVentas)}`);
  console.log(`Total vendido:   $${formatoCOP(totalVendidoM(diaSinVentas))}`);
  console.log(`Ticket promedio: $${formatoCOP(ticketPromedio(diaSinVentas))}`);
};

mostrarReporte();