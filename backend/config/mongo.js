//============IMPORTS==============
import { MongoClient } from 'mongodb'
//MongoClient → le client officiel pour parler à une base MongoDB


//=============MONGO CONFIGURATION===============
const client = new MongoClient(process.env.MONGO_URL)
//MONGO_URL contient tout : utilisateur, mot de passe, hôte, nom de la base et authSource
//Comme pour MySQL, rien n'est écrit en dur : tout vient du .env

let db = null
//db garde la base une fois connectée, pour la réutiliser partout sans se reconnecter


//============MONGO CONNECTION===============
export async function connectMongo() {
    if (db) return db
    //déjà connecté : on renvoie la base existante

    await client.connect()
    db = client.db()
    //client.db() sans argument : MongoDB prend le nom de la base dans l'URL (coffee_reviews)

    console.log("MongoDB connected")
    return db
}

export function getDb() {
    if (!db) {
        throw new Error("MongoDB n'est pas connecté : appelle connectMongo() au démarrage")
    }
    return db
}
//getDb() sera utilisée dans les contrôleurs : getDb().collection('reviews')
