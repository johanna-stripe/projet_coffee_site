import {createContext, useContext, useEffect, useState} from "react";
import api from "../axios/axiosConfig.js";

const AuthContext = createContext();
//But : // Créer une "boîte" vide qui va contenir les infos d'authentification (register/login/logout...).

export const AuthProvider = ({children}) => {
//composant qui va englober tout (ou une partie) de l'appli. Donc tout ce qui est dans children aura accés aux données

    const [user, setUser] = useState(null)
    //user : contiendra les infos de l'utilisateur connecté (null si personne n'est connecté)

    const [authLoading, setAuthLoading] = useState(true)
    //boolean qui sert à savoir si un utilisateur est déjà connecté ou non.
    //Tant que c'est true -> afficher un loader plutôt que rediriger l'utilisateur vers la page de login.

    const register = async (formData) => {
        const response = await api.post('/auth/register', formData)
        /*
        → envoie une requête POST vers le backend avec les données du formulaire.
        Le serveur répond ET pose automatiquement le cookie httpOnly dans la réponse (grâce à res.cookie(...) côté backend) —
        le navigateur le stocke tout seul, on n'a rien à faire ici.
        */

        setUser(response.data.user)
        /*
        → on met à jour le state user avec les infos renvoyées par le back.
        Plus besoin de gérer le token côté frontend : il est dans le cookie,
        et il sera renvoyé automatiquement à chaque requête grâce à withCredentials: true.
        */

        return response.data
    }


    const login = async (formData) => {
        const response = await api.post('/auth/login', formData)

        setUser(response.data.user)

        return response.data
    }

    const logout = (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
            //on reprend exactement la config du cookie qu'on a crée dans authController. MaxAge n'est pas utile dans une suppression
        });
        return res.status(200).json({message: 'Logged out successfully'});
    }


    //loadCurrentUser -> Eviter qu'un user soit déconnecté tout le temps
    const loadCurrentUser = async () => {
        try {
            const response = await api.get('/auth/secured-endpoint')
            // → si un token existe, on fait une requête vers une route protégée du back
            setUser(response.data.user)

        } catch (error) {
            // Le cookie httpOnly n'est pas accessible en JS, donc rien à supprimer ici.
            // On se contente de remettre le state à jour côté front.
            setUser(null)

        } finally {
            setAuthLoading(false)
        }

    }

    useEffect(() => {
        loadCurrentUser()
    }, []);
    /*
    useEffect(() => { loadCurrentUser() }, []) = "au tout premier chargement de l'app, et une seule fois, vérifie si l'utilisateur a déjà un token valide."

    useEffect → exécute du code après l'affichage (pas pendant le rendu).
    [] vide → aucune dépendance à surveiller, donc ça ne tourne qu'une fois, au montage du composant.

    Pourquoi c'est nécessaire : React oublie tout son state à chaque rechargement de page (F5), donc sans ça, user repartirait à null même si le token est toujours valide. Ce useEffect restaure la session automatiquement au démarrage.
     */

    return (
        <AuthContext.Provider
            value={{ // {{ }} → 1eres car on écrit du JSX, 2e car value prend un objet
                user,              // l'utilisateur connecté (ou null)
                authLoading,        // true/false : vérification en cours ?
                register,           // la fonction pour créer un compte
                login,              // la fonction pour se connecter
                logout,              // la fonction pour se déconnecter
                isAuthenticated: Boolean(user), // true si user existe, false si null
                isAdmin: user?.role === 'ADMIN' // true si user est admin
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}
/*
C'est un hook personnalisé qui simplifie l'usage du contexte. Sans lui, dans chaque composant tu devrais écrire :
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const { user, login } = useContext(AuthContext);

Avec useAuth, c'est plus court et plus lisible :
import { useAuth } from '../context/AuthContext';
const { user, login, isAuthenticated } = useAuth();
*/




