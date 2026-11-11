const express = require('express');
const router = express.Router();

const Department = require('../models/Department');
const requireAuth = require('../middleware/auth');

// Get all departments
router.get('/', requireAuth, async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a department
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, code, description } = req.body;

        const department = await Department.create({
            name,
            code,
            description
        });

        res.status(201).json(department);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
