const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        }
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    }
});

module.exports = mongoose.model("User", userSchema);