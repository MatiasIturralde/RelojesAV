// =============================================================================
// 1. CONFIGURACIÓN DE CLASES PREDEFINIDAS Y PRIORIDAD
//    Prioridad 1: Los míos (losMios)
//    Prioridad 2: Los de la relojería (losDeLaRelojeria)
// =============================================================================
var PRIORIDADES_CLASES = {
  'losMios': 1,
  'losDeLaRelojeria': 2,
};

// Estados globales de filtrado activo
var categoriaActual = 'relojes';
var filtroClaseActual = 'todas';

/**
 * Obtiene el número de prioridad jerárquica de una tarjeta según su clase asignada.
 * Menor número representa mayor prioridad (1 antes que 2, etc.).
 *
 * @param {HTMLElement} tarjeta - Elemento del producto
 * @returns {number} Número de prioridad
 */
function obtenerPrioridadClase(tarjeta) {
  var claseData = tarjeta.getAttribute('data-clase');
  if (claseData && PRIORIDADES_CLASES[claseData]) {
    return PRIORIDADES_CLASES[claseData];
  }
  for (var key in PRIORIDADES_CLASES) {
    if (tarjeta.classList.contains(key)) {
      return PRIORIDADES_CLASES[key];
    }
  }
  return 99; // Si no tiene clase asignada, se muestra al final
}

/**
 * Obtiene el precio numérico del producto a partir del atributo data-precio
 * o del texto visible dentro de .valor-precio, sincronizándolo dinámicamente si falta.
 *
 * @param {HTMLElement} tarjeta - Elemento del producto
 * @returns {number} Precio numérico limpio
 */
function obtenerPrecio(tarjeta) {
  var precioAttr = tarjeta.getAttribute('data-precio');
  if (precioAttr !== null && precioAttr !== '' && !isNaN(parseFloat(precioAttr))) {
    return parseFloat(precioAttr);
  }

  var elemPrecio = tarjeta.querySelector('.valor-precio');
  if (elemPrecio) {
    var texto = elemPrecio.textContent.trim();
    if (/consultar/i.test(texto)) {
      tarjeta.setAttribute('data-precio', '0');
      return 0;
    }
    var coincidencia = texto.match(/(?:U\$S|\$)?\s*([\d.]+)/);
    if (coincidencia && coincidencia[1]) {
      var valorLimpio = parseInt(coincidencia[1].replace(/\./g, ''), 10) || 0;
      tarjeta.setAttribute('data-precio', valorLimpio.toString());
      return valorLimpio;
    }
  }
  return 0;
}

/**
 * Ordena físicamente las tarjetas en el contenedor del DOM según:
 * - Para rubro 'relojes':
 *     1. Prioridad de clase predefinida (1 Los míos, 2 Relojería)
 *     2. De mayor a menor precio dentro de cada clase
 * - Para otros rubros ('antiguedades', 'otros'):
 *     De mayor a menor precio directamente
 */
function ordenarProductosEnDOM() {
  var contenedor = document.getElementById('cuadricula-productos');
  if (!contenedor) return;

  var tarjetas = Array.prototype.slice.call(contenedor.querySelectorAll('.tarjeta-producto'));

  tarjetas.sort(function (a, b) {
    var catA = a.getAttribute('data-categoria');
    var catB = b.getAttribute('data-categoria');

    // Si ambos son relojes, aplicar jerarquía por clases y luego precio
    if (catA === 'relojes' && catB === 'relojes') {
      var prioA = obtenerPrioridadClase(a);
      var prioB = obtenerPrioridadClase(b);

      if (prioA !== prioB) {
        return prioA - prioB;
      }
    }

    // Por precio de mayor a menor
    var precioA = obtenerPrecio(a);
    var precioB = obtenerPrecio(b);
    return precioB - precioA;
  });

  // Reinsertar en el contenedor en el orden ordenado
  tarjetas.forEach(function (tarjeta) {
    contenedor.appendChild(tarjeta);
  });
}

/**
 * Aplica el ordenamiento y filtra la visibilidad de las tarjetas.
 * El filtro de clases (1- Los míos, 2- Los de la relojería) SOLO se aplica al rubro 'relojes'.
 * En los demás rubros ('antiguedades', 'otros'), se muestran todos sus productos sin restricción de clase.
 */
