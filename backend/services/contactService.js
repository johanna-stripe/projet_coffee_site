import {insertContactMessage} from "../models/contactModel.js";
import {normalizeEmailAddress, normalizePhoneNumber, errorBuilder} from "../private methods/privateMethods.js";

export const CONTACT_SUBJECTS = [
    'Conseil produit',
    'Suivi de commande',
    'Demande professionnelle',
    'Autre demande',
]

export const createContactMessage = async ({nom, email, telephone, demande, message, consentement}) => {
    if (typeof nom !== 'string' || !nom.trim() || nom.trim().length > 100) {
        throw errorBuilder('Name is required (100 characters max)', 400)
    }
    if (!CONTACT_SUBJECTS.includes(demande)) {
        throw errorBuilder('Request type is not valid', 400)
    }
    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5000) {
        throw errorBuilder('Message must contain between 10 and 5000 characters', 400)
    }
    if (consentement !== true) {
        throw errorBuilder('Consent is required', 400)
    }

    const cleanEmail = normalizeEmailAddress(email)

    // Téléphone facultatif : s'il est rempli, il doit être valide
    let cleanPhone = null
    if (typeof telephone === 'string' && telephone.trim()) {
        cleanPhone = normalizePhoneNumber(telephone)
        if (!cleanPhone) throw errorBuilder('Phone number not valid', 400)
    }

    return await insertContactMessage(nom.trim(), cleanEmail, cleanPhone, demande, message.trim())
}
