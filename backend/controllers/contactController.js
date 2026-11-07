import {createContactMessage} from "../services/contactService.js";

export const sendContactMessage = async (req, res) => {
    try {
        await createContactMessage(req.body ?? {})
        return res.status(201).json({message: 'Message sent'})
    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}
