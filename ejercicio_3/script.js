// Estructura de datos para categorías y productos (nombres genéricos y precios redondeados)
const productData = {
    categorias: [
        {
            id: 'electronica',
            nombre: 'Electrónica',
            productos: [
                // Usos más comunes en LATAM: 'Notebook' o 'Computadora'
                { id: 'notebook-hp', nombre: 'Notebook HP', precio: '$900', categoria: 'electronica' },
                { id: 'notebook-dell', nombre: 'Notebook Dell', precio: '$1100', categoria: 'electronica' },
                { id: 'audifonos', nombre: 'Audífonos', precio: '$90', categoria: 'electronica' },
                { id: 'smartphone', nombre: 'Celular', precio: '$500', categoria: 'electronica' }
            ]
        },
        {
            id: 'hogar',
            nombre: 'Hogar',
            productos: [
                { id: 'licuadora', nombre: 'Licuadora', precio: '$80', categoria: 'hogar' },
                { id: 'cafetera', nombre: 'Cafetera', precio: '$200', categoria: 'hogar' },
                { id: 'lampara', nombre: 'Lámpara', precio: '$60', categoria: 'hogar' },
                { id: 'microondas', nombre: 'Microondas', precio: '$150', categoria: 'hogar' }
            ]
        },
        {
            id: 'deportes',
            nombre: 'Deportes',
            productos: [
                { id: 'bicicleta', nombre: 'Bicicleta', precio: '$400', categoria: 'deportes' },
                { id: 'balon', nombre: 'Pelota', precio: '$30', categoria: 'deportes' },
                { id: 'pesas', nombre: 'Pesas', precio: '$150', categoria: 'deportes' },
                { id: 'esterilla', nombre: 'Esterilla', precio: '$40', categoria: 'deportes' }
            ]
        }
    ]
};

// Elementos del DOM
const categoriaSelect = document.getElementById('categoriaSelect');
const productoSelect = document.getElementById('productoSelect');
// Note: `selectedProduct` UI elements were removed from the HTML per request

// Campos de dirección
const calleInput = document.getElementById('calle');
const numeroInput = document.getElementById('numero');
const ciudadInput = document.getElementById('ciudad');
const codigoPostalInput = document.getElementById('codigoPostal');

// Elementos de error
const errorCalle = document.getElementById('error-calle');
const errorNumero = document.getElementById('error-numero');
const errorCiudad = document.getElementById('error-ciudad');
const errorCodigoPostal = document.getElementById('error-codigoPostal');

const btnConfirmar = document.getElementById('btnConfirmar');
const btnAgregar = document.getElementById('btnAgregar');
const cartSection = document.getElementById('cartSection');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
// status and helper elements were removed from the HTML per request

// Estado de la aplicación
let selectedProduct = null;
let validationState = {
    productoSeleccionado: false,
    direccionSeleccionada: false
};

// Carrito
let cart = [];

function formatPrice(priceStr) {
    // priceStr like '$30' or '$900' -> numeric
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
}

function addToCart() {
    if (!selectedProduct) return;
    cart.push({ ...selectedProduct });
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    // Mostrar u ocultar sección
    if (cart.length === 0) {
        cartSection.style.display = 'none';
    } else {
        cartSection.style.display = 'block';
    }

    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '8px';
        row.style.background = 'rgba(255,255,255,0.02)';
        row.style.borderRadius = '6px';

        const left = document.createElement('div');
        left.textContent = `${item.nombre} - ${item.precio}`;

        const right = document.createElement('div');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Eliminar';
        removeBtn.className = 'btn-confirmar';
        removeBtn.style.padding = '6px 8px';
        removeBtn.style.fontSize = '0.85rem';
        removeBtn.addEventListener('click', () => removeFromCart(idx));

        right.appendChild(removeBtn);

        row.appendChild(left);
        row.appendChild(right);

        cartList.appendChild(row);

        total += formatPrice(item.precio);
    });

    cartTotal.textContent = `Total: $${Math.round(total)}`;

    // Actualizar validación: el botón Confirmar requiere al menos 1 producto en carrito
    actualizarValidacion();
}

/**
 * Inicializa el dropdown de categorías
 */
function initCategorias() {
    productData.categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        categoriaSelect.appendChild(option);
    });
}

/**
 * Maneja el cambio de categoría
 */
