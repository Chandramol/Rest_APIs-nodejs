// server
const express = require("express");
const app = express();
const port = 3000;

// Middelware -plugins
app.use(express.json()); // for the frontend hitting apis of post
// app.use(express.urlencoded({ extended: false }));  // for the postman hitting of api of post
const cors = require('cors'); // Import the cors middleware
app.use(cors());
// importing connection pool functions
const { getUsers, createUser } = require("./app");

//Routes for APIs
// get request
app.get("/users", async (req, res) => {
  res.json(await getUsers());
});

// get dynamic user with ID

// app.get("/users/:id", (req, res) => {
//   let id = Number(req.params.id);
//   const user = users.find((val) => val.id === id);
//   return res.json(user);
// });

app
  .route("/users/:id")
  .get((req, res) => {
    let id = Number(req.params.id);
    const user = users.find((val) => val.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    // edit user
    let id = Number(req.params.id);
    let userFound = false;
    users.forEach((val) => {
      if (val.id === id) {
        userFound = true;
        val.first_name = req.body.first_name;
        val.last_name = req.body.last_name;
        val.email = req.body.email;
        val.gender = req.body.gender;
        val.job_title = req.body.job_title;
      }
    });
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.json({ message: "Error updating user" });
      }
      return res.json({ message: "Success", data: req.body });
    });
  })
  .delete((req, res) => {
    // delet user
    let id = Number(req.params.id);
    console.log(req.params, "req.body delete");
    users.splice(id, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ message: "Success" });
    });
  });

// post request - Create new user
app.post("/users", async (req, res) => {
  try {
    const body = req.body;
    console.log("body", body);
    await createUser(body); // Use createUser to insert the data into the database
    res.json({ message: "Success", data: body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// server listing
app.listen(port, () => {
  console.log("Server is Started...");
});
