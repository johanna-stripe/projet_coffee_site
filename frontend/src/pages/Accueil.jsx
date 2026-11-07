//================= IMPORTS=====================
import React from "react";
import '../style/accueil.css';

//=================CHILDREN IMPORTS=====================
import Slider from "../components/home/Slider.jsx";
//On importe le composant enfant Slider pour pouvoir l'utiliser comme une balise JSX (<Slider />) plus bas.
// C'est exactement comme importer une fonction — parce qu'un composant React est une fonction.
import Selection from "../components/home/Selection.jsx";
import SelectionClient from "../components/home/SelectionClient.jsx";
import History from "../components/home/History.jsx";
import Contact from "../components/home/Contact.jsx";
import TrustBadges from "../components/layout/TrustBadges.jsx";

//=================IMAGES IMPORTS=====================
import coffeeBeanSlider from '../assets/images/coffee/coffee_bean_slider.jpg';
import coffeeSliderMorning from '../assets/images/coffee/coffee_slider_morning.png'
import teaSlider from '../assets/images/tea/tea_4.jpg';

import bioSelection from '../assets/icons/selection/bio.svg';
import italianSelection from '../assets/icons/selection/coffee.svg';
import specialtySelection from '../assets/icons/selection/specialty.svg';
import {CLIENT_PATHS, subCategoryPath} from "../routes/paths.js";

const slides = [
    {
        img: coffeeBeanSlider,
        alt: "L'art du café en grains",
        eyebrow: "Torréfaction artisanale",
        title: "L'art du café en grains",
        text: "Sélectionnés à la source, torréfiés dans notre atelier.",
        cta: "Découvrir nos cafés",
        path: CLIENT_PATHS.cafeGrain
    },
    {
        img: coffeeSliderMorning,
        alt: "Café moulu pour le rituel du matin",
        eyebrow: "Torréfaction artisanale",
        title: "Moulu pour votre cafetière",
        text: "Filtre, piston, italienne ou expresso : une mouture adaptée à chacune.",
        cta: "Découvrir nos cafés moulus",
        path: CLIENT_PATHS.cafeMoulu,
    },
    {
        img: teaSlider,
        alt: "Thé d'exception",
        eyebrow: "Thés du monde entier",
        title: "Thé d'exception",
        text: "Des feuilles soigneusement choisies pour chaque moment",
        cta: "Voir les thés",
        path: CLIENT_PATHS.the
    },
];
/*
C'est un tableau d'objets. Chaque objet représente un slide avec toutes ses infos (image, titre, texte, etc.).
Placé en dehors du composant Accueil --> Comme ce tableau ne dépend de rien et ne change jamais, il n'a pas besoin d'être recréé à chaque fois que le composant se rafraîchit.
S'il était à l'intérieur du composant, il serait recréé (nouvel objet en mémoire) à chaque rendu, ce qui est du gaspillage inutile.
 */

const selections = [
    {
        img: specialtySelection,
        alt: "cafés_de_spécialité",
        title: "Cafés de spécialité",
        path: subCategoryPath(CLIENT_PATHS.cafeGrain, "café en grain grand cru"),
        description: "Une gamme de cafés d'exception issus de petites productions aux profils gustatifs remarquables."
    },
    {
        img: bioSelection,
        alt: "cafés_bio",
        title: "Cafés bio",
        path: subCategoryPath(CLIENT_PATHS.cafeGrain, "café en grain biologique"),
        description: "Notre sélection de café en grain bio est certifiée biologique par le label Ecocert afin de vous garantir une agriculture respectueuse de l'environnement."
    },
    {
        img: italianSelection,
        alt: "cafés_italiens",
        title: "Cafés italiens",
        path: subCategoryPath(CLIENT_PATHS.cafeGrain, "café en grain italien"),
        description: "Les meilleurs cafés en grain italiens pour transformer votre rituel quotidien en un moment d'exception."
    },
]

//Accueil est un composant fonction : une fonction JS qui retourne du JSX (l'équivalent React du HTML).
const Accueil = () => {
    return (
        <>
            <Slider slides={slides}/>
            {/* premier 'slides=' : nom de la prop, c'est moi qui choisi */}
            {/* deuxième {slides} est la variable qu'on a définit en haut, dont on passe la valeur */}
            <Selection selections={selections}/>
            <SelectionClient/>
            <History/>
            <Contact/>
        </>
    );
};
//<>...</> : un Fragment. On l'utilise car return ne peut renvoyer qu'un seul élément racine ;

export default Accueil;


