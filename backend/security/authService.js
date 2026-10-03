import {
    saveUserWithCustomer,
    findUserByEmail,
} from "../models/userModel.js";

import {errorBuilder} from "../private methods/privateMethods.js";
import {comparePassword, hashPassword} from "./helper/passwordUtiles.js";
import {generateToken} from "./helper/tokenUtiles.js";

//=================REGISTER===================
// À l'inscription on crée :
//  - le compte dans users (username, email, password)
//  - la fiche perso dans customer (first_name, last_name, phone, birth_date)
export const registerUser = async (userData) => {
    const {first_name, last_name, phone, birth_date, password} = userData
    // le formulaire envoie encore "user_email" : on accepte les 2 noms
    const email = userData.email ?? userData.user_email
    // username facultatif : par défaut "Prénom Nom"
    const username = userData.username?.trim() || `${first_name ?? ''} ${last_name ?? ''}`.trim()

    if (!first_name || !last_name || !email || !password) throw errorBuilder('All fields marked with * are mandatory')

    if (password.length < 8 || password.length > 16) throw errorBuilder('Your password should contain 8 to 16 characters')

    //Verifier que l'user n'existe pas déjà (avec son email)
    const existingUser = await findUserByEmail(email)
    if (existingUser) throw errorBuilder('The email already exists', 409)

    const hashedPassword = await hashPassword(password)

    const user = await saveUserWithCustomer(
        {username, email, password: hashedPassword, role: "USER"},
        {first_name, last_name, customer_email: email, phone, birth_date}
    )

    const token = generateToken(user)

    return {
        user: {
            id: user.user_id,
            user_id: user.user_id,
            customer_id: user.customer_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            birth_date: user.birth_date,
            role: user.role,
        },
        token
    };
}


//===================LOGIN=====================
export const loginUser = async ({email, password})=>{
    if (!email || !password) throw errorBuilder('All fields are mandatory')

    //Verifier que l'user existe bien dans la bdd (avec son email)
    // findUserByEmail fait un LEFT JOIN sur customer -> on récupère aussi prénom, nom, etc.
    const existingUser = await findUserByEmail(email)
    if (!existingUser) throw errorBuilder('Invalid identifiers', 401)

    if (!existingUser.is_active) { //si pas active, il peut pas se connecter
        throw errorBuilder('The account is disable', 403)
    }

    const passwordIsValid = await comparePassword(password, existingUser.password)
    if(!passwordIsValid) throw errorBuilder('Invalid identifiers',401)

    const token = generateToken(existingUser)

    return {
        user:{
            id: existingUser.user_id,
            customer_id: existingUser.customer_id,
            username: existingUser.username,
            email: existingUser.email,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            phone: existingUser.phone,
            birth_date: existingUser.birth_date,
            role: existingUser.role,
            created_at: existingUser.created_at
        },
        token
    }
}
