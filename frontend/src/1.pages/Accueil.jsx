//================= IMPORTS=====================
import React from "react";
import '../3.style/Accueil.css';

//=================CHILDREN IMPORTS=====================
import Slider from "../2.components/Slider.jsx";
//On importe le composant enfant Slider pour pouvoir l'utiliser comme une balise JSX (<Slider />) plus bas.
// C'est exactement comme importer une fonction — parce qu'un composant React est une fonction.
import Selection from "../2.components/Selection.jsx";
import SelectionClient from "./SelectionClient.jsx";
import History from "../2.components/History.jsx";
import TrustBadges from "../2.components/TrustBadges.jsx";

//=================IMAGES IMPORTS=====================
import coffeeBeanSlider from '../4.assets/images/coffee/coffee_bean_slider.jpg';
import coffeeSliderMorning from '../4.assets/images/coffee/coffee_slider_morning.png'
import teaSlider from '../4.assets/images/tea/tea_4.jpg';

import coffeeSelection from '../4.assets/images/coffee/coffee_grain_moulu.jpg'
import teaSelection from '../4.assets/images/tea/tea.jpg';
import coffeeMachineSelection from '../4.assets/images/coffee_machine/machine_cafe_1.jpg';
import accessoiresSelection from '../4.assets/images/accessories/accessoire.jpg';

import shieldCheck from "../4.assets/icons/shield-check.svg"
import delivery from "../4.assets/icons/truck.svg"
import star from "../4.assets/icons/star.svg"


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
//C'est un tableau d'objets. Chaque objet représente un slide avec toutes ses infos (image, titre, texte, etc.).
// Placé en dehors du composant Accueil --> Comme ce tableau ne dépend de rien et ne change jamais, il n'a pas besoin d'être recréé à chaque fois que le composant se rafraîchit.
// S'il était à l'intérieur du composant, il serait recréé (nouvel objet en mémoire) à chaque rendu, ce qui est du gaspillage inutile.

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

const trustBadges = [
    {
        img: shieldCheck,
        alt: "secured-payment-icon",
        title : "Paiement sécurisé",
        text: "Transactions SSL 256 bits. Visa, Mastercard, PayPal, Amex acceptés."
    },
    {
        img: delivery,
        alt: "delivery-truck-icon",
        title : "Livraison gratuite dès 35 €",
        text: "Expédition offerte en France métropolitaine. Colissimo 48h."
    },
    {
        img: star,
        alt: "star-icon",
        title : "Traçabilité & fraîcheur",
        text: "Grains torréfiés sous 48h. Origine, altitude et profil aromatique garantis."
    }
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
            <TrustBadges trustBadges={trustBadges}/>
        </>
    );
};
//<>...</> : un Fragment. On l'utilise car return ne peut renvoyer qu'un seul élément racine ;

export default Accueil;


