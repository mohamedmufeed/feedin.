"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, isAdmin) => {
    console.log(`id ${id} role ${isAdmin}`);
    return jsonwebtoken_1.default.sign({ id: id, role: isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "6h",
    });
};
exports.generateToken = generateToken;
const generateRefreshToken = (id, isAdmin) => {
    return jsonwebtoken_1.default.sign({ id: id, role: isAdmin }, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d"
    });
};
exports.generateRefreshToken = generateRefreshToken;
