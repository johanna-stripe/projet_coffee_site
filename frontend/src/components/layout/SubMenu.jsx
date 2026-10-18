import React from 'react';
import {CLIENT_PATHS, subCategoryPath} from "../../routes/paths.js";
import '../../style/subMenu.css'

const subMenus = [
    {
        categoryParent :"café",
        category: "Café grain",
        path: CLIENT_PATHS.cafeGrain,
        subCategories: [
            "Café en grain grand cru",
            "Café en grain biologique",
            "Café en grain décaféiné",
            "Café en grain italien",
            "Café en grain vert"
        ]
    },
    {
        categoryParent :"café",
        category: "Café moulu",
        path: CLIENT_PATHS.cafeMoulu,
        subCategories: [
            "Café moulu grand cru",
            "Café moulu biologique",
            "Café moulu décaféiné",
            "Café moulu italien",
            "Chicorée"
        ]
    },
    {
        categoryParent :"café",
        category: "Nos cafés par origine",
        subCategories: [
            "Cafés d’Italie",              // Italie
            "Cafés d’Afrique",             // Éthiopie, Kenya
            "Cafés d’Amérique centrale",   // Mexique, Guatemala, Honduras, Panama, Jamaïque
            "Cafés d’Amérique du Sud",     // Colombie, Pérou, Brésil
        ]
    },
    {
        categoryParent :"thé & infusions",
        category: "Nos thés",
        path: CLIENT_PATHS.the,
        subCategories: [
            "Thé en vrac",
            "Thé vert",
            "Thé noir",
            "Thé rouge",
            "Thé en sachet",
        ]
    },
    {
        categoryParent :"thé & infusions",
        category: "Nos infusions",
        path: CLIENT_PATHS.infusion,
        subCategories: [
            "Infusion en vrac",
            "Infusion aux herbes",
            "Infusion aux fleurs",
            "Infusion fruits et épices",
            "Infusion en sachet",
        ]
    },
    {
        categoryParent :"thé & infusions",
        category: "Nos marques",
        subCategories: [
            "Marque thé 1",
            "Marque thé 2",
            "Marque thé 3",
            "Marque thé 4",
            "Marque thé 5",
        ]
    },
    {
        categoryParent :"machines",
        category: "Voir toutes nos machines",
        path: CLIENT_PATHS.machines,
        subCategories: [
            "Machine à grain",
            "Machine à expresso",
            "Cafetière italienne",
            "Cafetière à piston",
            "Cafetière électrique",
        ]
    },
    {
        categoryParent :"accessoires",
        category: "Voir tous nos accessoires",
        path: CLIENT_PATHS.accessoires,
        subCategories: [
            "Accessoires café",
            "Accessoires thé",
            "Moulin à café",
            "Bouilloire",
            "Théière",
        ]
    },
]

const SubMenu = ({isOpen, category, top, left, gap, inline = false, onNavigate}) => {

    if (!isOpen) return null;

    const filtered = subMenus.filter((s) => s.categoryParent === category)
    // Une sous-catégorie renvoie vers la page de sa catégorie, déjà filtrée (ex : café en grain grand cru).
    // Les groupes sans path (origines, marques) ne correspondent pas à une catégorie en base : simple texte.

    // <a href> et non <Link> : le clic recharge la page (rechargement complet, pas de navigation interne React Router)
    const renderSubCategory = (subMenu, sub) => (
        <p key={sub} className="submenu2">
            {subMenu.path ? (
                <a href={subCategoryPath(subMenu.path, sub)}>{sub}</a>
            ) : sub}
        </p>
    )

    // Mobile / tablette : le sous-menu s'affiche dans le flux, sous l'entrée du menu (accordéon)
    if (inline) {
        return (
            <div className="submenu-inline" onClick={(e) => e.stopPropagation()}>
                {filtered.map((subMenu) => (
                    <div key={subMenu.category} className="submenu-inline__group">
                        <h4 className="m-0">
                            {subMenu.path ? (
                                <a href={subMenu.path} className="c-secondary text-decoration-none">
                                    {subMenu.category}
                                </a>
                            ) : subMenu.category}
                        </h4>
                        {subMenu.subCategories.map((sub) => renderSubCategory(subMenu, sub))}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div
            className="position-fixed z-index99"
            style={{
                top,
                left,
                transform: "translateX(-20%)", // centré sous le <li>
                width: "max-content",
                paddingTop: gap,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="b-primary flex"
                 style={{gap: 100, padding: "10px 40px"}}
            >
                    {filtered.map((subMenu) => (
                        <div key={subMenu.category}>
                            <h4 className="submenu">
                                {subMenu.path ? (
                                    <a
                                        href={subMenu.path}
                                        className="c-secondary text-decoration-none"
                                    >
                                        {subMenu.category}
                                    </a>
                                ) : subMenu.category}
                            </h4>
                            {subMenu.subCategories.map((sub) => renderSubCategory(subMenu, sub))}
                        </div>
                    ))}

            </div>
        </div>
    )
};

export default SubMenu;