function aplicarFiltrosYOrden() {
  // 1. Mostrar/Ocultar la barra de botones de clases según la categoría actual
  var barraClases = document.getElementById('barra-filtro-clases');
  if (barraClases) {
    if (categoriaActual === 'relojes') {
      barraClases.style.display = '';
    } else {
      barraClases.style.display = 'none';
    }
  }

  // 2. Reordenar productos
  ordenarProductosEnDOM();

  // 3. Filtrar visibilidad según categoría y clase
  var tarjetas = document.querySelectorAll('.tarjeta-producto');
  tarjetas.forEach(function (tarjeta) {
    var catTarjeta = tarjeta.getAttribute('data-categoria');
    var coincideCategoria = (catTarjeta === categoriaActual);

    // El filtro de clase solo aplica si estamos en el rubro 'relojes'
    var coincideClase = true;
    if (categoriaActual === 'relojes') {
      var claseTarjeta = tarjeta.getAttribute('data-clase') || '';
      coincideClase = (filtroClaseActual === 'todas') ||
                      (claseTarjeta === filtroClaseActual) ||
                      tarjeta.classList.contains(filtroClaseActual);
    }

    if (coincideCategoria && coincideClase) {
      tarjeta.style.display = '';
    } else {
      tarjeta.style.display = 'none';
    }
  });
}

/**
 * Cambia la categoría activa ('relojes', 'antiguedades', 'otros')
 * y actualiza los botones de pestañas principales.
 *
 * @param {string} categoria - Identificador de categoría
 */
function cambiarCategoria(categoria) {
  categoriaActual = categoria;

  var botones = document.querySelectorAll('.boton-pestana-categoria');
  botones.forEach(function (btn) {
    var esActivo = btn.id === ('pestana-' + categoria);
    btn.classList.toggle('activo', esActivo);
    btn.setAttribute('aria-selected', esActivo ? 'true' : 'false');
  });

  aplicarFiltrosYOrden();
}

/**
 * Filtra el catálogo por una clase predefinida específica
 * ('todas', 'losMios', 'losDeLaRelojeria').
 *
 * @param {string} clase - Identificador de la clase
 */
function filtrarPorClase(clase) {
  filtroClaseActual = clase;

  var botones = document.querySelectorAll('.boton-filtro-clase');
  botones.forEach(function (btn) {
    var esActivo = btn.getAttribute('data-filtro-clase') === clase;
    btn.classList.toggle('activo', esActivo);
  });

  aplicarFiltrosYOrden();
}

/**
 * Desplaza la vista suavemente al catálogo y activa la categoría y clase deseadas.
 *
 * @param {string} categoria - Categoría a mostrar
 * @param {string} [clase] - Clase a filtrar (opcional)
 */
function irACategoria(categoria, clase) {
  if (clase) {
    filtroClaseActual = clase;
    var botones = document.querySelectorAll('.boton-filtro-clase');
    botones.forEach(function (btn) {
      var esActivo = btn.getAttribute('data-filtro-clase') === clase;
      btn.classList.toggle('activo', esActivo);
    });
  }
  cambiarCategoria(categoria);
  var catalogo = document.getElementById('catalogo');
  if (catalogo) {
    catalogo.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Inicializa los eventos del menú móvil de navegación.
 */
function inicializarMenuMovil() {
  var alternadorMovil = document.getElementById('alternador-movil');
  var navPrincipal = document.getElementById('navegacion-principal');

  if (alternadorMovil && navPrincipal) {
    alternadorMovil.addEventListener('click', function (e) {
      e.stopPropagation();
      var estaAbierto = navPrincipal.classList.toggle('activo');
      navPrincipal.classList.toggle('movil-abierto', estaAbierto);
      alternadorMovil.classList.toggle('activo', estaAbierto);
    });

    navPrincipal.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        navPrincipal.classList.remove('activo');
        navPrincipal.classList.remove('movil-abierto');
        alternadorMovil.classList.remove('activo');
      });
    });

    document.addEventListener('click', function (e) {
      if (!navPrincipal.contains(e.target) && !alternadorMovil.contains(e.target)) {
        navPrincipal.classList.remove('activo');
        navPrincipal.classList.remove('movil-abierto');
        alternadorMovil.classList.remove('activo');
      }
    });
  }
}

/**
 * Inicializa el formulario de consulta rápida vía WhatsApp.
 */
function inicializarFormularioConsulta() {
  var formularioConsulta = document.getElementById('formulario-consulta');
  if (formularioConsulta) {
    formularioConsulta.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('consulta-nombre').value;
      var interes = document.getElementById('consulta-interes').value;
      var mensaje = document.getElementById('consulta-mensaje').value;
      var texto = encodeURIComponent('Hola Relojes AV, mi nombre es ' + nombre + '. Consulta sobre ' + interes + ': ' + mensaje);
      window.open('https://wa.me/59895613589?text=' + texto, '_blank');
    });
  }
}

// =============================================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =============================================================================
document.addEventListener('DOMContentLoaded', function () {
  inicializarMenuMovil();
  inicializarFormularioConsulta();
  // Mostrar rubro inicial (relojes) y aplicar orden por defecto
  cambiarCategoria('relojes');
});

