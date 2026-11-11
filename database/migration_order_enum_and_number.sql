-- =====================================================================
-- MIGRATION : table `order`
--   1. order_status et payment_method deviennent des ENUM
--   2. numéros de commande au format CMD-<année>-<n°> et uniques
-- À lancer UNE SEULE FOIS, dans l'ordre. Faire une sauvegarde avant (mysqldump).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 0. VÉRIFICATION AVANT TOUT : quelles valeurs existent déjà en base ?
--    Un ENUM refuse (ou casse) toute valeur qui n'est pas dans sa liste.
--    Si tu vois une valeur absente des listes de l'étape 1, ajoute-la
--    à la liste ou corrige les lignes avec un UPDATE.
-- ---------------------------------------------------------------------
SELECT DISTINCT order_status   FROM `order`;
SELECT DISTINCT payment_method FROM `order`;


-- ---------------------------------------------------------------------
-- 1. ENUM
-- ---------------------------------------------------------------------
-- 1a. On uniformise l'ancienne valeur française avant de poser l'ENUM
UPDATE `order`
SET payment_method = 'transfer'
WHERE payment_method = 'virement';

-- 1b. L'ENUM (pour ajouter un moyen plus tard : ALTER TABLE ... MODIFY avec la liste complète)
ALTER TABLE `order`
    MODIFY COLUMN order_status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled')
        NOT NULL DEFAULT 'pending',
    MODIFY COLUMN payment_method ENUM('card', 'paypal', 'transfer')
        NOT NULL;


-- ---------------------------------------------------------------------
-- 2. NUMÉRO DE COMMANDE
--    Le numéro CMD-<année>-<order_id sur 4 chiffres> est calculé par le backend
--    (orderModel.js), pas par la base. Ici on garde seulement ce qui sécurise la colonne.
-- ---------------------------------------------------------------------

-- 2a. Les anciens numéros ("5", "TMP"...) passent au nouveau format
UPDATE `order`
SET order_number = CONCAT('CMD-', YEAR(order_date), '-', LPAD(order_id, 4, '0'))
WHERE order_number NOT LIKE 'CMD-%';

-- 2b. Deux commandes ne peuvent pas avoir le même numéro
ALTER TABLE `order`
    ADD CONSTRAINT uq_order_number UNIQUE (order_number);
