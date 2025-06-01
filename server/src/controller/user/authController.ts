import { Request, Response } from "express";
import User from "../../model/user";
import HttpStatus from "../../utils/httpStatusCodes";
import bcrypt from "bcryptjs";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { JwtPayloadCustom } from "../../types/userTypes";
import { userDto } from "../../utils/dto/userDto";

const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 6 * 60 * 60 * 1000;
const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;
export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phone, dateOfBirth, email, password, confirmPassword, preferences } = req.body
        if (!firstName || !lastName || !phone || !dateOfBirth || !email || !password || !preferences) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "All fileds are required" })
            return
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "User alredy exits with this email" })
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            phone,
            dateOfBirth,
            email,
            password: hashedPassword,
            preferences
        })
        await user.save()
        const token = generateToken(user.id, false);
        const refreshToken = generateRefreshToken(user.id, false)
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

        res.status(HttpStatus.CREATED).json({ user: user._id, message: "User created successfully" })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "All fileds are reqiured" })
            return
        }
        const user = await User.findOne({ email })

        if (!user) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "User Not found" })
            return
        }
        if (user.isBlocked) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "User is Blocked" })
            return
        }
        const isMatch = await bcrypt.compare(password, user?.password)
        if (!isMatch) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid credentials" })
        }

        const token = generateToken(user.id, user.isAdmin);
        const refreshToken = generateRefreshToken(user.id, user.isAdmin);
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
        const newuser = userDto(user)
        res.status(HttpStatus.OK).json({ user: newuser, message: "User Login successfully" })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refresh_token
        const newToken = await new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET as string, (err: jwt.VerifyErrors | null, decode: string | jwt.JwtPayload | undefined) => {
                if (err) {
                    reject(new Error("Invalid Token"))
                    return
                }
                const newAcessToken = generateToken((decode as JwtPayloadCustom)?.id, (decode as JwtPayloadCustom)?.isAdmin)
                resolve(newAcessToken)
            })
        })
        res.cookie("access_token", newToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: accessTokenMaxAge,
        });

        res.status(HttpStatus.OK).json({ accessToken: newToken });

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "User id is required" })
            return
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

        res.status(HttpStatus.OK).json({ success: true, message: "User logout sucsess fully" })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server errror" })
    }
}