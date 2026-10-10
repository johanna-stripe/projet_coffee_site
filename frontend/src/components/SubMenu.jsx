import React from 'react';
import "../style/authModal.css"

const subMenus = [
    {
        categoryParent :"café",
        category: "Café grain",
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
        "Cafés d’Asie",
        "Cafés d’Éthiopie",
        "Cafés d’Amérique",
        "Cafés du Brésil",
        "Cafés du Nicaragua"
        ]
    },
    {
        categoryParent :"thé & infusions",
        category: "Nos thés",
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
        category: "Machines",
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
        category: "Accessoires",
        subCategories: [
            "Accessoires café",
            "Accessoires thé",
            "Moulin à café",
            "Bouilloire",
            "Théière",
        ]
    },
]

const SubMenu = ({isOpen, category, top, left, gap}) => {

    if (!isOpen) return null;

    const filtered = subMenus.filter((s) => s.categoryParent === category)

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
            <div className="sub-menu b-primary flex "
                 style={{gap: 100, padding: "10px 40px"}}
            >
                    {filtered.map((subMenu) => (
                        <div key={subMenu.category}>
                            <h4>{subMenu.category}</h4>
                            {subMenu.subCategories.map((sub) => (
                                <p key={sub}>{sub}</p>
                            ))}
                        </div>
                    ))}

            </div>
        </div>
    )
};

export default SubMenu;