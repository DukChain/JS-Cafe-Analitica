# Rendimiento del motor de analítica — Café Origen

Este documento responde una pregunta sencilla: **¿qué pasa con cada función cuando las ventas dejan de ser 12 y pasan a ser un millón?**

Para contestarla medí cada función con **10.000 ventas** generadas por `generador.js` y, a partir de ahí, proyecté qué ocurriría con 1.000.000.

## Cómo leer los números

- **n** = cantidad de ventas.
- **Tiempo O(n)** significa "si las ventas se multiplican por 100, el tiempo también se multiplica por 100". **O(n²)** significa "si se multiplican por 100, el tiempo se multiplica por 10.000".
- **Espacio O(1)** = la función no necesita más memoria aunque haya millones de ventas. **O(n)** = necesita memoria extra proporcional a las ventas. **O(k) / O(p)** = la memoria depende de cuántas ciudades (k) o productos (p) *distintos* haya, no de cuántas ventas.
- **Pasos** = cuántas veces trabaja la función sobre una venta (lo conté con el objeto `{ pasos: 0 }`). Este número es exacto y no depende del computador.
- **Milisegundos (ms)** = tiempo promedio de 200 ejecuciones con 10.000 ventas. Este número **sí depende del computador**: en el tuyo saldrá distinto, pero la proporción entre funciones debería parecerse.

---

## 1. Tabla de funciones

### Funciones del Día 1 (`explorar.js` y `analitica.js`)

| Función | Qué hace | Tiempo | Espacio | Justificación | Medido con 10.000 ventas |
|---|---|---|---|---|---|
| `valorVenta` | Multiplica cantidad por precio de **una** venta | O(1) | O(1) | Una sola multiplicación, sin importar cuántas ventas existan | Instantáneo (no se puede medir) |
| `primeraVenta` | Devuelve la primera venta de la lista | O(1) | O(1) | Mira una posición y listo, no recorre nada | 1 paso |
| `totalVendido` | Suma el valor de todas las ventas | O(n) | O(1) | Un solo ciclo con una variable acumuladora | ≈ 0,04 ms |
| `unidadesVendidas` | Suma las unidades de todas las ventas | O(n) | O(1) | Un solo ciclo con una variable acumuladora | ≈ 0,01 ms |
| `ventaMayor` | Encuentra la venta de mayor valor | O(n) | O(1) | Un ciclo; solo recuerda *una* venta (la mayor hasta ahora), no una lista | 10.000 pasos, ≈ 0,11 ms |
| `TotalCantidades` | Cuenta cuántas ventas tienen cantidad mayor que 0 | O(n) | O(1) | Un ciclo con un contador | ≈ 0,08 ms |
| `ticketPromedio` | Total vendido dividido entre ventas con cantidad > 0 | O(n) | O(1) | Llama a `totalVendido` y `TotalCantidades`: dos recorridos seguidos, que se suman, no se multiplican | ≈ 0,10 ms |
| `ventasPorCiudad` | Total vendido en una ciudad (ciclo + `if`) | O(n) | O(1) | Un ciclo; el texto de la ciudad que normaliza en cada vuelta se desecha enseguida | ≈ 0,30 ms |
| `totalVendidoM` | Total vendido usando `map` + `reduce` | O(n) | O(n) | El `map` arma primero un arreglo con un número por venta y luego `reduce` lo suma | 20.000 pasos (2 por venta), ≈ 0,14 ms |
| `unidadesVendidasM` | Unidades vendidas usando solo `reduce` | O(n) | O(1) | `reduce` devuelve un solo número, no arma ningún arreglo | ≈ 0,05 ms |
| `ventasPorCiudadM` | Total de una ciudad usando `filter` + `reduce` | O(n) | O(n) | El `filter` guarda las ventas de esa ciudad (en el peor caso, todas) | ≈ 0,28 ms |
| `totalPorCiudad` | Total vendido por **cada** ciudad, en un objeto | O(n) | O(k) | Un recorrido; el objeto tiene una línea por ciudad distinta (4 aquí), no una por venta | 10.000 pasos, ≈ 0,58 ms |
| `unidadesPorProducto` | Unidades vendidas por **cada** producto | O(n) | O(p) | Igual que la anterior, con una línea por producto (5 aquí) | ≈ 0,78 ms |
| `topProductosPorValor` | Los `k` productos que más dinero generaron | O(n + p log p) | O(p) | Recorre las ventas una vez; luego ordena los p productos distintos. Todas sus estructuras (acumulador, pares, copia ordenada) son de tamaño p | ≈ 0,80 ms |
| `ventasDelDia` | Filtra las ventas de una fecha | O(n) | O(n) | El `filter` devuelve un arreglo nuevo; si todas las ventas son de ese día, es del tamaño de la lista original | ≈ 0,16 ms |

### Clientes recurrentes

