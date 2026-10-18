import React from 'react'
import shieldCheck from "../assets/icons/shield-check.svg"
import delivery from "../assets/icons/truck.svg"
import star from "../assets/icons/star.svg"

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

const TrustBadges = () => {
    return (
        <section className="trustBadges flex justify-content-space-evenly b-quaternary h-250px align-items-center">
            {trustBadges.map((item, index) => (
                <React.Fragment key={index}>
                {/*React.Fragment (ou Fragment) est un composant "invisible" qui sert à grouper plusieurs éléments sans ajouter de balise HTML supplémentaire dans le DOM.*/}
                    <div
                        className="flex flex-direction-column align-items-center text-align-center w-300px">
                        <img src={item.img}
                             alt={item.alt}/>
                        <p className="font-size-150em c-primary">{item.title}</p>
                        <p className="c-primary">{item.text}</p>
                    </div>
                    {index < trustBadges.length - 1 && (
                    //condition (si la chose à gauche de && est vraie alors la chose à droite d'execute) qui exclut le dernier item (index 2 sur 3), donc tu obtiens bien 2 traits pour 3 blocs
                        <div className="h-150px b-right-1px"></div>
                    )}
                </React.Fragment>
            ))}
        </section>
    )
}


export default TrustBadges