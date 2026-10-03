-- =====================================================================
-- MIGRATION : séparation USER (compte) / CUSTOMER (infos personnelles)
-- Option A : username dans USER
-- MySQL 8+  —  à lancer UNE SEULE FOIS, après une sauvegarde de la base
-- (mysqldump -u root -p coffee_db > backup_avant_migration.sql)
-- =====================================================================
--
-- Schéma cible :
--
-- users
--   user_id      INT UNSIGNED PK AUTO_INCREMENT
--   username     VARCHAR(100) NOT NULL
--   email        VARCHAR(155) UNIQUE NOT NULL
--   password     VARCHAR(255) NOT NULL
--   role         ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER'
--   is_active    TINYINT(1) NOT NULL DEFAULT 1
--   created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--   updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
--
-- customer
--   customer_id     INT PK AUTO_INCREMENT
--   user_id         INT UNSIGNED NULL  (FK -> users, NULL = client invité)
--   first_name      VARCHAR(150) NOT NULL
--   last_name       VARCHAR(150) NOT NULL
--   customer_email  VARCHAR(100) NOT NULL  (email de contact)
--   phone           VARCHAR(100) NULL
--   birth_date      DATE NULL
-- =====================================================================


-- ---------------------------------------------------------------
-- 1. CUSTOMER : nouvelles tailles + colonne birth_date
-- ---------------------------------------------------------------
ALTER TABLE customer
    MODIFY first_name VARCHAR(150) NOT NULL,
    MODIFY last_name  VARCHAR(150) NOT NULL,
    ADD COLUMN birth_date DATE NULL AFTER phone;


-- ---------------------------------------------------------------
-- 2. Reprise des données : chaque user doit avoir sa fiche customer
-- ---------------------------------------------------------------

-- 2a. Un client invité qui a le même email qu'un user -> on le rattache au user
UPDATE customer c
    JOIN users u ON u.user_email = c.customer_email
SET c.user_id = u.user_id
WHERE c.user_id IS NULL
  AND u.user_id NOT IN (
      -- DISTINCT force MySQL à matérialiser la sous-requête (sinon erreur 1093)
      SELECT x.user_id FROM (SELECT DISTINCT user_id FROM customer WHERE user_id IS NOT NULL) AS x
  );

-- 2b. On complète birth_date des fiches déjà rattachées
UPDATE customer c
    JOIN users u ON u.user_id = c.user_id
SET c.birth_date = COALESCE(c.birth_date, u.birth_date),
    c.phone      = COALESCE(c.phone, u.phone);

-- 2c. Les users qui n'ont toujours pas de fiche customer -> on la crée
INSERT INTO customer (user_id, first_name, last_name, customer_email, phone, birth_date)
SELECT u.user_id,
       COALESCE(u.first_name, ''),
       COALESCE(u.last_name, ''),
       u.user_email,
       u.phone,
       u.birth_date
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM customer c WHERE c.user_id = u.user_id)
  AND NOT EXISTS (SELECT 1 FROM customer c WHERE c.customer_email = u.user_email);

-- 2d. Un user = au plus une fiche customer (plusieurs NULL restent autorisés pour les invités)
ALTER TABLE customer
    ADD UNIQUE INDEX uq_customer_user (user_id);


-- ---------------------------------------------------------------
-- 3. USERS : ajout de username, renommage de l'email, suppression des infos perso
-- ---------------------------------------------------------------
ALTER TABLE users
    ADD COLUMN username VARCHAR(100) NULL AFTER user_id;

-- username par défaut = "Prénom Nom" (ou la partie avant le @ si vide)
UPDATE users
SET username = COALESCE(
        NULLIF(TRIM(CONCAT_WS(' ', first_name, last_name)), ''),
        SUBSTRING_INDEX(user_email, '@', 1)
    );

ALTER TABLE users
    MODIFY username VARCHAR(100) NOT NULL,
    RENAME COLUMN user_email TO email,
    DROP COLUMN first_name,
    DROP COLUMN last_name,
    DROP COLUMN phone,
    DROP COLUMN birth_date;


-- ---------------------------------------------------------------
-- 4. Vérifications
-- ---------------------------------------------------------------
DESCRIBE users;
DESCRIBE customer;

-- Doit renvoyer 0 ligne : users sans fiche customer
SELECT u.user_id, u.username, u.email
FROM users u
LEFT JOIN customer c ON c.user_id = u.user_id
WHERE c.customer_id IS NULL;