function onCategoriaChange() {
    const categoriaId = categoriaSelect.value;
    
    // Limpiar el select de productos
    productoSelect.innerHTML = '<option value="">-- Selecciona un producto --</option>';
    productoSelect.disabled = false;
    
    // Limpiar selección anterior
    selectedProduct = null;
    validationState.productoSeleccionado = false;
    
    if (categoriaId) {
        // Encontrar la categoría seleccionada
        const categoria = productData.categorias.find(cat => cat.id === categoriaId);
        
        // Cargar los productos de la categoría
        categoria.productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = `${producto.nombre} - ${producto.precio}`;
            productoSelect.appendChild(option);
        });
    } else {
        productoSelect.disabled = true;
        productoSelect.innerHTML = '<option value="">-- Primero selecciona una categoría --</option>';
    }
    
    actualizarValidacion();
}

/**
 * Maneja el cambio de producto
 */
function onProductoChange() {
    const productoId = productoSelect.value;
    
    if (productoId) {
        // Buscar el producto en todas las categorías
        let productoEncontrado = null;
        for (const categoria of productData.categorias) {
            productoEncontrado = categoria.productos.find(prod => prod.id === productoId);
            if (productoEncontrado) break;
        }
        
        if (productoEncontrado) {
            selectedProduct = productoEncontrado;
            validationState.productoSeleccionado = true;
            // Habilitar botón Agregar
            if (btnAgregar) btnAgregar.disabled = false;
        }
    } else {
        selectedProduct = null;
        validationState.productoSeleccionado = false;
        if (btnAgregar) btnAgregar.disabled = true;
    }
    
    actualizarValidacion();
}

/**
 * Valida un campo de dirección
 */
function validarCampo(input, errorElement, minLength, pattern = null, errorMsg = '') {
    const value = input.value.trim();
    let isValid = true;
    let mensaje = '';
    
    if (value.length === 0) {
        isValid = false;
        mensaje = 'Este campo es requerido';
    } else if (value.length < minLength) {
        isValid = false;
        mensaje = `Debe tener al menos ${minLength} caracteres`;
    } else if (pattern && !pattern.test(value)) {
        isValid = false;
        mensaje = errorMsg;
    }
    
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorElement.textContent = '';
    } else {
        input.classList.remove('valid');
        input.classList.add('error');
        errorElement.textContent = mensaje;
    }
    
    return isValid;
}

/**
 * Valida todos los campos de dirección
 */
function validarDireccion() {
    const calleValida = validarCampo(calleInput, errorCalle, 3);
    const numeroValido = validarCampo(numeroInput, errorNumero, 1, /^[0-9]+[a-zA-Z]?$/, 'Debe ser un número válido');
    const ciudadValida = validarCampo(ciudadInput, errorCiudad, 3);
    const codigoPostalValido = validarCampo(codigoPostalInput, errorCodigoPostal, 3, /^[0-9]{3,10}$/, 'Debe contener solo números (3-10 dígitos)');
    
    validationState.direccionSeleccionada = calleValida && numeroValido && ciudadValida && codigoPostalValido;
    actualizarValidacion();
}

/**
 * Actualiza el estado visual de validación
 */
function actualizarValidacion() {
    // Habilitar o deshabilitar el botón según la regla de negocio
    // Ahora el requerimiento para confirmar es: al menos 1 producto en carrito + dirección válida
    const tieneProductoEnCarrito = cart.length > 0;
    const todasLasValidacionesPasadas = tieneProductoEnCarrito && validationState.direccionSeleccionada;
    btnConfirmar.disabled = !todasLasValidacionesPasadas;
}

/**
 * Confirma el pedido
 */
function confirmarPedido() {
    // Al confirmar, ya no mostramos ventana emergente. Limpiamos el formulario y deseleccionamos producto.
    if (!btnConfirmar.disabled && cart.length > 0) {
        // Limpiar campos
        categoriaSelect.value = '';
        productoSelect.innerHTML = '<option value="">-- Primero selecciona una categoría --</option>';
        productoSelect.disabled = true;

    calleInput.value = '';
    numeroInput.value = '';
    ciudadInput.value = '';
    codigoPostalInput.value = '';

        // Resetear estado
        selectedProduct = null;
        validationState.productoSeleccionado = false;
        validationState.direccionSeleccionada = false;
        btnConfirmar.disabled = true;
        cart = [];
        renderCart();
        if (btnAgregar) btnAgregar.disabled = true;
    }
}

// Event Listeners
categoriaSelect.addEventListener('change', onCategoriaChange);
productoSelect.addEventListener('change', onProductoChange);

// Validación en tiempo real de los campos de dirección
calleInput.addEventListener('input', validarDireccion);
numeroInput.addEventListener('input', validarDireccion);
ciudadInput.addEventListener('input', validarDireccion);
codigoPostalInput.addEventListener('input', validarDireccion);

btnConfirmar.addEventListener('click', confirmarPedido);
if (btnAgregar) btnAgregar.addEventListener('click', addToCart);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initCategorias();
    actualizarValidacion();
});
