const express = require("express");
const router = express.Router();
const Task = require("../../Models/Employee/TaskModel");

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { userId, userName, department, title, description, dueDate } = req.body;

    if (!userId || !userName || !department || !title) {
      return res.status(400).json({ message: "userId, userName, department, and title are required" });
    }

    const validDepartments = [
      "human_resource",
      "prduction&process",
      "quality_assurance",
      "administration",
      "finance",
    ];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: "Due date cannot be in the past" });
    }

    const task = await Task.create({ userId, userName, department, title, description, dueDate });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// Fetch all tasks (optionally filtered)
router.get("/", async (req, res) => {
  try {
    const { department, userId } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (userId) filter.userId = userId;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Update task status
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "in_progress", "done"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
