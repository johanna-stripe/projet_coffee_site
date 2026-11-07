import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import {CLIENT_PATHS} from "../../routes/paths.js";

// Garde de route : n'affiche les sous-routes /admin que si l'utilisateur est admin.
// (Protection d'UX uniquement : la vraie sécurité est côté backend avec authorizeRole('ADMIN').)
export default function AdminRoute() {
    const {authLoading, isAdmin} = useAuth()

    // On ne sait pas encore si l'utilisateur est connecté (appel /auth/me en cours) :
    // on attend plutôt que de rediriger à tort un admin qui vient de recharger la page.
    if (authLoading) return <p>Chargement...</p>

    // Pas admin (ou pas connecté) -> retour à l'accueil
    if (!isAdmin) return <Navigate to={CLIENT_PATHS.home} replace/>

    // Admin -> on affiche la sous-route demandée
    return <Outlet/>
}
