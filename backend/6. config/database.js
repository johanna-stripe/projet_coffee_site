//============IMPORTS==============
import mysql from 'mysql2/promise'
//mysql2/promise → pour parler à une base de données MySQL (version "promise", ce qui permet d'utiliser async/await)

//=============DATABASE CONFIGURATION===============
const db_config = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'coffee_site_project'
}

//============DATABASE CONNECTION===============
const db = mysql.createPool(db_config);
//avant on avait const db = await mysql.createConnection(db_config);

export default db;
// on exporte par défaut pour pouvoir l'importer ailleurs plus tard