import React, { useState } from 'react';
import axios from 'axios';

const CreateProduct = ({ refreshProducts }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isNaN(parseFloat(price))) {
            setError('Price has to be a number');
            return;
        }

        const newProduct = {
            name,
            price: parseFloat(price),
            is_favorite: false,
            in_cart: false
        };

        axios.post('https://vfproductcatalog.azurewebsites.net/api/products', newProduct)
            .then(() => {
                refreshProducts();
                setName('');
                setPrice('');
                setError('');
            })
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Price:</label>
                <input
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Create Product</button>
        </form>
    );
};

export default CreateProduct;