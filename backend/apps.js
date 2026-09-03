//====================IMPORTS====================
import 'dotenv/config.js' //doit se placer en premier
import express from 'express'
//express → le framework qui va créer le serveur web
import cors from 'cors'
//cors → permet à d'autres applications (ex: un frontend React) d'appeler ce serveur sans être bloquées par le navigateur
import helmet from "helmet";

import productRoutes from "./routes/productRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import authRoutes from "./security/authRoutes.js";
import userRoutes from "./security/userRoutes.js";

//=============DEMARRAGE DU SERVEUR===============
const app = express();

app.use(express.json());
//express.json() → dit à Express de lire automatiquement le JSON envoyé dans les requêtes (le req.body)
app.use(cors(0))
//cors(0) → autorise toutes les origines à appeler l'API
app.use(helmet())


//Test pour vérifier si tout est bien paramétré
app.get('/', (req, res) => {
    res.send("This is the backend of 'Le Temps d'une tasse' website")
})

//=============DEFINITION DES ROUTERS===============
app.use('/api/v1/products', productRoutes) //baseUrl http://localhost:8800/api/v1/products/
app.use('/api/v1/categories', categoriesRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/customer', customerRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/brand', brandRoutes)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

export default app;

