-- =====================================================================
-- MIGRATION : séparation USER (compte) / CUSTOMER (infos personnelles)
-- Option A : username dans USER
-- À lancer UNE SEULE FOIS, après une sauvegarde de la base :
--   mysqldump -u root -p coffee_db > backup_avant_migration.sql
-- =====================================================================


-- ---------------------------------------------------------------
-- 1. CUSTOMER : nouvelles tailles + colonne birth_date
-- ---------------------------------------------------------------
ALTER TABLE customer
    MODIFY first_name VARCHAR(150) NOT NULL,
    MODIFY last_name  VARCHAR(150) NOT NULL,
    ADD COLUMN birth_date DATE NULL AFTER phone;


-- ---------------------------------------------------------------
-- 2. Copier les infos perso de users vers customer
-- ---------------------------------------------------------------

-- 2a. Les clients invités (sans user_id) qui ont le même email qu'un user
--     -> on les rattache à ce user
UPDATE customer
    JOIN users ON users.user_email = customer.customer_email
SET customer.user_id = users.user_id
WHERE customer.user_id IS NULL;

-- 2b. Les fiches customer déjà rattachées à un user
--     -> on recopie la date de naissance (nouvelle colonne, donc vide)
UPDATE customer
    JOIN users ON users.user_id = customer.user_id
SET customer.birth_date = users.birth_date;

--     -> et le téléphone, seulement si la fiche n'en a pas
UPDATE customer
    JOIN users ON users.user_id = customer.user_id
SET customer.phone = users.phone
WHERE customer.phone IS NULL;

-- 2c. first_name / last_name sont obligatoires dans customer :
--     on remplace les valeurs vides de users par '' avant la copie
UPDATE users SET first_name = '' WHERE first_name IS NULL;
UPDATE users SET last_name  = '' WHERE last_name  IS NULL;

-- 2d. Les users qui n'ont pas encore de fiche customer -> on la crée
--     (LEFT JOIN + IS NULL = "les users pour lesquels on ne trouve aucun customer")
INSERT INTO customer (user_id, first_name, last_name, customer_email, phone, birth_date)
SELECT users.user_id, users.first_name, users.last_name, users.user_email, users.phone, users.birth_date
FROM users
    LEFT JOIN customer ON customer.user_id = users.user_id
WHERE customer.customer_id IS NULL;

-- 2e. Un user ne peut avoir qu'une seule fiche customer
ALTER TABLE customer ADD UNIQUE INDEX uq_customer_user (user_id);


-- ---------------------------------------------------------------
-- 3. USERS : username, renommage de l'email, suppression des infos perso
-- ---------------------------------------------------------------
ALTER TABLE users ADD COLUMN username VARCHAR(100) NULL AFTER user_id;

-- username par défaut = "Prénom Nom"
UPDATE users SET username = TRIM(CONCAT(first_name, ' ', last_name));

-- si le user n'avait ni prénom ni nom -> la partie de l'email avant le @
UPDATE users SET username = SUBSTRING_INDEX(user_email, '@', 1) WHERE username = '';

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
SELECT users.user_id, users.username, users.email
FROM users
    LEFT JOIN customer ON customer.user_id = users.user_id
WHERE customer.customer_id IS NULL;
