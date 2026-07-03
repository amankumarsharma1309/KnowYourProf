const express = require("express");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");
const Professor = require("../models/Professor");

const router = express.Router();

module.exports = router;

router.post("/", authMiddleware, async (req, res) => {
    try {

        const review = await Review.create({
            ...req.body,
            createdBy: req.userId
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/professor/:id", async (req, res) => {
    try {

        const reviews = await Review.find({
            professorId: req.params.id,
            status: "approved"
        });
        const formattedReviews = reviews.map(review => {

            const reviewObj = review.toObject();

            return {

                ...reviewObj,

                helpfulCount: review.helpfulVotes.length,

                notHelpfulCount: review.notHelpfulVotes.length

            };

        });

        res.json(formattedReviews);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post("/:id/vote", authMiddleware, async (req, res) => {

    try {

        const { vote } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        const userId = req.userId;

        const helpfulIndex = review.helpfulVotes.findIndex(
            id => id.toString() === userId
        );

        const notHelpfulIndex = review.notHelpfulVotes.findIndex(
            id => id.toString() === userId
        );

        if (vote === "helpful") {

            if (helpfulIndex !== -1) {

                review.helpfulVotes.splice(helpfulIndex, 1);

            } else {

                if (notHelpfulIndex !== -1) {
                    review.notHelpfulVotes.splice(notHelpfulIndex, 1);
                }

                review.helpfulVotes.push(userId);

            }

        }

        else if (vote === "notHelpful") {

            if (notHelpfulIndex !== -1) {

                review.notHelpfulVotes.splice(notHelpfulIndex, 1);

            } else {

                if (helpfulIndex !== -1) {
                    review.helpfulVotes.splice(helpfulIndex, 1);
                }

                review.notHelpfulVotes.push(userId);

            }

        }

        await review.save();

        res.json({

            helpfulCount: review.helpfulVotes.length,

            notHelpfulCount: review.notHelpfulVotes.length

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

router.get("/pending", authMiddleware, async (req, res) => {

    try {

        if (req.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

        const reviews = await Review.find({
            status: "pending"
        }).populate("professorId", "name department");

        res.json(reviews);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

});

router.put("/:id/approve", authMiddleware, async (req, res) => {

    try {

        if (req.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                status: "approved"
            },
            {
                new: true
            }
        );

        const approvedReviews = await Review.find({
            professorId: review.professorId,
            status: "approved"
        });
        function mostCommon(arr) {
            const count = {};

            arr.forEach(value => {
                count[value] = (count[value] || 0) + 1;
            });

            return Object.keys(count).reduce((a, b) =>
                count[a] > count[b] ? a : b
            );
        }
        const attendanceSummary = mostCommon(
            approvedReviews.map(review => review.attendancePolicy)
        );

        const proxyPolicySummary = mostCommon(
            approvedReviews.map(review => review.proxyPolicy)
        );

        const paperDifficultySummary = mostCommon(
            approvedReviews.map(review => review.paperDifficulty)
        );

        const internalMarksSummary = mostCommon(
            approvedReviews.map(review => review.internalMarks)
        );

        const assignmentLoadSummary = mostCommon(
            approvedReviews.map(review => review.assignmentLoad)
        );

        const recommendationPercentage =
            (
                approvedReviews.filter(review => review.wouldRecommend).length /
                approvedReviews.length
            ) * 100;

        const averageRating =
            approvedReviews.reduce(
                (sum, review) => sum + review.overallRating,
                0
            ) / approvedReviews.length;

        await Professor.findByIdAndUpdate(
            review.professorId,
            {
                averageRating,
                reviewCount: approvedReviews.length,

                attendanceSummary,
                paperDifficultySummary,
                internalMarksSummary,
                assignmentLoadSummary,
                proxyPolicySummary,

                recommendationPercentage
            }
        );

        res.json({
            message: "Review approved successfully",
            review
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

});

router.put("/:id/reject", authMiddleware, async (req, res) => {

    try {

        if (req.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                status: "rejected"
            },
            {
                new: true
            }
        );

        res.json({
            message: "Review rejected successfully",
            review
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});