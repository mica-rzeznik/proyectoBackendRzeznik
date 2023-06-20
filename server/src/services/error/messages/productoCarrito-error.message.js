export const addProductErrorInfo = (productId, cartId) => {
    return `Hubo un problema con el carrito o con el producto.
        * producto seleccionado: ${productId}
        * carrito al cual enviar: ${cartId}
    `
}