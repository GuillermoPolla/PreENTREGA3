// Esperar a que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // Agregar eventos de clic a los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            fetch(`/api/carts/add/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Producto agregado al carrito');
                } else {
                    alert('Error al agregar el producto al carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });

    // Agregar evento de clic al botón de finalizar compra
    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            const response = await fetch('/api/carts/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                alert('Compra finalizada con éxito');
                window.location.href = '/api/products';
            } else {
                alert('Error al finalizar la compra: ' + result.error);
            }
        });
    }
});
