const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('database.db'); // Use ':memory:' for an in-memory database or 'database.db' for a file-based database

// Create a table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    name TEXT NOT NULL
  )`);
    db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price TEXT NOT NULL,
    category TEXT NOT NULL
  )`);
    db.run(`CREATE TABLE IF NOT EXISTS user_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER default 0
  )`);
});

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Express server with SQLite!');
});

// Register a new user
app.post('/users/register', (req, res) => {
    const { username, password, email, name, role } = req.body;
    const stmt = db.prepare('INSERT INTO users (username, password,name,role, email) VALUES (?, ?,?,?,?)');
    stmt.run(username, password, name, role, email, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
    stmt.finalize();
});

// Get all users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});


// login using email and password
app.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    //console.log(email," ", password);
    db.get('SELECT * FROM users WHERE email = ? AND password= ? ', [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(row);
        res.json(row);
    });
});

app.post('/items/getbyuserid', (req, res) => {

    const { userid } = body.params;
    const stmt = db.prepare('select * from items inner join user_items on items.id = user_items.item_id where user_items.user_id = ?');
    stmt.run(userid, function (err, rows) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(rows);
    });
    stmt.finalize();

});
app.put('/items/update', (req, res) => {
    const { id,name,description,price,category,image} = req.body;
    const stmt = db.prepare('update items set name=?, description=?, price =?, category=? where id = ?');
    stmt.run(name, description, price,category, id, function (err, rows) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
    stmt.finalize();
});
app.delete('/items/delete/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('delete from items where id = ?');
    stmt.run(id, function (err, rows) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
    stmt.finalize();
});
app.get('/items/ordered', (req, res) => {
    const stmt = db.all('select user_items.id, concat(\'Order \',user_items.item_id) as name  from items inner join user_items on items.id = user_items.item_id where user_items.status = \'ordered\'',
        function (err, rows) {

        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });

});

app.post('/items/deliver', (req, res) => {
    const { id } = req.body;
    console.log(id);
    const stmt = db.prepare('update user_items set status = \'delivered\' where id = ?');
    stmt.run(id, function (err, rows) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
    stmt.finalize();

});
// fetch all goods and services provided 
app.get('/items/all', (req, res) => {

    db.all('select * from items', function (err, rows) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });

});

//checkout operations by user

app.post('/checkout', async (req, res) => {

    const { userId, positions } = req.body;
    for (let i = 0; i < positions.length; i++) {
        const stmt = db.prepare('insert into user_items (user_id,item_id, quantity, status) values (?,?,?,?)');

        await stmt.run(userId, positions[i].id, positions[i].quantity, 'ordered', function (err, rows) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            //res.status(201).json(rows);
        });

        stmt.finalize();
    }
    res.status(201).json({ status: 'success' });
}
);



// Update a user by ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password,name,email,role } = req.body;
    const stmt = db.prepare('UPDATE users SET username = ?, password = ?, name=?, email=? , role=? WHERE id = ?');
    stmt.run(username, password,name,email,role,id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
    stmt.finalize();
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
    stmt.finalize();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});