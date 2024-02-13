const express = require("express");
// server
const app = express();
const port = 3000;

// importing database
const users = require("./MOCK_DATA.json");

// Middelware -plugins
app.use(express.urlencoded({ extended: false }));
const fs = require("fs"); 

//Routes
// get request
app.get("/users", (req, res) => {
  return res.json(users);
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
app.post("/users", (req, res) => {
  const body = req.body;
  console.log("body", body);
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ message: "Sucess", id: users.length });
  });
});

// server listing
app.listen(port, () => {
  console.log("Server is Started...");
});
