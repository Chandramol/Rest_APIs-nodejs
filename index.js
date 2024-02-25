// server
const express = require("express");
const app = express();
const port = 3000;

// Middelware -plugins
// For the frontend(web) hitting apis of post and patch
app.use(express.json());
// For the postman hitting of api of post and patch
app.use(express.urlencoded({ extended: false }));

const cors = require("cors"); // Import the cors middleware
app.use(cors());

// importing connection pool functions from database
const { getUsers, createUser, deleteUser, editUser } = require("./app");

// get request
app.get("/users", async (req, res) => {
  res.json(await getUsers());
});

// post request
app.post("/users", async (req, res) => {
  try {
    const body = req.body;
    console.log("body", body);
    await createUser(body); // to insert the data into the database
    res.json({ message: "Success", data: body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// delete req
app.delete("/users/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    console.log(req.params, "req.body delete");
    await deleteUser(id);
    res.json({ message: "Success to delete", data: id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// edit req
app.patch("/users/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    let body = req.body;
    console.log(req.params, body, "req.body edit");
    await editUser(id, body);
    res.json({ message: "Success to edit", data: { id: id, data: body } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to edit user" });
  }
});

// server listing
app.listen(port, () => {
  console.log("Server is Started...");
});