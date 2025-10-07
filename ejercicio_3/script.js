// Elementos del DOM
const productCheckboxes = document.querySelectorAll('.product-checkbox');
const addressRadios = document.querySelectorAll('.address-radio');
const btnConfirmar = document.getElementById('btnConfirmar');
const statusProducto = document.getElementById('status-producto');
const statusDireccion = document.getElementById('status-direccion');
const helperText = document.getElementById('helperText');

// Estado de validación
let validationState = {
    productoSeleccionado: false,
    direccionSeleccionada: false
};

/**
 * Valida si al menos un producto está seleccionado
 */
function validarProductos() {
    const algunProductoSeleccionado = Array.from(productCheckboxes).some(checkbox => checkbox.checked);
    validationState.productoSeleccionado = algunProductoSeleccionado;
    
    // Actualizar UI del estado de producto
    if (algunProductoSeleccionado) {
        statusProducto.classList.add('valid');
        statusProducto.querySelector('.status-icon').textContent = '✅';
        statusProducto.querySelector('.status-text').textContent = 'Producto seleccionado';
    } else {
        statusProducto.classList.remove('valid');
        statusProducto.querySelector('.status-icon').textContent = '❌';
        statusProducto.querySelector('.status-text').textContent = 'Producto no seleccionado';
    }
    
    actualizarBoton();
}

/**
 * Valida si una dirección está seleccionada
 */
function validarDireccion() {
    const direccionSeleccionada = Array.from(addressRadios).some(radio => radio.checked);
    validationState.direccionSeleccionada = direccionSeleccionada;
    
    // Actualizar UI del estado de dirección
    if (direccionSeleccionada) {
        statusDireccion.classList.add('valid');
        statusDireccion.querySelector('.status-icon').textContent = '✅';
        statusDireccion.querySelector('.status-text').textContent = 'Dirección seleccionada';
    } else {
        statusDireccion.classList.remove('valid');
        statusDireccion.querySelector('.status-icon').textContent = '❌';
        statusDireccion.querySelector('.status-text').textContent = 'Dirección no seleccionada';
    }
    
    actualizarBoton();
}

/**
 * Actualiza el estado del botón basado en las reglas de negocio
 * REGLA: El botón solo se habilita si hay al menos un producto Y una dirección seleccionados
 */
function actualizarBoton() {
    const todasLasValidacionesPasadas = validationState.productoSeleccionado && validationState.direccionSeleccionada;
    
    if (todasLasValidacionesPasadas) {
        // Habilitar botón
        btnConfirmar.disabled = false;
        btnConfirmar.querySelector('.btn-icon').textContent = '🔓';
        btnConfirmar.querySelector('.btn-text').textContent = 'Confirmar Pedido';
        helperText.textContent = '¡Listo! Puedes confirmar tu pedido';
        helperText.classList.add('success');
    } else {
        // Deshabilitar botón
        btnConfirmar.disabled = true;
        btnConfirmar.querySelector('.btn-icon').textContent = '🔒';
        btnConfirmar.querySelector('.btn-text').textContent = 'Confirmar Pedido';
        helperText.textContent = 'Completa ambos requisitos para habilitar el botón';
        helperText.classList.remove('success');
    }
}

/**
 * Maneja el clic en el botón de confirmar
 */
function confirmarPedido() {
    if (!btnConfirmar.disabled) {
        // Obtener productos seleccionados
        const productosSeleccionados = Array.from(productCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // Obtener dirección seleccionada
        const direccionSeleccionada = Array.from(addressRadios)
            .find(radio => radio.checked)?.value;
        
        // Mostrar confirmación
        const mensaje = `
🎉 ¡Pedido Confirmado!

📦 Productos: ${productosSeleccionados.join(', ')}
📍 Dirección: ${direccionSeleccionada}

Gracias por tu compra.
        `;
        
        alert(mensaje);
        
        // Opcional: Resetear formulario
        // resetearFormulario();
    }
}

/**
 * Resetea el formulario a su estado inicial
 */
function resetearFormulario() {
    productCheckboxes.forEach(cb => cb.checked = false);
    addressRadios.forEach(radio => radio.checked = false);
    validarProductos();
    validarDireccion();
}

// Event Listeners
productCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', validarProductos);
});

addressRadios.forEach(radio => {
    radio.addEventListener('change', validarDireccion);
});

btnConfirmar.addEventListener('click', confirmarPedido);

// Inicializar validación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    validarProductos();
    validarDireccion();
});
