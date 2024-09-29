require('dotenv').config();
const mysql = require('mysql2');

// Create a connection to the MySQL server
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port:process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }

  console.log('Connected to MySQL.');

  // Check if the database name is defined in the environment variables
  const databaseName = process.env.DATABASE_NAME;
  if (!databaseName) {
    console.error('DATABASE_NAME environment variable is not defined.');
    connection.end();
    return;
  }

  // Create or check if the database exists
  connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``, (err, result) => {
    if (err) {
      console.error('Error creating database:', err.stack);
    } else {
      console.log(`Database '${databaseName}' created or already exists.`);
    }
    connection.end();
  });
});
