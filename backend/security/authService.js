import {
    saveUser,
    findUserByEmail,
} from "./userModel.js";

import {errorBuilder} from "../private methods/privateMethods.js";
import {hashPassword} from "./helper/passwordUtiles.js";
import {generateToken} from "./helper/tokenUtiles.js";
import {compare} from "bcrypt";


//=================REGISTER===================
export const registerUser = async (userData) => {
    const {username, email, password} = userData
    if (!username || !email || !password) throw errorBuilder('All fields are mandatory')
    if (password.length < 8 || password.length > 16) throw errorBuilder('Your password should contain 8 to 16 characters')

    //Verifier que l'user n'existe pas déjà (avec son email)
    const existingUser = await findUserByEmail(email)
    if (existingUser) throw errorBuilder('The email already exists', 409)

    const hashedPassword = await hashPassword(password)

    const user = await saveUser({
        username,
        email,
        password: hashedPassword,
        role: "USER"
    })

    const token = generateToken(user)

    return {
        user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        token
    };
}


//===================LOGIN=====================
export const loginUser = async ({email, password})=>{
    if (!email || !password) throw errorBuilder('All fields are mandatory')

    //Verifier que l'user existe bien dans la bdd (avec son email)
    const existingUser = await findUserByEmail(email)
    if (!existingUser) throw errorBuilder('Invalid identifiers', 401)

    if (!existingUser.is_active) { //si pas active, il peut pas se connecter
        throw errorBuilder('The account is disable', 403)
    }

    const passwordIsValid = await compare(password, existingUser.password)
    if(!passwordIsValid) throw errorBuilder('Invalid identifiers',401)

    const token = generateToken(existingUser)

    return {
        user:{
            id: existingUser.user_id,
            username: existingUser.username,
            email: existingUser.email,
            roel: existingUser.role
        },
        token
    }

}

