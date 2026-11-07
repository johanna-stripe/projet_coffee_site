import React from 'react';
import '../style/legalPage.css';

// Les passages entre crochets [ ... ] sont à compléter avec les vraies informations de l'entreprise
const Cgv = () => {
    return (
        <main className="legal-page">
            <div className="legal-inner">
                <span className="legal-eyebrow">Informations légales</span>
                <h1 className="legal-title">Conditions générales de vente</h1>
                <div className="legal-divider"></div>

                <section>
                    <h2>1. Objet et champ d'application</h2>
                    <p>
                        Les présentes conditions générales de vente (CGV) régissent les ventes de cafés, thés,
                        infusions, machines et accessoires réalisées sur le site « Le temps d'une tasse »,
                        édité par [raison sociale] (voir les mentions légales), auprès de clients consommateurs.
                        Toute commande implique l'acceptation sans réserve des présentes CGV.
                    </p>
                </section>

                <section>
                    <h2>2. Produits</h2>
                    <p>
                        Les produits proposés sont décrits avec la plus grande exactitude possible. Les
                        photographies n'ont pas de valeur contractuelle : de légères variations de couleur,
                        de présentation ou de profil aromatique peuvent exister, notamment d'une récolte à
                        l'autre. Les offres sont valables dans la limite des stocks disponibles.
                    </p>
                </section>

                <section>
                    <h2>3. Prix</h2>
                    <p>
                        Les prix sont indiqués en euros, toutes taxes comprises (TVA française en vigueur),
                        hors frais de livraison. Ces frais sont précisés avant la validation de la commande.
                        Nous nous réservons le droit de modifier nos prix à tout moment ; les produits sont
                        facturés au prix en vigueur au moment de la validation de la commande.
                    </p>
                </section>

                <section>
                    <h2>4. Commande</h2>
                    <p>
                        La commande est passée en ligne après création d'un compte. Elle est définitive une
                        fois le paiement validé et la confirmation de commande envoyée par e-mail. Nous nous
                        réservons le droit d'annuler ou de refuser toute commande en cas de litige existant
                        avec le client, de paiement incomplet ou de produit indisponible ; le client en est
                        alors informé et remboursé le cas échéant.
                    </p>
                </section>

                <section>
                    <h2>5. Paiement</h2>
                    <p>
                        Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard, American
                        Express) ou par PayPal. Le montant est débité au moment de la validation de la
                        commande. Les transactions sont sécurisées par [prestataire de paiement] ; nous ne
                        conservons aucune donnée bancaire.
                    </p>
                </section>

                <section>
                    <h2>6. Livraison</h2>
                    <p>
                        Nos produits sont expédiés en France métropolitaine [et dans les pays suivants : ...].
                        Les cafés sont torréfiés en petits lots et quittent notre atelier dans les 48 heures
                        suivant la torréfaction. Les délais de livraison indicatifs sont de [x] à [y] jours
                        ouvrés après l'expédition, par [transporteur]. Les frais de livraison sont
                        [barème : montant, gratuité à partir de ... €].
                    </p>
                    <p>
                        En cas de retard ou de colis endommagé, le client est invité à nous contacter dans les
                        meilleurs délais à <a href="mailto:bonjour@letempsdunetasse.fr">bonjour@letempsdunetasse.fr</a>
                        et à formuler des réserves auprès du transporteur à la réception.
                    </p>
                </section>

                <section>
                    <h2>7. Droit de rétractation</h2>
                    <p>
                        Conformément à l'article L221-18 du Code de la consommation, le client dispose de
                        14 jours à compter de la réception de sa commande pour exercer son droit de
                        rétractation, sans avoir à justifier de motif. Les produits doivent être retournés
                        dans leur emballage d'origine, en parfait état, à [adresse de retour]. Les frais de
                        retour sont à la charge du client.
                    </p>
                    <p>
                        Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation
                        ne s'applique pas aux produits alimentaires susceptibles de se détériorer ou de se
                        périmer rapidement, ni aux produits descellés qui ne peuvent être renvoyés pour des
                        raisons d'hygiène ou de protection de la santé. Les cafés, thés et infusions ouverts
                        sont donc exclus du droit de rétractation.
                    </p>
                    <p>
                        En cas de rétractation valable, le remboursement intervient dans un délai maximum de
                        14 jours suivant la réception du retour, par le même moyen de paiement que celui
                        utilisé pour la commande.
                    </p>
                </section>

                <section>
                    <h2>8. Garanties légales</h2>
                    <p>
                        Tous nos produits bénéficient de la garantie légale de conformité (articles L217-3 et
                        suivants du Code de la consommation) et de la garantie contre les vices cachés
                        (articles 1641 et suivants du Code civil). Pour les machines et accessoires, la
                        garantie légale de conformité est de 2 ans à compter de la délivrance du bien. Pour
                        toute réclamation, contactez-nous en joignant votre numéro de commande et, si
                        possible, des photographies du produit concerné.
                    </p>
                </section>

                <section>
                    <h2>9. Responsabilité</h2>
                    <p>
                        Notre responsabilité ne saurait être engagée en cas d'inexécution du contrat due à un
                        cas de force majeure ou à un fait imputable au client ou à un tiers. Les conseils de
                        préparation et de dégustation sont donnés à titre indicatif.
                    </p>
                </section>

                <section>
                    <h2>10. Données personnelles</h2>
                    <p>
                        Les données collectées lors de la commande sont nécessaires à son traitement et à la
                        livraison. Leur traitement est décrit dans la section « Données personnelles » des
                        mentions légales, qui précise également vos droits.
                    </p>
                </section>

                <section>
                    <h2>11. Litiges et médiation</h2>
                    <p>
                        Les présentes CGV sont soumises au droit français. En cas de litige, le client est
                        invité à nous contacter en premier lieu pour rechercher une solution amiable.
                        Conformément aux articles L611-1 et suivants du Code de la consommation, il peut
                        ensuite recourir gratuitement au médiateur de la consommation suivant :
                        [nom et coordonnées du médiateur]. À défaut d'accord amiable, les tribunaux français
                        sont compétents.
                    </p>
                </section>

                <p className="legal-update">Dernière mise à jour : [date].</p>
            </div>
        </main>
    );
};

export default Cgv;
