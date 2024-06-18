import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Cart from './Cart';

test('calls placeOrder when button is clicked', () => {
    const cart = [
        { id: 1, name: 'Product 1', price: 10.00, quantity: 1 },
        { id: 2, name: 'Product 2', price: 20.00, quantity: 2 },
    ];
    const placeOrderMock = jest.fn();
    const { getByText } = render(<Cart cart={cart} placeOrder={placeOrderMock} />);

    fireEvent.click(getByText('Place Order'));

    expect(placeOrderMock).toHaveBeenCalledWith(cart);
});