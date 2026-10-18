//================= IMPORTS=====================
import React from "react";
import '../style/accueil.css';

//=================CHILDREN IMPORTS=====================
import Slider from "../components/Slider.jsx";
//On importe le composant enfant Slider pour pouvoir l'utiliser comme une balise JSX (<Slider />) plus bas.
// C'est exactement comme importer une fonction — parce qu'un composant React est une fonction.
import Selection from "../components/Selection.jsx";
import SelectionClient from "./SelectionClient.jsx";
import History from "../components/History.jsx";
import TrustBadges from "../components/TrustBadges.jsx";

//=================IMAGES IMPORTS=====================
import coffeeBeanSlider from '../assets/images/coffee/coffee_bean_slider.jpg';
import coffeeSliderMorning from '../assets/images/coffee/coffee_slider_morning.png'
import teaSlider from '../assets/images/tea/tea_4.jpg';

import coffeeSelection from '../assets/images/coffee/coffee_grain_moulu.jpg'
import teaSelection from '../assets/images/tea/tea.jpg';
import coffeeMachineSelection from '../assets/images/coffee_machine/machine_cafe_1.jpg';
import accessoiresSelection from '../assets/images/accessories/accessoire.jpg';


const slides = [
    {
        img: coffeeBeanSlider,
        alt: "L'art du café en grains",
        eyebrow: "Torréfaction artisanale",
        title: "L'art du café en grains",
        text: "Sélectionnés à la source, torréfiés dans notre atelier.",
        cta: "Découvrir nos cafés",
    },
    {
        img: coffeeSliderMorning,
        alt: "Le rituel du matin",
        eyebrow: "Torréfaction artisanale",
        title: "Le rituel du matin",
        text: "Chaque tasse raconte l'histoire d'un terroir unique.",
        cta: "Explorez la sélection",
    },
    {
        img: teaSlider,
        alt: "Thé et infusions d'exception",
        eyebrow: "Torréfaction artisanale",
        title: "Thé et infusions d'exception",
        text: "Des feuilles soigneusement choisies pour chaque moment",
        cta: "Voir les thés et infusions",
    },
];
/*
C'est un tableau d'objets. Chaque objet représente un slide avec toutes ses infos (image, titre, texte, etc.).
Placé en dehors du composant Accueil --> Comme ce tableau ne dépend de rien et ne change jamais, il n'a pas besoin d'être recréé à chaque fois que le composant se rafraîchit.
S'il était à l'intérieur du composant, il serait recréé (nouvel objet en mémoire) à chaque rendu, ce qui est du gaspillage inutile.
 */

const selections = [
    {
        img: coffeeSelection,
        alt: "café_grain_moulu",
        title: "Café grain & moulu" ,
        cta: "Découvrir ❯"
    },
    {
        img: teaSelection,
        alt: "thé-et-infusions",
        title: "Thé & infusion" ,
        cta: "Découvrir ❯"
    },
    {
        img: coffeeMachineSelection,
        alt: "cafetière",
        title: "Cafetière & théière" ,
        cta: "Découvrir ❯"
    },
    {
        img: accessoiresSelection,
        alt: "accessoire-thé",
        title: "Accessoires" ,
        cta: "Découvrir ❯"
    },

]

const selectionClient = [
    {
        img: coffeeBeanSlider,
        alt: "coffee-bean",
        origin:"Etiopie" ,
        coffeeName: "Éthiopie Yirgacheffe\n",
        parfums: "Floral, agrumes, jasmin",
        price: "14,90€",
    },
    {
        img: coffeeBeanSlider,
        alt: "coffee-bean",
        origin:"Etiopie" ,
        coffeeName: "Éthiopie Yirgacheffe\n",
        parfums: "Floral, agrumes, jasmin",
        price: "14,90€",
    },
    {
        img: coffeeBeanSlider,
        alt: "coffee-bean",
        origin:"Etiopie" ,
        coffeeName: "Éthiopie Yirgacheffe\n",
        parfums: "Floral, agrumes, jasmin",
        price: "14,90€",
    },
    {
        img: coffeeBeanSlider,
        alt: "coffee-bean",
        origin:"Etiopie" ,
        coffeeName: "Éthiopie Yirgacheffe\n",
        parfums: "Floral, agrumes, jasmin",
        price: "14,90€",
    },
    {
        img: coffeeBeanSlider,
        alt: "coffee-bean",
        origin:"Etiopie" ,
        coffeeName: "Éthiopie Yirgacheffe\n",
        parfums: "Floral, agrumes, jasmin",
        price: "14,90€",
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
            <SelectionClient selectionClient={selectionClient}/>
            <History/>
        </>
    );
};
//<>...</> : un Fragment. On l'utilise car return ne peut renvoyer qu'un seul élément racine ;

export default Accueil;