| Función | Qué hace | Tiempo | Espacio | Justificación | Medido |
|---|---|---|---|---|---|
| `clientesRecurrentes` (versión con doble ciclo) | Lista los clientes que compraron más de una vez | **O(n²)** | O(c) | Compara cada venta con todas las siguientes (n × n / 2 comparaciones) y encima usa `.includes()`, que vuelve a recorrer la lista de resultados. `c` = clientes recurrentes encontrados | 10.000 ventas: ≈ 360 ms · 20.000: ≈ 1.940 ms · 8.000: ≈ 260 ms |

Dato clave: al **duplicar** las ventas (10.000 → 20.000) el tiempo se multiplicó por **5**, no por 2. Esa es la huella de una función cuadrática.

### Las dos versiones de `totalCiudad`

| Función | Qué hace | Tiempo | Espacio | Justificación | Medido con 10.000 ventas |
|---|---|---|---|---|---|
| `totalCiudadCadena` | Total de una ciudad con `map → filter → map → reduce` | O(n) | O(n) | Cuatro etapas una después de otra (se suman: 2n + 2m pasos, constante × n). Pero crea 3 arreglos, y el primer `map` copia cada venta solo para cambiarle la ciudad | ≈ 24.950 pasos, ≈ 0,76 ms |
| `totalCiudadUnaPasada` | Lo mismo con un único ciclo | O(n) | O(1) | Un recorrido, cero arreglos, solo un acumulador y un texto temporal | 10.000 pasos, ≈ 0,27 ms |

Ambas dan **exactamente el mismo resultado** (lo comprobé con 10.000 ventas). La cadena hace unas **2,5 veces más pasos** y tarda unas **2,8 veces más**, pero las dos crecen al mismo ritmo: por eso las dos son O(n). La diferencia real está en la memoria.

---

## 2. Proyección: ¿y con 1.000.000 de ventas?

El criterio es simple: pasar de 10.000 a 1.000.000 es multiplicar las ventas por **100**.

- Si la función es O(n) → el tiempo se multiplica por 100.
- Si la función es O(n²) → el tiempo se multiplica por 100 × 100 = **10.000**.

| Función | Con 10.000 ventas | Con 1.000.000 (estimado) | Cómo lo calculé |
|---|---|---|---|
| `totalVendido` | 0,04 ms | ≈ 4 ms | × 100 |
| `unidadesVendidas` | 0,01 ms | ≈ 1 ms | × 100 |
| `ventaMayor` | 0,11 ms | ≈ 11 ms | × 100 |
| `TotalCantidades` | 0,08 ms | ≈ 8 ms | × 100 |
| `ticketPromedio` | 0,10 ms | ≈ 10 ms | × 100 |
| `ventasPorCiudad` | 0,30 ms | ≈ 30 ms | × 100 |
| `totalVendidoM` | 0,14 ms | ≈ 14 ms | × 100 |
| `unidadesVendidasM` | 0,05 ms | ≈ 5 ms | × 100 |
| `ventasPorCiudadM` | 0,28 ms | ≈ 28 ms | × 100 |
| `totalPorCiudad` | 0,58 ms | ≈ 58 ms | × 100 |
| `unidadesPorProducto` | 0,78 ms | ≈ 78 ms | × 100 |
| `topProductosPorValor` | 0,80 ms | ≈ 80 ms | × 100 (ordenar 5 productos casi no pesa) |
| `ventasDelDia` | 0,16 ms | ≈ 16 ms | × 100 |
| `totalCiudadUnaPasada` | 0,27 ms | ≈ 27 ms | × 100 |
| `totalCiudadCadena` | 0,76 ms | ≈ 76 ms (más si falta memoria) | × 100; además crea ≈ 1.000.000 de objetos copia |
| **`clientesRecurrentes`** | **0,36 s** | **≈ 1 a 1,5 horas** | × 10.000 (0,36 s × 10.000 ≈ 1 hora; con la medición de 20.000 ventas sale ≈ 1,3 horas) |

### El reporte completo (`reporte.js`)

El reporte llama a `totalVendidoM`, `unidadesVendidasM`, `ticketPromedio`, `totalPorCiudad`, `unidadesPorProducto`, `topProductosPorValor` y dos veces a `ventasDelDia` (con sus totales). Sumando todo, el reporte entero tardaría **alrededor de un tercio de segundo** con un millón de ventas. No usa `clientesRecurrentes`, así que hoy no se ve afectado por el problema grande.

### Qué tan confiable es esta proyección

- Las funciones lineales las proyecté con una regla de tres. En la práctica, con un millón de ventas pueden salir **2 a 5 veces más lentas** de lo estimado, porque la lista deja de caber en la memoria rápida del procesador. Aun así seguirían tardando menos de un segundo.
- La de `clientesRecurrentes` es una estimación **optimista**: el `.includes()` también se vuelve más lento a medida que la lista de recurrentes crece, así que en la realidad podría tardar más de lo calculado.
- Los milisegundos son de mi máquina de pruebas; lo confiable de verdad son las proporciones y los pasos contados.

---

## 3. Riesgos: de mayor a menor

