import React from 'react';
import '../style/legalPage.css';

// Les passages entre crochets [ ... ] sont à compléter avec les vraies informations de l'entreprise
const MentionsLegales = () => {
    return (
        <main className="legal-page">
            <div className="legal-inner">
                <span className="legal-eyebrow">Informations légales</span>
                <h1 className="legal-title">Mentions légales</h1>
                <div className="legal-divider"></div>

                <section>
                    <h2>1. Éditeur du site</h2>
                    <p>
                        Le site « Le temps d'une tasse » est édité par [forme juridique et raison sociale],
                        au capital de [montant] €, immatriculée au RCS de [ville] sous le numéro [SIRET].
                    </p>
                    <p>
                        Siège social : [adresse complète], Provence, France.<br/>
                        Numéro de TVA intracommunautaire : [numéro].<br/>
                        Directeur de la publication : [nom et prénom].
                    </p>
                </section>

                <section>
                    <h2>2. Contact</h2>
                    <p>
                        Par e-mail : <a href="mailto:bonjour@letempsdunetasse.fr">bonjour@letempsdunetasse.fr</a><br/>
                        Par téléphone : 04 90 00 00 00 (du lundi au vendredi, 9h–18h).
                    </p>
                </section>

                <section>
                    <h2>3. Hébergement</h2>
                    <p>
                        Le site est hébergé par [nom de l'hébergeur], [adresse de l'hébergeur],
                        [téléphone ou site de l'hébergeur].
                    </p>
                </section>

                <section>
                    <h2>4. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble des contenus de ce site (textes, images, logos, graphismes, structure) est
                        protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de
                        l'éditeur, sauf mention contraire. Toute reproduction, représentation ou diffusion,
                        totale ou partielle, sans autorisation écrite préalable est interdite.
                    </p>
                </section>

                <section>
                    <h2>5. Données personnelles</h2>
                    <p>
                        Les informations recueillies via le formulaire de contact, la création de compte ou
                        une commande (nom, adresse e-mail, téléphone, adresse postale) sont utilisées
                        uniquement pour répondre à vos demandes et traiter vos commandes. Elles ne sont ni
                        vendues ni cédées à des tiers.
                    </p>
                    <p>
                        Conformément au Règlement général sur la protection des données (RGPD) et à la loi
                        « Informatique et Libertés », vous disposez d'un droit d'accès, de rectification,
                        d'effacement, d'opposition et de portabilité de vos données. Pour l'exercer,
                        écrivez-nous à <a href="mailto:bonjour@letempsdunetasse.fr">bonjour@letempsdunetasse.fr</a>.
                        Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).
                    </p>
                </section>

                <section>
                    <h2>6. Cookies</h2>
                    <p>
                        Ce site utilise des cookies strictement nécessaires à son fonctionnement (connexion à
                        votre compte, panier). Ils ne requièrent pas votre consentement. Les cookies
                        facultatifs, tels que la mesure d'audience, ne sont déposés qu'avec votre accord, que
                        vous pouvez modifier à tout moment en effaçant les données de ce site dans votre
                        navigateur.
                    </p>
                </section>

                <section>
                    <h2>7. Responsabilité</h2>
                    <p>
                        L'éditeur s'efforce de fournir des informations exactes et à jour, mais ne peut
                        garantir l'absence d'erreurs ou d'omissions. Il ne saurait être tenu responsable de
                        l'usage fait des informations publiées, ni des sites tiers vers lesquels pointeraient
                        des liens.
                    </p>
                </section>

                <section>
                    <h2>8. Droit applicable</h2>
                    <p>
                        Les présentes mentions légales sont soumises au droit français. En cas de litige, les
                        tribunaux français sont seuls compétents.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default MentionsLegales;
