export const calculateCartTotals = (cartItems, quantities = {}) => {
    const subtotal = cartItems.reduce((acc, food) => {
        const qty = quantities[food.id] || 0;
        return acc + food.price * qty;
    }, 0);

    const shipping = subtotal === 0 ? 0.0 : 10;
    const tax = subtotal * 0.1; // 10%
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
};
