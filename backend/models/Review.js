const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor",
        required: true
    },

    courseName: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    overallRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    teachingRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    attendancePolicy: {
        type: String,
        enum: [
            "Very Strict",
            "Strict",
            "Moderate",
            "Relaxed"
        ],
        required: true
    },

    proxyPolicy: {
        type: String,
        enum: [
            "Never Allowed",
            "Warning if Caught",
            "Usually Ignored"
        ],
        required: true
    },

    paperDifficulty: {
        type: String,
        enum: [
            "Easy",
            "Moderate",
            "Hard"
        ],
        required: true
    },

    paperPattern: {
        type: String,
        enum: [
            "Mostly PYQs",
            "Conceptual",
            "Mixed"
        ],
        required: true
    },

    internalMarks: {
        type: String,
        enum: [
            "Generous",
            "Fair",
            "Strict"
        ],
        required: true
    },

    assignmentLoad: {
        type: String,
        enum: [
            "Very Low",
            "Moderate",
            "Heavy"
        ],
        required: true
    },

    wouldRecommend: {
        type: Boolean,
        required: true
    },

    reviewText: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    helpfulCount: {
        type: Number,
        default: 0
    },

    notHelpfulCount: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);