import db from "../config/database.js"
import {INSERT_CONTACT_MESSAGE} from "../constantes/contactDBConstantes.js";

export const insertContactMessage = async (name, email, phone, subject, message) => {
    const [result] = await db.query(INSERT_CONTACT_MESSAGE, [name, email, phone, subject, message])
    return result.insertId
}
