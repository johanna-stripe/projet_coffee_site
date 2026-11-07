export const INSERT_CONTACT_MESSAGE = `
    INSERT INTO contact_message (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
`
