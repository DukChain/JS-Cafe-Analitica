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

---

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

