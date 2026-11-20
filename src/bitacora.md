MICRO RETO 1


Diccionario de datos

Cada registro del array ventas es un objeto con las siguientes propiedades:

| Propiedad | Tipo de dato en JS | Significado en el dataset
| :--- | :--- | :--- | :--- 
| `id` | `number` (entero) | Identificador único de cada registro de venta
| `fecha` | `string` (formato `YYYY-MM-DD`) | Fecha en que se realizó la venta.
| `cliente` | `string` | Código identificador del cliente que realizó la compra.
| `producto` | `string` | Nombre o referencia del artículo vendido (café por origen/gramaje o accesorio).
| `ciudad` | `string` | Ciudad donde se efectuó o registró la venta.
| `cantidad` | `number` (entero) | Número de unidades vendidas del producto en ese registro.
| `precio` | `number` (entero) | Precio unitario del producto en pesos colombianos (COP).



Casos borde detectados

1. Inconsistencia de mayúsculas/minúsculas en ciudad (`"Medellín"` vs. `"medellín"`):
   Hallazgo: En el registro `id: 5`, `ciudad` aparece en minúscula (`"medellín"`), mientras que en otros registros (`id: 1`, `id: 4`, `id: 11`) aparece capitalizada (`"Medellín"`). Si se agrupa o filtra por ciudad sin normalizar, se contarán como dos ciudades distintas.
   Decisión: Normalizar el texto de `ciudad` (aplicando `trim()` y estandarizando la capitalización, por ejemplo convirtiendo `"medellín"` a `"Medellín"`) antes de calcular métricas, agrupaciones o tablas resumen.

2. Cantidad igual a 0 en una venta (`id: 8`, `cantidad: 0`):
   Hallazgo: El registro con `id: 8` tiene `cantidad: 0`. Es un caso borde porque representa un registro de venta con cero unidades (puede tratarse de algun error, una venta anulada o un registro sin despacho).
   Decisión: Conservar el registro para mantener la trazabilidad, pero documentarlo y filtrarlo (`cantidad > 0`) en los cálculos de ventas efectivas e ingresos totales.

3. Ausencia de una propiedad con el total de la venta (subtotal o total):

    Hallazgo: Cada registro incluye cantidad y precio (unitario), pero no trae calculado el valor total de esa línea de venta (cantidad * precio). Si se suma directamente la propiedad precio, se obtendría un valor incorrecto en las compras de más de una unidad.

    Decisión: Calcular dinámicamente el total por registro (registro.cantidad * registro.precio) al procesar los datos, sin modificar la estructura original.



MICRO RETO 2


Pruebas de funciones y comportamiento con arreglo vacío

Se evaluaron todas las funciones de `analitica.js` frente a tres escenarios:
1. Arreglo completo (`ventas`): los 12 registros de `datos.js`.
2. Arreglo de un solo elemento (`[ventas[0]]`): `{ id: 1, ..., cantidad: 2, precio: 42000 }` (valor `84000`).
3. Arreglo vacío (`[]`): sin registros.

Decisiones para el arreglo vacío (`[]`)

`totalVendido([])` -> `0`: Si no hubo ventas, el dinero total vendido es `0`.
`unidadesVendidas([])` -> `0`: Si no hubo ventas, las unidades vendidas son `0`.
`ventaMayor([])` -> `null`: No existe ningún registro que pueda devolverse como venta mayor, por lo que retorna `null` en lugar de `undefined` o un error.
`ticketPromedio([])` -> `0` (o `null`): Al haber `0` ventas válidas, se evita dividir por cero (`0 / 0 = NaN`) devolviendo `0` como valor neutro seguro.
`ventasPorCiudad([], ciudad)` -> `0`: Si no hay registros, el total vendido en cualquier ciudad es `0`.

Matriz de resultados por escenario

