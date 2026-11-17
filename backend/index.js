//================IMPORTS=================
import app from "./app.js"
//app.js doit rester en premier : il charge dotenv, donc process.env est rempli avant l'import de mongo.js
import { connectMongo } from "./config/mongo.js"


//================START=================
async function start() {
    try {
        await connectMongo()
        //on se connecte à MongoDB avant d'accepter des requêtes
    } catch (error) {
        console.error("MongoDB connection failed:", error.message)
        process.exit(1)
        //sans Mongo, les avis ne marcheraient pas : on arrête proprement plutôt que de tourner à moitié
    }

    app.listen(8800, () => {
        console.log("Hey, your serveur is running on port 8800")
    });
}

start()
//Taper sur google http://localhost:8800/
