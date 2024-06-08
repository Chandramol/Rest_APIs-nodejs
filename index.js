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

// json token 
const jsonToken = require("jsonwebtoken")

// importing connection pool functions from database
const { getUsers, createUser, deleteUser, editUser, createNewMember, getMember, editExistMember, getPackageList, addNewPackage, loginAuth, createLoginUser, getUserLogin, generateQuery } = require("./app");


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
const secretKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZPQRSTU';
app.post("/login", async (req, res) => {
  try {
    const body = req.body;
    if (body) {
      const result = await loginAuth(body);
      if (result.success) {
        let uniqueId = result.user.user_id;
        // Sign the JWT
        let token = jsonToken.sign({ uniqueId }, secretKey, { expiresIn: '30m' });
        res.status(200).json({ result, accesss_token: token });
      } else {
        res.status(401).json({ message: "Incorrect username or password" });
      }
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login user" });
  }
});

// Middleware to validate token
function validateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  //Managed the when no token provided
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  // console.log(authHeader, 'authHeader');
  const token = authHeader.split(' ')[1];
  // console.log(token, 'token');
  //Managed the correct & expire token as verify
  jsonToken.verify(token, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token has expired" });
      } else {
        return res.status(401).json({ message: "Failed to authenticate token" });
      }
    }
    // req.userId = decoded.uniqueId;
    next();
  });
}

// to get all users
app.get('/register', validateToken, async (req, res) => {
  try {
    const response = await getUserLogin()
    // console.log(response, 'response');
    if (response) {
      res.status(200).json(response)
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to get all Users" })
  }
})

// inquiry related api
// get request
app.get("/users", validateToken, async (req, res) => {
  try {
    res.json(await getUsers());
  } catch (error) {
    res.status(500).json({ message: "Failed to get all inquiry members" })
  }
});

// post request
app.post("/users",
  async (req, res) => {
    try {
      const body = req.body;
      // console.log("body", body);
      await createUser(body); // to insert the data into the database
      res.json({ message: "Success", data: body });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

// delete req
app.delete("/users/:id", validateToken, async (req, res) => {
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
app.patch("/users/:id", validateToken, async (req, res) => {
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

// TO query
app.post("/generateQuery",
  async (req, res) => {
    try {
      const body = req.body;
      // console.log(body,'query body ');
      await generateQuery(body);
      res.json({ message: "Success", data: body });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Failed to create new query" });
    }
  });

// memeber realated funtions
// get all members
app.get("/addnewmember", validateToken, async (req, res) => {
  res.json(await getMember());
});

// add new member
app.post("/addnewmember", validateToken, async (req, res) => {
  try {
    const body = req.body;
    // console.log("body", body);
    await createNewMember(body); // to insert the data into the database
    res.json({ message: "Success", data: body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to create new member" });
  }
});

// edit exist member
app.patch("/addnewmember/:id", validateToken, async (req, res) => {
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
app.get("/packages", validateToken, async (req, res) => {
  try {
    res.json(await getPackageList());
  } catch (error) {
    console.error("Error:", error);
  }
})

// create new package
app.post("/packages", validateToken, async (req, res) => {
  try {
    const body = req.body;
    // console.log("body", body);
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
