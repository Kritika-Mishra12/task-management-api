import Task from "../models/task.model.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date, assigned_to } = req.body;
    if (assigned_to && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can assign tasks to other users." });
    }
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      due_date,
      assigned_to: assigned_to || req.user._id,
      created_by: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch Tasks (With Filtering, Sorting, Pagination)
export const getTasks = async (req, res) => {
  try {
    const { status, priority, assigned_to, page = 1, limit = 10, sort = "due_date" } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assigned_to) filter.assigned_to = assigned_to;

    if (req.user.role !== "admin") {
      filter.$or = [{ created_by: req.user._id }, { assigned_to: req.user._id }];
    }

    const tasks = await Task.find(filter)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.created_by.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    if (task.created_by.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
