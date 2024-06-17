import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('https://vfproductcatalog.azurewebsites.net:3000/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    };

    const deleteProduct = (id) => {
        axios.delete(`https://vfproductcatalog.azurewebsites.net:3000/api/products/${id}`)
            .then(() => fetchProducts())
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - ${product.price}
                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                        <button onClick={() => deleteProduct(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;