-- =====================================================================
-- MIGRATION : messages du formulaire de contact
-- À lancer UNE SEULE FOIS
-- =====================================================================
CREATE TABLE IF NOT EXISTS contact_message (
    contact_message_id INT AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(100) NOT NULL,
    email              VARCHAR(255) NOT NULL,
    subject            VARCHAR(150) NULL,
    message            TEXT         NOT NULL,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
