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
const { getUsers, createUser, deleteUser, editUser, createNewMember, getMember, editExistMember, getPackageList, addNewPackage, loginAuth, createLoginUser,getUserLogin } = require("./app");


// login request
// post -login register
app.post("/register", async (req, res) => {
  try {
    const body = req.body;
    await createLoginUser(body);
    res.json({ message: "Success", data: body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to login user" });
  }
})

// post -login match
app.post("/login", async (req, res) => {
  try {
    const body = req.body 
    if(body){
      const result =await loginAuth(body)
      if(result.success){
        res.status(200).json({ body, message: "login success" })
      }
      else{
        res.status(401).json({ message: "Incorrect chajkjhdgk username or password" });
      }
    }
    else{
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to login user" });
  }
})

// to get all users
app.get('/register',async(req,res)=>{
  try {
    const response = await getUserLogin()
    console.log(response,'response');
    if(response){
      res.status(200).json(response)
    }
  } catch (error) {
    res.status(500).json({message:"Failed to get all Users"})
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
