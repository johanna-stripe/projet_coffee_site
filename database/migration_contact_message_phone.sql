-- =====================================================================
-- MIGRATION : téléphone dans les messages de contact
-- À lancer UNE SEULE FOIS (après migration_contact_message.sql)
-- =====================================================================
ALTER TABLE contact_message
    ADD COLUMN phone VARCHAR(20) NULL AFTER email;
