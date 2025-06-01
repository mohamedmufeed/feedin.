"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileDto = exports.userDto = void 0;
const userDto = (user) => {
    return {
        _id: user._id,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin
    };
};
exports.userDto = userDto;
const profileDto = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        email: user.email,
        preferences: user.preferences,
        profileImage: user.profileImage,
    };
};
exports.profileDto = profileDto;
