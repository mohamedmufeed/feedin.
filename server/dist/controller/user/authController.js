"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../../model/user"));
const httpStatusCodes_1 = __importDefault(require("../../utils/httpStatusCodes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDto_1 = require("../../utils/dto/userDto");
const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 6 * 60 * 60 * 1000;
const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phone, dateOfBirth, email, password, confirmPassword, preferences } = req.body;
        if (!firstName || !lastName || !phone || !dateOfBirth || !email || !password || !preferences) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "All fileds are required" });
            return;
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "User alredy exits with this email" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new user_1.default({
            firstName,
            lastName,
            phone,
            dateOfBirth,
            email,
            password: hashedPassword,
            preferences
        });
        yield user.save();
        const token = (0, jwt_1.generateToken)(user.id, false);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id, false);
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: accessTokenMaxAge,
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: refreshTokenMaxAge,
        });
        res.status(httpStatusCodes_1.default.CREATED).json({ user: user._id, message: "User created successfully" });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "All fileds are reqiured" });
            return;
        }
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "User Not found" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isMatch) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "Invalid credentials" });
        }
        const token = (0, jwt_1.generateToken)(user.id, user.isAdmin);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id, user.isAdmin);
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: accessTokenMaxAge,
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: refreshTokenMaxAge,
        });
        const newuser = (0, userDto_1.userDto)(user);
        res.status(httpStatusCodes_1.default.OK).json({ user: newuser, message: "User Login successfully" });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        const newToken = yield new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decode) => {
                if (err) {
                    reject(new Error("Invalid Token"));
                    return;
                }
                const newAcessToken = (0, jwt_1.generateToken)(decode === null || decode === void 0 ? void 0 : decode.id, decode === null || decode === void 0 ? void 0 : decode.isAdmin);
                resolve(newAcessToken);
            });
        });
        res.cookie("access_token", newToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: accessTokenMaxAge,
        });
        res.status(httpStatusCodes_1.default.OK).json({ accessToken: newToken });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        if (!userId) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "User id is required" });
            return;
        }
        res.cookie("access_token", " ", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            expires: new Date(0),
        });
        res.cookie("refresh_token", " ", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            expires: new Date(0),
        });
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "User logout sucsess fully" });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server errror" });
    }
});
exports.logout = logout;
