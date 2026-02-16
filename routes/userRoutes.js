const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/", userController.getUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Get user's todos
router.get("/:id/todos", userController.getUserTodos);

module.exports = router;
