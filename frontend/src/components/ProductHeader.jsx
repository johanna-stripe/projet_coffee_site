import React from 'react';
import cafeGrains from '../assets/images/coffee/cafe_grains(3).jpg';
import cafeMoulu from '../assets/images/coffee/cafe_moulu.jpg';
import the from '../assets/images/tea/tea_5.jpg';
import infusion from '../assets/images/tea/tea_3(v2).jpg';
import machines from '../assets/images/coffee_machine/machine_cafe_2.jpg';
import accessoires from '../assets/images/accessories/accessoire_2.jpg';

const headers = {
    1: {
        subtitle: "La boutique café",
        title: "Café grain",
        description: "Des cafés de spécialité sélectionnés à la source puis torréfiés en petits lots, pour révéler le caractère singulier de chaque terroir.",
        image: cafeGrains,
    },
    2: {
        subtitle: "La boutique café",
        title: "Café moulu",
        description: "Moulu avec soin pour une extraction parfaite : le même caractère que nos grains, prêt à infuser dans votre cafetière, filtre ou piston.",
        image: cafeMoulu
    },
    3: {
        subtitle: "La boutique thé",
        title: "Thé",
        description: "Des thés verts, noirs et blancs choisis auprès de petits producteurs, pour des tasses fines, parfumées et pleines de nuances.",
        image: the
    },
    4: {
        subtitle: "La boutique infusion",
        title: "Infusion",
        description: "Plantes, fleurs et fruits séchés assemblés avec soin, pour des infusions douces et naturelles à savourer à toute heure.",
        image: infusion
    },
    5: {
        subtitle: "La boutique matériel",
        title: "Machines à café",
        description: "Des machines fiables et élégantes, des expressos traditionnels aux modèles avec broyeur intégré, pour un café de qualité chez vous.",
        image: machines
    },
    6: {
        subtitle: "La boutique accessoires",
        title: "Accessoires",
        description: "Tasses, théières, moulins et ustensiles : tout ce qu'il faut pour préparer et déguster vos boissons dans les meilleures conditions.",
        image: accessoires
    }
}

const headers2 = {
    1: {
        subtitle: "Fraîchement torréfiés",
        title: "Trouvez le grain qui vous ressemble",
        description: "Fruité et délicat, rond et gourmand ou puissant et corsé : explorez nos origines pures. Chaque sachet indique le terroir, l'altitude et le profil aromatique pour vous guider simplement vers votre prochaine tasse.",
    },
    2: {
        subtitle: "Prêt à infuser",
        title: "Trouvez la mouture qui vous convient",
        description: "Fine pour l'expresso, moyenne pour le filtre, grossière pour le piston : choisissez la mouture adaptée à votre méthode. Chaque paquet précise l'origine, le profil aromatique et la mouture recommandée pour une extraction réussie.",
    },
    3: {
        subtitle: "Cueillis avec soin",
        title: "Trouvez le thé de votre moment",
        description: "Vif et végétal, rond et malté ou délicatement floral : voyagez des jardins japonais aux montagnes taïwanaises. Chaque thé est accompagné de son origine et de son profil aromatique pour vous guider vers une infusion juste.",
    },
    4: {
        subtitle: "Douceur naturelle",
        title: "Trouvez l'infusion de votre détente",
        description: "Apaisante, tonique ou gourmande : explorez nos plantes, fleurs et fruits assemblés avec soin. Chaque infusion indique sa composition, ses arômes et son temps de préparation pour vous guider vers la tasse idéale.",
    },
    5: {
        subtitle: "Le café à la maison",
        title: "Trouvez la machine qui vous correspond",
        description: "Expresso traditionnel, machine à grains ou modèle automatique : comparez la pression, la capacité du réservoir et la présence d'un broyeur intégré pour choisir l'équipement adapté à votre façon de préparer le café.",
    },
    6: {
        subtitle: "Les indispensables",
        title: "Trouvez l'accessoire qui fait la différence",
        description: "Tasses, théières, moulins, filtres : retrouvez la matière, la contenance et la couleur de chaque pièce pour préparer et déguster vos boissons dans les meilleures conditions.",
    },
}


const ProductHeader = ({categoryId}) => {

    const header = headers[categoryId]
    const header2 = headers2 [categoryId]
    if (!header) return null

    return (
        <>
            <div>
                <div className="product-header p-left-right-40px">
                    <img className="product-header__image" src={header.image} alt=""/>

                    <div className="product-header__content">
                        <h4 className="product-header__subtitle">{header.subtitle}</h4>
                        <h1 className="product-header__title">{header.title}</h1>
                        <p className="product-header__description">{header.description}</p>
                    </div>
                </div>
                <div className="flex gap-80px m-40px m-top-100px m-bottom-60px">
                    <div className="m-left-50px">
                    <h4 className="product-header2__subtitle">{header2.subtitle}</h4>
                    <h1 className="product-header2__title">{header2.title}</h1>
                    </div>
                    <p className="product-header2__description m-right-50px">{header2.description}</p>
                </div>
            </div>
        </>
    );
};

export default ProductHeader;
