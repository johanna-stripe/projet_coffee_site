import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.user_id,
            email: user.email,
            role: user.role
        }, //playload
        process.env.JWT_SECRET, //signature
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    )
}