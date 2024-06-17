import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CreateProduct from './components/CreateProduct';
import axios from 'axios';
import './App.css';

const App = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('https://vfproductcatalog.azurewebsites.net:3000/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const placeOrder = (order) => {
        axios.post('https://vfproductcatalog.azurewebsites.net:3000/api/orders', order)
            .then(response => {
                alert('Order placed successfully');
                setCart([]);
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="App">
            <h1>Product Catalog</h1>
            <CreateProduct refreshProducts={fetchProducts} />
            <ProductList products={products} addToCart={addToCart} />
            <Cart cart={cart} placeOrder={placeOrder} />
        </div>
    );
};

export default App;