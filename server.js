const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// Store users
let users = [];

// POST API
app.post("/add-user", (req, res) => {
  const { name, email, message } = req.body;

  // ✅ validation
  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Name, Email, and Message are required"
    });
  }

  if (name.length < 3) {
    return res.status(400).json({
      message: "Name must be at least 3 characters"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }

  if (message.length < 10) {
    return res.status(400).json({
      message: "Message must be at least 10 characters"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    message
  };

  users.push(newUser);

  res.status(201).json({
    message: "Application submitted successfully",
    data: newUser
  });
});

// GET API
app.get("/users", (req, res) => {
  res.json(users);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.delete("/delete-user/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  users.splice(userIndex, 1);

  res.json({
    message: "User deleted successfully"
  });
});
app.put("/update-user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Update only if values are provided
  if (name) user.name = name;
  if (email) user.email = email;

  res.json({
    message: "User updated successfully",
    user: user
  });
});
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});