| Función | Arreglo completo (`ventas`, 12 reg.) | Un solo elemento (`[ventas[0]]`) | Arreglo vacío (`[]`) 
| :--- | :--- | :--- | :--- 
| `totalVendido(arr)` | `985000` | `84000` | `0` 
| `unidadesVendidas(arr)` | `21` | `2` | `0` 
| `ventaMayor(arr)` | `{ id: 10, ..., cantidad: 4, precio: 42000 }` | `{ id: 1, ..., cantidad: 2, precio: 42000 }` | `null` 
| `ticketPromedio(arr)` | `89545.45454545454` (`985000 / 11`) | `84000` (`84000 / 1`) | `0` 
| `ventasPorCiudad(arr, "Medellín")` | `356000` | `84000` | `0` 



Verificación manual (Tablas de traza)

Traza 1: `totalVendido(ventas)` y `ticketPromedio(ventas)`

Se recorre cada registro de `ventas` acumulando `subtotal = cantidad * precio` y contando las ventas válidas (`cantidad > 0`):

| Iteración (`id`) | Producto | `cantidad` | `precio` | `valorVenta` (`cant * precio`) | Acumulado `totalVendido` | ¿Válida? (`cant > 0`) | Acumulado `ventasValidas` 
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- 
| Inicio | — | — | — | — | `0` | — | `0` 
| `1` | Origen Huila 500 g | `2` | `42000` | `84000` | `84000` | Sí | `1` 
| `2` | Origen Nariño 250 g | `1` | `26000` | `26000` | `110000` | Sí | `2` 
| `3` | Prensa francesa | `1` | `95000` | `95000` | `205000` | Sí | `3` 
| `4` | Origen Huila 500 g | `1` | `42000` | `42000` | `247000` | Sí | `4` 
| `5` | Origen Sierra 500 g | `3` | `45000` | `135000` | `382000` | Sí | `5` 
| `6` | Origen Nariño 250 g | `2` | `26000` | `52000` | `434000` | Sí | `6` 
| `7` | Molino manual | `1` | `120000` | `120000` | `554000` | Sí | `7` 
| `8` | Origen Huila 500 g | `0` | `42000` | `0` | `554000` | **No** (`0`) | `7` 
| `9` | Origen Sierra 500 g | `2` | `45000` | `90000` | `644000` | Sí | `8` 
| `10` | Origen Huila 500 g | `4` | `42000` | `168000` | `812000` | Sí | `9` 
| `11` | Prensa francesa | `1` | `95000` | `95000` | `907000` | Sí | `10` 
| `12` | Origen Nariño 250 g | `3` | `26000` | `78000` | **`985000`** | Sí | **`11`** 

Comprobación totalVendido(ventas): 985000 (coincide con el programa).
Comprobación ticketPromedio(ventas): 985000 / 11 = 89545.45454545454 (coincide con el programa).



Traza 2: `ventasPorCiudad(ventas, "  medellín  ")`

Normalización de entrada: `"  medellín  ".trim().toLowerCase()` $\rightarrow$ `"medellín"`.

| Iteración (`id`) | `venta.ciudad` original | `ciudadVenta` normalizada | ¿Coincide con `"medellín"`? | `valorVenta` | Acumulado `totalCiudad` 
| :--- | :--- | :--- | :--- | :--- | :--- 
| Inicio | — | — | — | — | `0` 
| `1` | `"Medellín"` | `"medellín"` | Sí | `84000` | `84000` 
| `2` | `"Bogotá"` | `"bogotá"` | No | `26000` | `84000` 
| `3` | `"Cali"` | `"cali"` | No | `95000` | `84000` 
| `4` | `"Medellín"` | `"medellín"` | Sí | `42000` | `126000` 
| `5` | `"medellín"` | `"medellín"` | Sí | `135000` | `261000` 
| `6` | `"Bogotá"` | `"bogotá"` | No | `52000` | `261000` 
| `7` | `"Bogotá"` | `"bogotá"` | No | `120000` | `261000` 
| `8` | `"Cali"` | `"cali"` | No | `0` | `261000` 
| `9` | `"Cali"` | `"cali"` | No | `90000` | `261000` 
| `10` | `"Pereira"` | `"pereira"` | No | `168000` | `261000` 
| `11` | `"Medellín"` | `"medellín"` | Sí | `95000` | **`356000`** 
| `12` | `"Bogotá"` | `"bogotá"` | No | `78000` | **`356000`** 

Comprobación ventasPorCiudad(ventas, "  medellín  "): 356000 (coincide con el programa).
