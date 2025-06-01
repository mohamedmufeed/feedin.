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
exports.editProfile = exports.getProfile = void 0;
const httpStatusCodes_1 = __importDefault(require("../../utils/httpStatusCodes"));
const user_1 = __importDefault(require("../../model/user"));
const userDto_1 = require("../../utils/dto/userDto");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "User id is missing" });
            return;
        }
        const user = yield user_1.default.findById(id);
        if (!user) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "User not found" });
            return;
        }
        res.status(httpStatusCodes_1.default.OK).json({ user: (0, userDto_1.profileDto)(user), message: "User found sucsess fully" });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.getProfile = getProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { firstName, phone, lastName, email, dateOfBirth, profileImage, preferences } = req.body;
        const user = yield user_1.default.findById(id);
        if (!user) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "User not found" });
            return;
        }
        const updateFields = {};
        if (firstName)
            updateFields.firstName = firstName;
        if (phone)
            updateFields.phone = phone;
        if (lastName)
            updateFields.lastName = lastName;
        if (email)
            updateFields.email = email;
        if (profileImage)
            updateFields.profileImage = profileImage;
        if (dateOfBirth)
            updateFields.dateOfBirth = dateOfBirth;
        if (preferences)
            updateFields.preferences = preferences;
        const updatedUser = yield user_1.default.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updatedUser) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "Failed to update user profile" });
            return;
        }
        res.status(httpStatusCodes_1.default.OK).json({
            user: (0, userDto_1.profileDto)(updatedUser),
            message: "User profile updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.editProfile = editProfile;
