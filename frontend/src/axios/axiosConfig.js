/*
But de ce fichier :
-> centraliser la config axios (baseURL, headers par défaut...) à un seul endroit plutôt que de la dupliquer partout.
-> ne pas avoir à rajouter manuellement le token sur chaque requête individuelle
 */
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8800/api/v1',
    withCredentials: true // essentiel : dit au navigateur d'envoyer les cookies avec les requêtes
})

export default api;