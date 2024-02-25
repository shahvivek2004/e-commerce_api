import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const op = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "e-commerce",
    password: "Vivek@2004",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));


const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, 'secretKey');
    console.log(decoded);
    req.user = decoded.user;
    next();
};

// Endpoint for user registration
app.post('/register', async (req, res) => {
    const {userid, username, password, email } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.query('INSERT INTO users (userid,username, password, email) VALUES ($1, $2, $3,$4)', [userid,username, hashedPassword, email]);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ user: { username, email: user.email } }, 'secretKey', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//Category Listing: API endpoint that retrieves a list of categories.
app.get('/categories', async (req, res) => {

    const result = (await db.query('select *from category')).rows;

    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: 'Categories not found' });
    }
});


//Product Listing: API endpoint that retrieves a important data on the basis of category id
app.get('/products/:categoryid', async (req, res) => {

    let given_ID = parseInt(req.params.categoryid);
    try {
        const product = (await db.query('select *from product where categoryid=$1', [given_ID])).rows;
        const result = product.map(({ title, price, description, availability }) => ({ title, price, description, availability }));

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Given category id does not exist!' });
        }
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Product Details: API endpoint that fetches the detailed information of a specific product by its ID.
app.get('/products/:productid', async (req, res) => {

    let given_ID = parseInt(req.params.productid);
    try {
        const product = (await db.query('select *from product where productid=$1', [given_ID])).rows;

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Given product id does not exist!' });
        }
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Cart Management: API endpoints to allow users to add products to their cart, view the cart, update quantities
// and remove items from the cart.

//add to cart
app.post('/cart/add', authenticateUser, async (req, res) => {

    const { cartid, userid, productid, quantity } = req.body;

    try {
        const result = await db.query('INSERT INTO Cart (cartid,userid, productid, quantity) VALUES ($1, $2, $3,$4) RETURNING *',
            [cartid, userid, productid, quantity]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error!' });
    }

});


//get cart detail of users
app.get('/cart/:userid', authenticateUser, async (req, res) => {
    const given_ID = parseInt(req.params.userid);
    console.log(given_ID);
    try {
        const result = (await db.query('select *from cart where userid=$1', [given_ID])).rows;
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Given cart id does not exist!' });
        }
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//update quantities
app.put('/cart/update', authenticateUser, async (req, res) => {

    const { userid, productid, quantity } = req.body;

    try {
        const result = await db.query(
            'update cart set quantity = $1 where userid = $2 AND productid = $3 returning*',
            [quantity, userid, productid]);

        if (result.rows) {
            res.status(404).json({ error: 'Product not found in the cart' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


//remove items
app.delete('/cart/remove', authenticateUser, async (req, res) => {
    const { userid, productid } = req.body;
    try {
        const result = await pool.query(
            'delete from cart where userid = $1 and productid = $2 returning *',
            [userid, productid]
        );

        if (result.rows) {
            res.status(404).json({ error: 'Product not found in the cart' });
        } else {
            res.json({ message: 'Product removed from the cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//place an order
app.post('/orders/place', authenticateUser, async (req, res) => {
    const { orderid, userid, productid, quantity } = req.body;
    try {
        const oid = await db.query('INSERT INTO orders (orderid,userid) values ($1,$2) returning orderid', [orderid, userid]);
        const result = await db.query('INSERT into orderitem (orderid,productid,quantity) values ($1,$2,$3)', [oid, productid, quantity]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//orders history
app.get('/orders/history', authenticateUser, async (req, res) => {

    const { userid } = req.body;

    try {
        const result = await pool.query(
            'SELECT orderid, orderdate FROM orders WHERE userid = $1',
            [userid]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//get more details from order id
app.get('/orders/details', authenticateUser, async (req, res) => {

    const { orderid } = req.body;

    try {
        const result = await db.query('SELECT c.orderid,c.userid, p.productid,p.quantity,c.orderdate FROM orders c INNER JOIN orderitem p ON c.orderid = p.orderid WHERE c.orderid = $1', [orderid]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});




