const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const config = require('./config');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool(config);

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/api/products', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM products');
        const products = result.rows;
        client.release();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
    }
});

app.post('/api/orders', async (req, res) => {
    const { userInfo, items } = req.body;

    try {
        const client = await pool.connect();

        const orderInsertQuery = 'INSERT INTO orders (name, phone, address) VALUES ($1, $2, $3) RETURNING id';
        const orderValues = [userInfo.name, userInfo.phone, userInfo.address];
        const orderRes = await client.query(orderInsertQuery, orderValues);
        const orderId = orderRes.rows[0].id;

        const orderItemsInsertQuery = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)';
        for (const item of items) {
            const { id, quantity } = item;
            await client.query(orderItemsInsertQuery, [orderId, id, quantity]);
        }

        client.release();
        res.status(201).send('Order placed');
    } catch (err) {
        console.error('Error saving order:', err);
        res.status(500).send('Error saving order');
    }
});

app.post('/api/products', async (req, res) => {
    const { name, price } = req.body;

    if (isNaN(parseFloat(price))) {
        return res.status(400).send('Price has to be a number');
    }

    try {
        const client = await pool.connect();
        const insertQuery = 'INSERT INTO products (name, price, is_favorite, in_cart) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await client.query(insertQuery, [name, parseFloat(price), false, false]);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Error creating product');
    }
});


app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await pool.connect();
        await client.query('DELETE FROM products WHERE id = $1', [id]);
        client.release();
        res.status(200).send(`Product with ID ${id} deleted`);
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// test comment