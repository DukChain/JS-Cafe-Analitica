DIA 1
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


MICRO RETO 3

totalVendidoM:

¿Qué recorro?: El arreglo items (los registros de ventas).

¿Qué filtro?: No realiza ningún filtrado; procesa todos los registros recibidos.

¿Qué transformo?: Cada objeto venta en su valor monetario mediante .map((venta) => venta.cantidad * venta.precio).

¿Qué acumulo?: La suma total de todos esos montos calculados en un único valor numérico (total), partiendo de 0.

¿Cómo agrupo?: No agrupa; consolida toda la colección en un solo total general.

unidadesVendidasM:

¿Qué recorro?: El arreglo items (los registros de ventas).

¿Qué filtro?: No realiza ningún filtrado; toma en cuenta todas las ventas.

¿Qué transformo?: No transforma previamente el arreglo con .map(), extrae directamente venta.cantidad dentro de la reducción.

¿Qué acumulo?: La suma de venta.cantidad de cada registro en un número (total), iniciando en 0.

¿Cómo agrupo?: No agrupa; devuelve un único total de unidades vendidas.

ventasPorCiudadM:

¿Qué recorro?: El arreglo lista (los registros de ventas).

¿Qué filtro?: Con .filter(), conserva únicamente las ventas cuya ciudad normalizada ((venta.ciudad ?? "").trim().toLowerCase()) coincide con objetivo ((ciudadExistente ?? "").trim().toLowerCase()).

¿Qué transformo?: Normaliza tanto el parámetro de búsqueda como el campo venta.ciudad eliminando espacios y pasando a minúsculas para poder compararlos.

¿Qué acumulo?: La suma del valor de cada venta filtrada (venta.cantidad * venta.precio) en un número (acumulado), partiendo de 0.

¿Cómo agrupo?: No crea múltiples grupos; filtra por una sola ciudad específica y acumula su total individual.

totalPorCiudad:

¿Qué recorro?: El arreglo ventas.

¿Qué filtro?: No filtra registros; recorre todas las ventas disponibles.

¿Qué transformo?: Normaliza el nombre de cada ciudad con (item.ciudad ?? "").trim().toLowerCase() para usarlo como clave y calcula el valor monetario de cada venta mediante valorVenta(item).

¿Qué acumulo?: El dinero vendido por cada ciudad dentro del objeto tCiudad, sumando (tCiudad[clave] ?? 0) + valorVenta(item) a partir de un objeto vacío {}.

¿Cómo agrupo?: Agrupa por la clave normalizada de item.ciudad dentro de un objeto diccionario ({ ciudad: totalDinero }), unificando variantes como "Medellín" y "medellín".

unidadesPorProducto:

¿Qué recorro?: El arreglo ventas.

¿Qué filtro?: No filtra registros; incluye todas las filas de ventas.

¿Qué transformo?: Normaliza el nombre del producto con (item.producto ?? "").trim().toLowerCase() para generar una clave uniforme.

¿Qué acumulo?: La cantidad de unidades (item.cantidad) por cada producto dentro del objeto uProducto, usando (uProducto[clave] ?? 0) + item.cantidad sobre un objeto inicial {}.

¿Cómo agrupo?: Agrupa por el nombre normalizado de item.producto como propiedad de un objeto ({ producto: totalUnidades }).

topProductosPorValor:

¿Qué recorro?: Primero recorre el arreglo ventas para sumar los montos por producto, y luego recorre el arreglo de pares generado por Object.entries(acumulador) para ordenarlo y recortarlo.

¿Qué filtro?: Incluye una guarda inicial (if (k <= 0) return []) para descartar límites inválidos o vacíos, y al final recorta los primeros k resultados con .slice(0, k).

¿Qué transformo?: Normaliza item.producto con (item.producto ?? "").trim().toLowerCase(), convierte el objeto acumulador en un arreglo de pares [producto, total] con Object.entries() y lo ordena de mayor a menor sin mutar mediante .toSorted((a, b) => b[1] - a[1]).

¿Qué acumulo?: El valor monetario (item.cantidad * item.precio) generado por cada producto dentro de acumulador, iniciando en {}.

¿Cómo agrupo?: Agrupa las ventas por el nombre normalizado de item.producto en un objeto diccionario antes de transformarlo en el ranking ordenado de los k productos con mayor valor.


MINIRETO 4


-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

