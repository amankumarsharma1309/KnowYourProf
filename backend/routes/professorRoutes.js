const express = require("express");
const Professor = require("../models/Professor");
const Review = require("../models/Review");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        if (Array.isArray(req.body)) {

            const professors = await Professor.insertMany(req.body);

            return res.status(201).json({
                message: `${professors.length} professors added successfully.`,
                professors
            });

        }

        const professor = await Professor.create(req.body);

        res.status(201).json({
            message: "Professor added successfully.",
            professor
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const professors = await Professor.find();

        res.json(professors);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get("/stats", async (req, res) => {
    try {

        const professorCount = await Professor.countDocuments();

        const reviewCount = await Review.countDocuments({
            status: "approved"
        });

        const professors = await Professor.find();

        const averageRating =
            professors.length === 0
                ? 0
                : (
                    professors.reduce(
                        (sum, professor) => sum + professor.averageRating,
                        0
                    ) / professors.length
                ).toFixed(1);

        res.json({
            professorCount,
            reviewCount,
            averageRating
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});
router.get("/:id", async (req, res) => {
    try {
        const professor = await Professor.findById(req.params.id);

        if (!professor) {
            return res.status(404).json({
                message: "Professor not found"
            });
        }

        res.json(professor);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;