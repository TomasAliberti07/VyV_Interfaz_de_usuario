// Estructura de datos para categorías, subcategorías y productos
const productData = {
    categorias: [
        {
            id: 'electronica',
            nombre: 'Electrónica',
            subcategorias: [
                {
                    id: 'computadoras',
                    nombre: 'Computadoras',
                    productos: [
                        { id: 'laptop-hp', nombre: 'Laptop HP Pavilion', precio: '$899.99' },
                        { id: 'laptop-dell', nombre: 'Laptop Dell Inspiron', precio: '$1099.99' },
                        { id: 'laptop-lenovo', nombre: 'Laptop Lenovo ThinkPad', precio: '$1299.99' }
                    ]
                },
                {
                    id: 'accesorios',
                    nombre: 'Accesorios',
                    productos: [
                        { id: 'mouse-logitech', nombre: 'Mouse Logitech MX Master', precio: '$89.99' },
                        { id: 'teclado-mecanico', nombre: 'Teclado Mecánico RGB', precio: '$129.99' },
                        { id: 'webcam-hd', nombre: 'Webcam HD 1080p', precio: '$69.99' }
                    ]
                }
            ]
        },
        {
            id: 'hogar',
            nombre: 'Hogar',
            subcategorias: [
                {
                    id: 'cocina',
                    nombre: 'Cocina',
                    productos: [
                        { id: 'licuadora', nombre: 'Licuadora Oster', precio: '$79.99' },
                        { id: 'cafetera', nombre: 'Cafetera Espresso', precio: '$199.99' },
                        { id: 'microondas', nombre: 'Microondas Samsung', precio: '$149.99' }
                    ]
                },
                {
                    id: 'decoracion',
                    nombre: 'Decoración',
                    productos: [
                        { id: 'lampara-mesa', nombre: 'Lámpara de Mesa LED', precio: '$39.99' },
                        { id: 'espejo-pared', nombre: 'Espejo de Pared Grande', precio: '$89.99' },
                        { id: 'cuadro-abstracto', nombre: 'Cuadro Abstracto', precio: '$59.99' }
                    ]
                }
            ]
        }
    ]
};

// Elementos del DOM
const breadcrumb = document.getElementById('breadcrumb');
const navigationArea = document.getElementById('navigationArea');
const selectedProductDiv = document.getElementById('selectedProduct');
const productNameElement = document.getElementById('productName');
const btnChangeProduct = document.getElementById('btnChangeProduct');
const addressRadios = document.querySelectorAll('.address-radio');
const btnConfirmar = document.getElementById('btnConfirmar');
const statusProducto = document.getElementById('status-producto');
const statusDireccion = document.getElementById('status-direccion');
const helperText = document.getElementById('helperText');

// Estado de la aplicación
let currentPath = [];
let selectedProduct = null;
let validationState = {
    productoSeleccionado: false,
    direccionSeleccionada: false
};

/**
 * Renderiza el breadcrumb según la ruta actual
 */
function renderBreadcrumb() {
    breadcrumb.innerHTML = '<span class="breadcrumb-item" data-level="0">Inicio</span>';
    
    currentPath.forEach((item, index) => {
        const span = document.createElement('span');
        span.className = 'breadcrumb-item';
        span.textContent = item.nombre;
        span.dataset.level = index + 1;
        breadcrumb.appendChild(span);
    });
    
    // Marcar el último como activo
    const items = breadcrumb.querySelectorAll('.breadcrumb-item');
    items[items.length - 1].classList.add('active');
    
    // Añadir event listeners para navegación
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            navigateToLevel(index);
        });
    });
}

/**
 * Navega a un nivel específico del breadcrumb
 */
function navigateToLevel(level) {
    currentPath = currentPath.slice(0, level);
    renderNavigation();
    renderBreadcrumb();
}

/**
 * Renderiza el área de navegación según el nivel actual
 */
