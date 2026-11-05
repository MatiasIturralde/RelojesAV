# Relojes AV - Sitio Web Oficial

Sitio web moderno, responsive y de estética de lujo diseñado para **Relojes AV** (@relojes_av) en **modo claro (blanco puro con detalles en dorado)** y con código 100% en español.

---

## Estructura y Rubros del Negocio

1. **Rubro Principal (Inicial): Venta de Relojes**
   - El sitio web abre directamente con la pestaña de **Relojes** activa por defecto.
   - Cuenta con filtros dinámicos por rubros y por clases predefinidas.
   - Ordenamiento inteligente por prioridad de clase y precio (de mayor a menor).

2. **Rubro Secundario: Venta de Antigüedades**
   - Acceso con un solo clic a través de la pestaña destacada "Antigüedades".
   - Piezas familiares, históricas y de colección.

3. **Rubro Último: Ventas Varias / Otros**
   - Pestaña para artículos especiales: accesorios, mallas, estuches y coleccionables.

---

## Sistema de Clases Predefinidas y Prioridad de Visualización

Los productos se organizan según dos clases predefinidas con la siguiente prioridad jerárquica de visualización:

1. **Prioridad 1: Los míos** (`losMios`) - Colección personal (clase asignada por defecto a todos los productos actualmente).
2. **Prioridad 2: Los de la relojería** (`losDeLaRelojeria`) - Piezas de stock de la relojería.

### Criterio de Ordenamiento
- **Nivel 1 (Jerarquía de Clase):** Siempre se muestran primero los productos de la clase 1 ("Los míos"), seguidos por la clase 2 ("Los de la relojería").
- **Nivel 2 (Precio Descendente):** Dentro de cada una de estas clases, los artículos se muestran ordenados rigurosamente de **mayor precio a menor precio**.
- **Filtros por Clase:** Los usuarios también pueden pulsar cualquiera de los botones de clase ("Todas las clases", "1- Los míos", "2- Los de la relojería") para filtrar en vivo.

### ¿Cómo cambiar la clase de un producto en el HTML?
En cada tarjeta `<article>`, simplemente se actualizan los atributos:
```html
<!-- Ejemplo asignando a "Los de la relojería" -->
<article class="tarjeta-producto losDeLaRelojeria" data-categoria="relojes" data-clase="losDeLaRelojeria" data-precio="50000">
  ...
  <div class="linea-categoria-tarjeta">
    <span class="insignia-clase-producto insignia-losDeLaRelojeria">Los de la relojería</span>
  </div>
  ...
</article>
```

Valores válidos para `data-clase`:
- `losMios`
- `losDeLaRelojeria`

---

## Contacto y Canales Oficiales

- **WhatsApp Oficial:** `095613589` (Enlace directo con mensaje pre-armado y botón flotante)
- **Instagram Oficial:** [@relojes_av](https://www.instagram.com/relojes_av)
- **Envíos:** Cobertura en todo el país con atención personalizada.

---
