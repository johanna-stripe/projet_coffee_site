import {NavLink, Outlet} from "react-router-dom";
import {CLIENT_PATHS} from "../../routes/paths.js";
import "../../style/adminLayout.css"

// Cadre de l'espace admin : menu latéral + zone où s'affichent les pages admin (Outlet)
export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-title">Administration</h2>
                <nav className="admin-nav">
                    {/* NavLink ajoute automatiquement la classe "active" sur le lien de la page courante */}
                    {/* end : sans ça « Tableau de bord » (/admin) resterait actif sur toutes les pages /admin/... */}
                    <NavLink to={CLIENT_PATHS.admin} end>Tableau de bord</NavLink>
                    <NavLink to={CLIENT_PATHS.adminProducts}>Produits</NavLink>
                    <NavLink to={CLIENT_PATHS.adminCategories}>Catégories</NavLink>
                    <NavLink to={CLIENT_PATHS.adminBrands}>Marques</NavLink>
                    <NavLink to={CLIENT_PATHS.adminOrders}>Commandes</NavLink>
                    <NavLink to={CLIENT_PATHS.adminUsers}>Utilisateurs</NavLink>
                </nav>
            </aside>

            <main className="admin-content">
                <Outlet/>
            </main>
        </div>
    )
}
