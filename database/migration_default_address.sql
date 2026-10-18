-- =====================================================================
-- MIGRATION : adresse par défaut
-- À lancer UNE SEULE FOIS (après migration_users_customer.sql)
-- =====================================================================

-- 1. Nouvelle colonne : 1 = adresse par défaut, 0 = non
ALTER TABLE customer_address
    ADD COLUMN is_default TINYINT(1) NOT NULL DEFAULT 0 AFTER address_name;

-- 2. Pour les adresses déjà enregistrées :
--    la plus ancienne adresse de chaque client devient son adresse par défaut
UPDATE customer_address
    JOIN (SELECT customer_id, MIN(address_id) AS first_address_id
          FROM customer_address
          GROUP BY customer_id) AS first_addresses
        ON customer_address.address_id = first_addresses.first_address_id
SET customer_address.is_default = 1
WHERE customer_address.is_default = 0;

-- 3. Vérification : chaque client doit avoir 1 seule adresse par défaut
SELECT customer_id, SUM(is_default) AS nb_default
FROM customer_address
GROUP BY customer_id;
