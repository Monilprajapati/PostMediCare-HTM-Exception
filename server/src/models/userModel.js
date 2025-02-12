import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET, TOKEN_EXPIRY } from "../config/serverConfig.js";
import { ROLES } from "../utils/constants.js";

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(ROLES),
        default: ROLES.PATIENT
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const saltRound = 10;
    this.password = await bcrypt.hash(this.password, saltRound);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        TOKEN_SECRET,
        {
            expiresIn: TOKEN_EXPIRY
        }
    );
};

export const User = model("User", userSchema);
