-- =====================================================================
-- MIGRATION : mode de livraison sur la commande (standard ou express)
-- À lancer UNE SEULE FOIS. Les commandes déjà enregistrées passent en 'standard'.
-- =====================================================================

ALTER TABLE `order`
    ADD COLUMN shipping_method ENUM('standard', 'express') NOT NULL DEFAULT 'standard'
        AFTER payment_method;
