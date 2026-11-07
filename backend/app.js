//====================IMPORTS====================
import 'dotenv/config.js' //doit se placer en premier
import express from 'express'
//express → le framework qui va créer le serveur web
import cors from 'cors'
//cors → permet à d'autres applications (ex: un frontend React) d'appeler ce serveur sans être bloquées par le navigateur
import helmet from "helmet";
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import productRoutes from "./routes/productRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import authRoutes from "./security/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

//=============DEMARRAGE DU SERVEUR===============
const app = express();

app.use(express.json());
//express.json() → dit à Express de lire automatiquement le JSON envoyé dans les requêtes (le req.body)

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true //essentiel pour utiliser withCredentials dans axios et donc dire d'inclure les cookies dans les requêtes
}));


app.use(helmet()) //pas besoin de le configurer comme limiter
//voir ce que fait postman sans helmet (on double les vérifications de sécurité, donc mon appli est bien secure)

// Limite générale : protège tout le serveur sans gêner un usage normal
// (une seule page peut faire plusieurs requêtes : profil, adresses, enregistrement...)
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message:{
        message: 'Too many requests. Retry later'
    },
})
app.use(limiter);

// Limite stricte : seulement pour la connexion et l'inscription (contre les attaques par force brute)
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message:{
        message: 'Too many connection attempts. Retry later'
    },
})
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use("/api/v1/contact", authLimiter);

app.use(cookieParser())


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
app.use("/api/v1/contact", contactRoutes)

export default app;

