import React from 'react';
import { render } from '@testing-library/react';
import ProductList from './components/ProductList';

test('renders product list', () => {
    const products = [
        { id: 1, name: 'Test Product 1', price: 10.00 },
        { id: 2, name: 'Test Product 2', price: 20.00 },
    ];

    const { getByText } = render(<ProductList products={products} addToCart={() => { }} />);

    expect(getByText('Test Product 1')).toBeInTheDocument();
    expect(getByText('Test Product 2')).toBeInTheDocument();
});