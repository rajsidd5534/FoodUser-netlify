export const calculateCartTotals = (cartItems , quantites) => {
    const subtotal = cartItems.reduce((acc, food) => acc + food.price * quantites[food.id], 0);
    const shipping = subtotal === 0 ? 0.0 : 10;
    const tax = subtotal * 0.1 ; // 10%
    const total = subtotal + shipping + tax;
    return { subtotal , shipping , tax , total};
}