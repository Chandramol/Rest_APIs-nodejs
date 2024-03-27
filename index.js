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
const { getUsers, createUser, deleteUser, editUser, createNewMember, getMember, editExistMember, getPackageList, addNewPackage, getUserLogin, createLoginUser } = require("./app");


// login request
// get
app.get("/login", async (req, res) => {
  res.json(await getUserLogin());
})

// post
app.post("/login", async (req, res) => {
  try {
    const body = req.body;
    console.log("body", body);
    await createLoginUser(body);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to login user" });
  }
})

// inquiry related api
// get request
app.get("/users", async (req, res) => {
  res.json(await getUsers());
});

// post request
app.post("/users", async (req, res) => {
  try {
    console.log(req, 'res');
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

// memeber realated funtions
// get all members
app.get("/addnewmember", async (req, res) => {
  res.json(await getMember());
});

// add new member
app.post("/addnewmember", async (req, res) => {
  try {
    const body = req.body;
    console.log("body", body);
    await createNewMember(body); // to insert the data into the database
    res.json({ message: "Success", data: body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to create new member" });
  }
});

// edit exist member
app.patch("/addnewmember/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    let body = req.body;
    console.log(req.params, body, "req.body edit");
    await editExistMember(id, body);
    res.json({ message: "Success to edit", data: { id: id, data: body } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to edit user" });
  }
});

// package list related apis
// get package list
app.get("/packages", async (req, res) => {
  try {
    res.json(await getPackageList());
  } catch (error) {
    console.error("Error:", error);
  }
})

// create new package
app.post("/packages", async (req, res) => {
  try {
    const body = req.body;
    console.log("body", body);
    await addNewPackage(body);
    res.json({ message: "Success", data: body });
  } catch (error) {
    console.error("Error:", error);
  }
})

// server listing
app.listen(port, () => {
  console.log("Server is Started...", port);
});
