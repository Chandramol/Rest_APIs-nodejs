// Database
const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "gerContactDb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Wrap pool.getConnection in a promise
function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject("Error connecting to MySQL:", err);
      } else {
        console.log("Connected to MySQL!");
        resolve(connection);
      }
    });
  });
}

//  getUsers
function getUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const sql = "SELECT * FROM user_details";
      connection.query(sql, (err, results) => {
        connection.release(); // Make sure to release the connection
        if (err) {
          reject("Error executing query:", err);
        } else {
          console.log("Query results:", results);
          resolve(results);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
// create new user
function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const id = Math.floor(Math.random() * 10000);
      const sql =
        "INSERT INTO user_details (id,name, email, phone,address) VALUES (?,?, ?, ?,?)";
      connection.query(
        sql,
        [
          id,
          userData.name,
          userData.email,
          userData.phone,
          userData.address,
        ],
        (err, results) => {
          connection.release();
          if (err) {
            reject("Error executing insert query:", err);
          } else {
            console.log("Insert results:", results);
            resolve(results);
          }
        }
        
      );
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { getUsers, createUser };
