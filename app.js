// Database
const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "getinquireirsdb",
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
      const sql = "SELECT * FROM inquiry_details";
      connection.query(sql, (err, results) => {
        connection.release();
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
        "INSERT INTO inquiry_details (id,name, email, phone,address) VALUES (?, ?, ?, ?,?)";
      connection.query(
        sql,
        [id, userData.name, userData.email, userData.phone, userData.address],
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

// delete user
function deleteUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const sql = `DELETE FROM inquiry_details WHERE id = ${id}`;

      connection.query(sql, (error, results) => {
        if (error) {
          reject("Error deleting query", error);
        } else {
          resolve("delete results", results);
        }
        connection.release();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// edit user
function editUser(id, data) {
  console.log(id, data, "edit");
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const sql = "UPDATE inquiry_details SET ? WHERE id = ?";

      connection.query(
        sql,
        [
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          },
          id,
        ],
        (error, results) => {
          if (error) {
            reject("Error editing query", error);
          } else {
            resolve("edited results", results);
          }
          connection.release();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

// add new members
// get all member
function getMember() {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const sql = "SELECT * FROM add_new_member";
      connection.query(sql, (err, results) => {
        connection.release();
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

// create new member
function createNewMember(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const id = Math.floor(Math.random() * 10000);
      console.log(id,'id')
      const sql =
        "INSERT INTO add_new_member (id,first_name,last_name,mobile,home_mobile, email,address,birth_date,joining_date,ending_date,package,amount,adhar,remark) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(
        sql,
        [
          id,
          userData.first_name,
          userData.last_name,
          userData.mobile,
          userData.home_mobile,
          userData.email,
          userData.address,
          userData.birth_date,
          userData.joining_date,
          userData.ending_date,
          userData.package,
          userData.amount,
          userData.adhar,
          userData.remark,
        ],
        (err, results) => {
          connection.release();
          if (err) {
            console.error("Error executing insert query:", err);
            reject("Error executing insert query:", err);
          } else {
            console.log("Insert results:", results);
            resolve(results);
          }
        }
      );
    } catch (error) {
      console.error("Error in createNewMember:", error);
      reject(error);
    }
  });
}

// edit member
function editExistMember(id, data) {
  console.log(id, data, "edit");
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const sql = "UPDATE add_new_member SET ? WHERE id = ?";

      connection.query(
        sql,
        [
          {
            first_name: data.first_name,
            last_name: data.last_name,
            mobile: data.mobile,
            home_mobile: data.home_mobile,
            email: data.email,
            address: data.address,
            birth_date: data.birth_date,
            joining_date: data.joining_date,
            ending_date: data.ending_date,
            package: data.package,
            amount: data.amount,
            adhar: data.adhar,
            remark: data.remark,
          },
          id,
        ],
        (error, results) => {
          if (error) {
            reject("Error editing query", error);
          } else {
            resolve("edited results", results);
          }
          connection.release();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  editUser,
  createNewMember,
  getMember,
  editExistMember
};
