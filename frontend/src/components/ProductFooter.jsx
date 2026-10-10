import React from 'react';
import '../style/ProductFooter.css';

const footers = {
    1: {
        title1: "Torréfié chaque semaine",
        subtitle1: "En petits lots dans notre atelier provençal.",
        title2: "Expédié sous 48 h",
        subtitle2: "Pour préserver toute la fraîcheur aromatique.",
        title3: "À votre écoute",
        subtitle3: "Nos torréfacteurs vous conseillent selon vos goûts."
    },
    2: {
        title1: "Moulu à la commande",
        subtitle1: "Choisissez la mouture adaptée à votre cafetière ou à votre filtre.",
        title2: "Expédié sous 48 h",
        subtitle2: "Pour préserver toute la fraîcheur aromatique.",
        title3: "À votre écoute",
        subtitle3: "Nos torréfacteurs vous conseillent selon votre méthode d'extraction."
    },
    3: {
        title1: "Feuilles entières",
        subtitle1: "Des récoltes choisies pour leur qualité et leur fraîcheur.",
        title2: "Conseils d'infusion",
        subtitle2: "Température et durée indiquées pour révéler chaque thé.",
        title3: "Sourcé avec exigence",
        subtitle3: "Des jardins sélectionnés pour leur savoir-faire."
    },
    4: {
        title1: "Plantes et fleurs entières",
        subtitle1: "Des ingrédients naturels, sélectionnés pour leurs arômes et leurs bienfaits.",
        title2: "Conseils de préparation",
        subtitle2: "Dosage, température et temps d'infusion pour chaque recette.",
        title3: "Assemblés avec soin",
        subtitle3: "Des mélanges équilibrés, pensés pour chaque moment de la journée."
    },
    5: {
        title1: "Machines sélectionnées",
        subtitle1: "Des modèles éprouvés, choisis pour leur fiabilité et la qualité en tasse.",
        title2: "Conseils d'experts",
        subtitle2: "Nous vous aidons à choisir la machine adaptée à votre usage.",
        title3: "Garantie et entretien",
        subtitle3: "Un accompagnement pour faire durer votre machine."
    },
    6: {
        title1: "Pensés pour l'usage",
        subtitle1: "Des accessoires choisis pour leur qualité et leur durabilité.",
        title2: "Pour toutes les méthodes",
        subtitle2: "Moulins, filtres, tasses et théières pour préparer chaque boisson.",
        title3: "Idées cadeaux",
        subtitle3: "Des pièces élégantes à offrir ou à s'offrir."
    }
}


const ProductFooter = ({categoryId}) => {

    const footer = footers[categoryId]
    if (!footer) return null

    // On regroupe title1/subtitle1, title2/subtitle2... en une liste de 3 blocs
    const items = [1, 2, 3].map((n) => ({
        title: footer[`title${n}`],
        subtitle: footer[`subtitle${n}`]
    }))

    return (
        <footer className="product-footer">
            {items.map((item, index) => (
                <div key={index} className="product-footer__item">
                    <span className="product-footer__number">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                        <h3 className="product-footer__title">{item.title}</h3>
                        <p className="product-footer__subtitle">{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </footer>
    );
};

export default ProductFooter;
