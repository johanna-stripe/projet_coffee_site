-- =====================================================================
-- MIGRATION : table `order`
--   1. order_status et payment_method deviennent des ENUM
--   2. order_number se génère tout seul : CMD-<année>-<n° sur 4 chiffres>
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
-- 2. NUMÉRO DE COMMANDE AUTOMATIQUE
--    MySQL ne sait pas utiliser order_id (AUTO_INCREMENT) dans une colonne
--    calculée, ni le connaître dans un trigger BEFORE INSERT.
--    On utilise donc un petit compteur par année : le numéro repart à 0001
--    chaque 1er janvier, et il n'y a pas de trou si une commande échoue.
-- ---------------------------------------------------------------------

-- 2a. Les anciens numéros ("5", "TMP"...) passent au nouveau format
UPDATE `order`
SET order_number = CONCAT('CMD-', YEAR(order_date), '-', LPAD(order_id, 4, '0'))
WHERE order_number NOT LIKE 'CMD-%';

-- 2b. Deux commandes ne peuvent pas avoir le même numéro
ALTER TABLE `order`
    ADD CONSTRAINT uq_order_number UNIQUE (order_number);

-- 2c. Le compteur : une ligne par année
CREATE TABLE order_number_counter
(
    year        SMALLINT UNSIGNED NOT NULL PRIMARY KEY,
    last_number INT UNSIGNED      NOT NULL
);

-- 2d. On le démarre après les commandes déjà existantes (pas de doublon)
INSERT INTO order_number_counter (year, last_number)
SELECT YEAR(order_date), MAX(order_id)
FROM `order`
GROUP BY YEAR(order_date);

-- 2e. Le trigger : avant chaque INSERT, il prend le numéro suivant de l'année
DELIMITER $$

CREATE TRIGGER trg_order_number
    BEFORE INSERT
    ON `order`
    FOR EACH ROW
BEGIN
    DECLARE order_year SMALLINT UNSIGNED;
    DECLARE next_number INT UNSIGNED;
    SET order_year = YEAR(COALESCE(NEW.order_date, NOW()));

    -- première commande de l'année : on crée la ligne du compteur
    INSERT IGNORE INTO order_number_counter (year, last_number) VALUES (order_year, 0);

    -- l'UPDATE verrouille la ligne jusqu'à la fin de la transaction :
    -- deux clients en même temps n'obtiennent jamais le même numéro
    UPDATE order_number_counter SET last_number = last_number + 1 WHERE year = order_year;
    SELECT last_number INTO next_number FROM order_number_counter WHERE year = order_year;

    SET NEW.order_number = CONCAT('CMD-', order_year, '-', LPAD(next_number, 4, '0'));
END$$

DELIMITER ;
