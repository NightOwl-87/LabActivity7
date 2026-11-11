const requireAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/stats/by-department', requireAuth, async (req, res) => {
    try {
        const statistics = await Student.aggregate([
            // Stage 1: Group students by department
            {
                $group: {
                    _id: '$department',

                    totalStudents: {
                        $sum: 1
                    },

                    activeStudents: {
                        $sum: {
                            $cond: [
                                { $eq: ['$isActive', true] },
                                1,
                                0
                            ]
                        }
                    },

                    inactiveStudents: {
                        $sum: {
                            $cond: [
                                { $eq: ['$isActive', false] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },

            // Stage 2: Get department information
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'departmentInfo'
                }
            },

            // Stage 3: Convert departmentInfo array into an object
            {
                $unwind: '$departmentInfo'
            },

            // Stage 4: Select the fields to return
            {
                $project: {
                    _id: 0,
                    departmentId: '$_id',
                    departmentName: '$departmentInfo.name',
                    departmentCode: '$departmentInfo.code',
                    totalStudents: 1,
                    activeStudents: 1,
                    inactiveStudents: 1
                }
            },

            // Stage 5: Sort by department name
            {
                $sort: {
                    departmentName: 1
                }
            }
        ]);

        res.json({
            message: 'Student statistics retrieved successfully',
            statistics
        });

    } catch (err) {
        console.error('Aggregation error:', err);

        res.status(500).json({
            error: 'Failed to retrieve student statistics'
        });
    }
});

router.get('/', requireAuth, async (req, res) => {
    try {
        const students = await Student.find()
            .populate('createdBy', 'email role')
            .populate('department', 'name code');

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//I also added the auth for the POST and PUT to protect POST and PUT as well, because unauthenticated users should not be able to modify student records.
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, email, age, isActive, department } = req.body;

        const newStudent = await Student.create({
            name,
            email,
            age,
            isActive,
            department,
            createdBy: req.user.userId
        });

        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.put('/:id', requireAuth, async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully', deletedStudent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;    