function renderNavigation() {
    navigationArea.innerHTML = '';
    
    if (currentPath.length === 0) {
        // Mostrar categorías
        productData.categorias.forEach(categoria => {
            const card = createNavCard(categoria.nombre, 'Explorar categoría');
            card.addEventListener('click', () => {
                currentPath.push({ tipo: 'categoria', nombre: categoria.nombre, data: categoria });
                renderNavigation();
                renderBreadcrumb();
            });
            navigationArea.appendChild(card);
        });
    } else if (currentPath.length === 1) {
        // Mostrar subcategorías
        const categoria = currentPath[0].data;
        categoria.subcategorias.forEach(subcategoria => {
            const card = createNavCard(subcategoria.nombre, 'Ver productos');
            card.addEventListener('click', () => {
                currentPath.push({ tipo: 'subcategoria', nombre: subcategoria.nombre, data: subcategoria });
                renderNavigation();
                renderBreadcrumb();
            });
            navigationArea.appendChild(card);
        });
    } else if (currentPath.length === 2) {
        // Mostrar productos
        const subcategoria = currentPath[1].data;
        subcategoria.productos.forEach(producto => {
            const card = createNavCard(producto.nombre, producto.precio);
            card.classList.add('product');
            card.addEventListener('click', () => {
                selectProduct(producto);
            });
            navigationArea.appendChild(card);
        });
    }
}

/**
 * Crea una card de navegación
 */
function createNavCard(title, subtitle) {
    const card = document.createElement('div');
    card.className = 'nav-card';
    card.innerHTML = `
        <h3>${title}</h3>
        <p>${subtitle}</p>
    `;
    return card;
}

/**
 * Selecciona un producto
 */
function selectProduct(producto) {
    selectedProduct = producto;
    validationState.productoSeleccionado = true;
    
    // Ocultar navegación y mostrar producto seleccionado
    navigationArea.style.display = 'none';
    breadcrumb.style.display = 'none';
    selectedProductDiv.style.display = 'block';
    
    productNameElement.textContent = `${producto.nombre} - ${producto.precio}`;
    
    actualizarValidacion();
}

/**
 * Permite cambiar el producto seleccionado
 */
function changeProduct() {
    selectedProduct = null;
    validationState.productoSeleccionado = false;
    
    // Mostrar navegación y ocultar producto seleccionado
    navigationArea.style.display = 'grid';
    breadcrumb.style.display = 'flex';
    selectedProductDiv.style.display = 'none';
    
    // Volver al inicio
    currentPath = [];
    renderNavigation();
    renderBreadcrumb();
    
    actualizarValidacion();
}

/**
 * Valida si una dirección está seleccionada
 */
function validarDireccion() {
    const direccionSeleccionada = Array.from(addressRadios).some(radio => radio.checked);
    validationState.direccionSeleccionada = direccionSeleccionada;
    actualizarValidacion();
}

/**
 * Actualiza el estado visual de validación
 */
function actualizarValidacion() {
    // Estado del producto
    if (validationState.productoSeleccionado) {
        statusProducto.classList.add('valid');
        statusProducto.querySelector('.status-text').textContent = 'Producto seleccionado';
    } else {
        statusProducto.classList.remove('valid');
        statusProducto.querySelector('.status-text').textContent = 'Producto no seleccionado';
    }
    
    // Estado de la dirección
    if (validationState.direccionSeleccionada) {
        statusDireccion.classList.add('valid');
        statusDireccion.querySelector('.status-text').textContent = 'Dirección seleccionada';
    } else {
        statusDireccion.classList.remove('valid');
        statusDireccion.querySelector('.status-text').textContent = 'Dirección no seleccionada';
    }
    
    // Estado del botón (REGLA DE NEGOCIO)
    const todasLasValidacionesPasadas = validationState.productoSeleccionado && validationState.direccionSeleccionada;
    
    if (todasLasValidacionesPasadas) {
        btnConfirmar.disabled = false;
        helperText.textContent = '¡Listo! Puedes confirmar tu pedido';
        helperText.classList.add('success');
    } else {
        btnConfirmar.disabled = true;
        helperText.textContent = 'Completa ambos requisitos para habilitar el botón';
        helperText.classList.remove('success');
    }
}

/**
 * Confirma el pedido
 */
function confirmarPedido() {
    if (!btnConfirmar.disabled && selectedProduct) {
        const direccionSeleccionada = Array.from(addressRadios).find(radio => radio.checked);
        const direccionTexto = direccionSeleccionada.parentElement.querySelector('h3').textContent;
        
        alert(`✓ Pedido Confirmado\n\nProducto: ${selectedProduct.nombre}\nPrecio: ${selectedProduct.precio}\nDirección: ${direccionTexto}\n\n¡Gracias por tu compra!`);
    }
}

// Event Listeners
btnChangeProduct.addEventListener('click', changeProduct);
addressRadios.forEach(radio => {
    radio.addEventListener('change', validarDireccion);
});
btnConfirmar.addEventListener('click', confirmarPedido);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderNavigation();
    renderBreadcrumb();
    actualizarValidacion();
});
