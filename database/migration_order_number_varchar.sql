-- =====================================================================
-- MIGRATION : numéro de commande en texte (ex. CMD-2026-0001)
-- À lancer UNE SEULE FOIS
-- =====================================================================

-- order_number était un entier : il ne pouvait pas contenir "CMD-2026-0001".
-- Les numéros déjà enregistrés (ex. 5) sont conservés tels quels, en texte.
ALTER TABLE `order`
    MODIFY COLUMN order_number VARCHAR(20) NOT NULL;
