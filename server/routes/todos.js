const express = require('express');
const jwt = require('jsonwebtoken');
const Todo = require('../models/Todo');

const router = express.Router();

// Middleware to verify token and extract userId
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get all todos for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// Add new todo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { task } = req.body;
    const newTodo = new Todo({ userId: req.userId, task });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo' });
  }
});

// Update todo (complete or edit task)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { task, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { task, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// Delete todo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

module.exports = router;