Se finaliza el Dia 1 de semana 1 el Nov 22, en este se realiza el proceso con la guia de Gemini, la AI se le implemente un prompt sencillo donde hara de profesor y toda la informacion que esta me de sera por medio de pistas o guias, aun con esta ayuda lo que mas me costo fue entender y realizar el ultimo minireto aunque en papel era simplemente hacer un conjunto de console.log mostrando la informacion requerida me fue mas complicado entender que papel cumplia el toLocaleString y en medio de eso llegue a pedir algo mas detallado a la AI cosa que me entrego esta seccion.


texto
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((palabra) => palabra[0].toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");

Algo que es puramente estetico sin proposito especial pero que tambien necesite entender para poder llegarlo a usar en elgun futuro o poder comprender algo similar en algun otro momento.


--------------------------------------------------

DIA 2
MINI RETO 1

 Si n llega a ser 100, 1.000, 10.000 y 100.000 respectivamente y usando la informacion de analitica y explorar la mayoria llega a ser O(n) y con la integracion de primera vente ese es O(1), porque de ellas:

 totalVendidoM, ventaMayor y totalPorCiudad son O(n) ya que en cada vuelta todo llega a ejecutarse una unica vez y primeraVenta es O(1) ya que como su nombre dice al pedir solo la primera venta este solo se ejecuta una unica vez independiente del arreglo 

┌─────────┬─────────┬─────────────────┬──────────────────┬───────────────┬───────────────────┐
│ (index) │ n       │ op_primeraVenta │ op_totalVendidoM │ op_ventaMayor │ op_totalPorCiudad │
├─────────┼─────────┼─────────────────┼──────────────────┼───────────────┼───────────────────┤
│ 0       │ 100     │ 1               │ 200              │ 100           │ 100               │
│ 1       │ 1000    │ 1               │ 2000             │ 1000          │ 1000              │
│ 2       │ 10000   │ 1               │ 20000            │ 10000         │ 10000             │
│ 3       │ 100000  │ 1               │ 200000           │ 100000        │ 100000            │
│ 4       │ 1000000 │ 1               │ 2000000          │ 1000000       │ 1000000           │
└─────────┴─────────┴─────────────────┴──────────────────┴───────────────┴───────────────────┘

la tabla muestra resultados esperados, siendo una ligera diferencia en totalVendidoM ya que ahi se valido es cuando pasaba el ciclo por .map y .reduce, siendo que de igual manera eso no crea conflicto alguno ya que a final de cuentas sigue siendo O(n) porque el sistema sigue corriendo una unica vez aunque sean 2 metodos los implementados en la funcion.



MINI RETO 2

analizando la informacion de consola

clientesRecurrentes-1000: 3.839ms
n = 1000 -> recurrentes encontrados: 266
clientesRecurrentes-2000: 12.736ms
n = 2000 -> recurrentes encontrados: 537
clientesRecurrentes-4000: 45.494ms
n = 4000 -> recurrentes encontrados: 1072
clientesRecurrentes-8000: 232.113ms
n = 8000 -> recurrentes encontrados: 2122
clientesRecurrentes-16000: 908.052ms
n = 16000 -> recurrentes encontrados: 4271

como dice el problema esto es un O(n²) porque mientras mas ventas se registren mas ciclos tendra que hacer la funcion de clientesRecurrentes causando un mayor retraso de tiempo.

con 100.000 y 1.000.000 se hizo estimaciones donde la escala llega 35 s y 59 min respectivamente de manera aproximada
y al realizar el proceso con 100.000 se llega a tener un total de 37.25 s


Costo oculto en `clientesRecurrentes`: `recurrentes.includes()`

- El costo oculto: `recurrentes.includes(ventas[i].cliente)` realiza una búsqueda lineal (paso a paso) dentro del arreglo `recurrentes`; no es una consulta instantánea.
- Dónde ocurre: Está evaluándose dentro del ciclo anidado (`j`), por lo que cada vez que se evalúa la condición puede escanear los elementos ya insertados en `recurrentes`.
- Efecto en el peor caso:
  - Los dos ciclos sobre `ventas` ya generan $\frac{n(n - 1)}{2}$ comparaciones de pares, base de un comportamiento cuadrático $O(n^2)$.
  - Si existen muchos clientes distintos que se vuelven recurrentes (`recurrentes` crece hasta tamaño proporcional a $n$), cada búsqueda con `.includes()` puede costar hasta $O(n)$.
  - En el peor escenario combinado, el trabajo crece hasta un orden de $O(n^3)$ (o $O(n^2 \cdot m)$, siendo $m$ la longitud de `recurrentes`), explicando el fuerte salto de tiempos al escalar el volumen de ventas.


   En conclusion el porque el sistema se vuelve lento al usar los datos reales es porque el sistema muentras mas informacion tenga mas tardara, es un proceso exponencial que afecta toda la produccion.


   
MINI RETO 3

