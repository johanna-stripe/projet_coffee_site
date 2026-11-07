import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {CLIENT_PATHS} from "../../routes/paths.js";
import '../../style/cookieBanner.css';

const STORAGE_KEY = 'cookie-consent'; // "accepted" ou "refused"

// localStorage peut être indisponible (navigation privée, données bloquées) : on protège chaque accès
const readChoice = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const CookieBanner = () => {
    const [choice, setChoice] = useState(readChoice);

    if (choice) return null;

    const save = (value) => {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch {
            // pas de stockage possible : le choix ne sera valable que pour cette visite
        }
        setChoice(value);
    };

    return (
        <div className="cookie-banner" role="dialog" aria-label="Gestion des cookies">
            <div className="cookie-text">
                <span className="cookie-title">Un petit mot sur les cookies</span>
                <p>
                    Nous utilisons des cookies nécessaires au fonctionnement du site (compte, panier) et,
                    avec votre accord, des cookies facultatifs pour améliorer votre expérience.{' '}
                    <Link to={CLIENT_PATHS.mentionsLegales}>En savoir plus</Link>
                </p>
            </div>
            <div className="cookie-actions">
                <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => save('refused')}>
                    Refuser
                </button>
                <button type="button" className="cookie-btn" onClick={() => save('accepted')}>
                    Accepter
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
