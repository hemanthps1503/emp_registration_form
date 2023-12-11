const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'hemanth',
  password: 'hemanth@2003',
  database: 'emp_registration_form',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

app.post('/register', async (req, res) => {
  const { fullName, email, phone, position } = req.body;

  const sql =
    'INSERT INTO registered_users (fullName, email, phone, position) VALUES (?, ?, ?, ?)';
  const values = [fullName, email, phone, position];

  try {
    const userExists = await query(
      'SELECT * FROM registered_users WHERE email = ?',
      [email]
    );
    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ error: 'User with the provided email already exists.' });
    }

    await query(sql, values);

    console.log('User registered successfully');
    return res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);

    return res
      .status(500)
      .json({ error: 'Failed to register user. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
