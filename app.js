// Database
const mysql = require("mysql2");
// bycrypt for password
const bcrypt = require('bcrypt');


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

// login related apis
function getUserLogin() {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection()
      const sql = "SELECT * FROM login_details";
      connection.query(sql, (err, results) => {
        if (err) {
          reject("Error executing query:", err);
        }
        else {
          // console.log("Query results:", results);
          resolve(results);
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

// post login- register
function createLoginUser(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const user_id = Math.floor(Math.random() * 10000);
      const sql =
        "INSERT INTO login_details (user_id, email, password, superUser) VALUES (?, ?, ?, ?)";
      connection.query(
        sql,
        [user_id, data.email, data.password, data.superUser],
        (err, results) => {
          connection.release();
          if (err) {
            console.log(err);
            reject("Error executing insert query:", err);
          } else {
            resolve(results);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function loginAuth(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection();
      const sql = "SELECT * FROM login_details WHERE email = ?";
      connection.query(sql, [data.email], async (err, results) => {
        connection.release();
        if (err) {
          reject("Error executing query:", err);
        } else {
          if (results.length > 0) {
            // const isPasswordCorrect = await bcrypt.compare(data.password, results[0].password);
            // console.log(data.password,"===",results[0].password);
            if (data.password === results[0].password) {
              // if (isPasswordCorrect) {
              resolve({ success: true, user: results[0] });
            } else {
              resolve({ success: false, message: "Incorrect email or password" });
            }
          } else {
            resolve({ success: false, message: "Enter email or password" });
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

// inquiry persons
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
        "INSERT INTO inquiry_details (id,name, email, phone,address,isReference) VALUES (?, ?, ?, ?,?,?)";
      connection.query(
        sql,
        [id, userData.name, userData.email, userData.phone, userData.address, userData.isReference],
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
      const sql =
        "INSERT INTO add_new_member (id,first_name,last_name,mobile,home_mobile, email,address,birth_date,joining_date,ending_date,package,adhar,remark,total_payment,paid_amt,pending_amt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
          userData.adhar,
          userData.remark,
          userData.total_payment,
          userData.paid_amt,
          userData.pending_amt,
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
            adhar: data.adhar,
            address: data.address,
            birth_date: data.birth_date,
            joining_date: data.joining_date,
            ending_date: data.ending_date,
            package: data.package,
            remark: data.remark,
            total_payment: data.total_payment,
            paid_amt: data.paid_amt,
            pending_amt: data.pending_amt,
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

// package list
// get packages
function getPackageList() {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection()
      const sql = "SELECT * FROM package_list";
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
  })
}

function addNewPackage(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection()
      const id = Math.floor(Math.random() * 10000);
      const sql = "INSERT INTO package_list (id, package_type, package_duration, package_price) VALUES (?,?,?,?)"
      connection.query(
        sql,
        [id, data.package_type, data.package_duration, data.package_price],
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
  })
}

function generateQuery(query) {
  // console.log(query,'query');
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await getConnection()
      const id = Math.floor(Math.random() * 10000);
      console.log(query,'query 1');
      const sql = "INSERT INTO query_form (id,name,mobile,message) VALUES (?,?,?,?)";
      connection.query(sql, [id, query.name, query.mobile, query.message], (err, results) => {
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
  })
}

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  editUser,
  createNewMember,
  getMember,
  editExistMember,
  getPackageList,
  addNewPackage,
  getUserLogin,
  createLoginUser,
  loginAuth,
  generateQuery
};