**Criterio, en este orden:**
1. **Cómo crece el tiempo.** Una función cuadrática es la más peligrosa porque se vuelve inutilizable de golpe: no avisa, simplemente pasa de "rápida" a "horas".
2. **Cuánta memoria pide.** Una función que copia o guarda una cantidad de datos proporcional a las ventas puede quedarse sin memoria antes de quedarse sin tiempo.
3. **El tamaño de la constante.** Si dos funciones crecen igual, es más riesgosa la que hace más trabajo por venta.

| Puesto | Función | Riesgo | Por qué |
|---|---|---|---|
| 1 | `clientesRecurrentes` | Muy alto | Cuadrática: con 1.000.000 de ventas tardaría aproximadamente una hora. Es la única que no escala |
| 2 | `totalCiudadCadena` | Medio | Tiempo lineal, pero crea hasta 3 arreglos y n objetos copia. Con muchos datos gasta mucha memoria y hace más del doble de trabajo |
| 3 | `totalVendidoM`, `ventasPorCiudadM`, `ventasDelDia` | Bajo-medio | Lineales, pero cada una crea un arreglo del tamaño de las ventas (o casi) |
| 4 | `topProductosPorValor` | Bajo | Ordena, que es más caro que recorrer. Hoy solo son 5 productos, pero si el catálogo creciera mucho, el ordenamiento empezaría a pesar |
| 5 | `totalPorCiudad`, `unidadesPorProducto` | Bajo | Lineales; su memoria depende de cuántas ciudades/productos hay, que son pocos |
| 6 | `totalVendido`, `unidadesVendidas`, `ventaMayor`, `TotalCantidades`, `ticketPromedio`, `ventasPorCiudad`, `unidadesVendidasM`, `totalCiudadUnaPasada` | Muy bajo | Un recorrido y memoria constante |
| 7 | `valorVenta`, `primeraVenta` | Ninguno | Trabajo fijo, no dependen de n |

En resumen: hay **una** función de la que preocuparse hoy (`clientesRecurrentes`) y el resto crece de forma tranquila.

---

## 4. Plan de optimización: `clientesRecurrentes`

*(Solo la idea; todavía no se implementa.)*

**¿Qué trabajo se repite?**
Para cada venta, la función se pone a buscar en **todas las ventas siguientes** si ese cliente aparece otra vez. Es como si, en una fila de gente, cada persona le preguntara uno por uno a todos los de atrás "¿te llamas igual que yo?". El mismo cliente se vuelve a buscar cada vez que aparece, y las mismas ventas se vuelven a mirar una y otra vez. Además, antes de agregar un cliente al resultado, `.includes()` revisa toda la lista de recurrentes desde el principio. Son dos búsquedas repetidas, una dentro de otra.

**¿Qué información se podría guardar para no buscarla de nuevo?**
Lo único que importa saber de cada venta es: *¿ya había visto a este cliente antes?* Esa respuesta se puede ir **recordando mientras se recorre la lista una sola vez**:

- Una "lista de clientes ya vistos" donde preguntar si un cliente está sea casi instantáneo (la estructura `Set` de JavaScript sirve justo para eso).
- Si al llegar a una venta su cliente ya estaba en esa lista, entonces es recurrente: se anota. Si no, se agrega a la lista de vistos y se sigue.
- Para no anotar dos veces al mismo recurrente, se puede usar una segunda lista parecida (otro `Set`) o contar cuántas veces aparece cada cliente (un `Map`) y al final quedarse con los que tengan 2 o más.

**Qué se espera ganar**

| | Ahora | Después |
|---|---|---|
| Tiempo | O(n²) | O(n) |
| Memoria | O(c) | O(c) (c = clientes distintos) |
| 10.000 ventas | ≈ 360 ms | similar a las otras funciones lineales (décimas de milisegundo) |
| 1.000.000 de ventas | ≈ 1 hora o más | menos de un segundo |

Se cambia un poco de memoria extra (recordar los clientes vistos) por una mejora enorme en tiempo.

**Cómo comprobar que la mejora es correcta cuando se implemente**
- Con `datos.js` debe devolver exactamente C01, C02 y C03 (en cualquier orden).
- Con lotes generados, la cantidad de recurrentes debe coincidir con la de la versión actual para los mismos datos.
- Con lista vacía o con una sola venta, debe devolver una lista vacía.
- Volver a medir 1.000, 2.000, 4.000, 8.000 y 16.000 ventas: ahora, al duplicar las ventas, el tiempo debería duplicarse, no multiplicarse por 4 o por 5.

---

## Nota sobre la elaboración de este documento

Este documento se redactó con ayuda de Claude (Anthropic), que armó la estructura, tomó las mediciones y escribió el texto a partir de mi código y mis indicaciones. El tema se estudió antes y durante el proceso, con la guía de Claude, hasta comprender los conceptos de complejidad temporal y espacial, la diferencia entre las dos versiones de `totalCiudad` y por qué `clientesRecurrentes` es el punto crítico del motor.
