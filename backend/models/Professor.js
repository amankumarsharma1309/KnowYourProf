const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },

    averageRating: {
        type: Number,
        default: 0
    },

    reviewCount: {
        type: Number,
        default: 0
    },

    attendanceSummary: {
        type: String,
        default: "No Data"
    },

    paperDifficultySummary: {
        type: String,
        default: "No Data"
    },

    internalMarksSummary: {
        type: String,
        default: "No Data"
    },

    assignmentLoadSummary: {
        type: String,
        default: "No Data"
    },

    proxyPolicySummary: {
        type: String,
        default: "No Data"
    },

    recommendationPercentage: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model("Professor", professorSchema);