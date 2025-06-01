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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../model/user"));
const httpStatusCodes_1 = __importDefault(require("../utils/httpStatusCodes"));
dotenv_1.default.config();
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
    if (!token) {
        res.status(httpStatusCodes_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        const user = yield user_1.default.findById(decode.id);
        if (!user) {
            res.status(httpStatusCodes_1.default.UNAUTHORIZED).json({ success: false, message: "User not found" });
            return;
        }
        if (user.isBlocked) {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(httpStatusCodes_1.default.FORBIDDEN).json({ message: 'Your account is blocked' });
            return;
        }
        req.user = { id: user._id.toString(), isAdmin: user.isAdmin, };
        next();
    }
    catch (error) {
        const err = error;
        res.status(401).json({ message: `Invalid token or expires${err.message}` });
    }
});
exports.default = protect;
