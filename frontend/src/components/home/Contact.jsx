import React, {useState} from 'react';
import api from '../../axios/axiosConfig.js';
import '../../style/contact.css';

const DEMANDES = [
    'Conseil produit',
    'Suivi de commande',
    'Demande professionnelle',
    'Autre demande',
];

const EMPTY_FORM = {nom: '', email: '', telephone: '', demande: '', message: '', consentement: false};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{6,15}$/;

const Contact = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    // Met à jour le champ modifié grâce à son attribut name (checkbox : checked au lieu de value)
    const handleChange = (e) => {
        const {name, type, checked, value} = e.target;
        setForm({...form, [name]: type === 'checkbox' ? checked : value});
        setErrors({...errors, [name]: undefined, global: undefined});
    };

    const validate = () => {
        const newErrors = {};
        if (!form.nom.trim()) newErrors.nom = 'Veuillez indiquer votre prénom et nom.';
        if (!form.email.trim()) newErrors.email = 'Veuillez indiquer votre e-mail.';
        else if (!EMAIL_REGEX.test(form.email.trim())) newErrors.email = 'Adresse e-mail invalide.';
        if (form.telephone.trim() && !PHONE_REGEX.test(form.telephone.trim().replace(/[\s.\-()]/g, ''))) {
            newErrors.telephone = 'Numéro de téléphone invalide.';
        }
        if (!DEMANDES.includes(form.demande)) newErrors.demande = 'Veuillez choisir un sujet.';
        if (!form.message.trim()) newErrors.message = 'Veuillez écrire votre message.';
        else if (form.message.trim().length < 10) newErrors.message = 'Votre message est trop court (10 caractères minimum).';
        if (!form.consentement) newErrors.consentement = 'Votre accord est nécessaire pour envoyer le message.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSending(true);
        try {
            await api.post('/contact', form);
            setSent(true);
            setForm(EMPTY_FORM);
        } catch (error) {
            const status = error.response?.status;
            setErrors({
                global: status === 429
                    ? 'Trop de tentatives, réessayez dans une minute.'
                    : "Une erreur est survenue, votre message n'a pas pu être envoyé."
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact" className="contact">
            <div className="contact-inner">
                <div className="contact-infos">
                    <span className="contact-eyebrow">Parlons café</span>
                    <h2 className="contact-title">
                        Une question, <br/>
                        <em>une envie ?</em>
                    </h2>
                    <div className="contact-divider"></div>
                    <p className="contact-intro text-align-justify">
                        Besoin d'un conseil pour choisir votre café, d'informations sur une commande ou envie
                        de travailler avec notre brûlerie ? Écrivez-nous, notre équipe vous répond sous deux
                        jours ouvrés.
                    </p>

                    <div className="contact-coords">
                        <div className="contact-coord">
                            <span className="contact-coord-icon" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="5" width="18" height="14" rx="1"/>
                                    <path d="M3 6l9 7 9-7"/>
                                </svg>
                            </span>
                            <div>
                                <span className="contact-coord-label">Par e-mail</span>
                                <span className="contact-coord-value">bonjour@letempsdunetasse.fr</span>
                            </div>
                        </div>
                        <div className="contact-coord">
                            <span className="contact-coord-icon" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>
                                </svg>
                            </span>
                            <div>
                                <span className="contact-coord-label">Par téléphone</span>
                                <span className="contact-coord-value">04 90 00 00 00</span>
                                <span className="contact-coord-hours">Du lundi au vendredi, 9h–18h</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-card">
                    {sent ? (
                        <div className="contact-success" role="status">
                            <h3>Merci !</h3>
                            <p>Votre message a bien été envoyé. Nous vous répondrons très vite.</p>
                            <button type="button" className="contact-btn" onClick={() => setSent(false)}>
                                Envoyer un autre message
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="contact-card-eyebrow">Formulaire de contact</span>
                            <h3 className="contact-card-title">Dites-nous tout</h3>

                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <div className="contact-field">
                                    <label htmlFor="contact-nom">Votre nom*</label>
                                    <input id="contact-nom" name="nom" type="text" placeholder="Marie Dupont"
                                           value={form.nom} onChange={handleChange}
                                           autoComplete="name" required maxLength={100}/>
                                    {errors.nom && <span className="contact-error">{errors.nom}</span>}
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="contact-email">Adresse e-mail *</label>
                                    <input id="contact-email" name="email" type="email" placeholder="vous@exemple.com"
                                           value={form.email} onChange={handleChange}
                                           autoComplete="email" required maxLength={255}/>
                                    {errors.email && <span className="contact-error">{errors.email}</span>}
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="contact-telephone">Téléphone</label>
                                    <input id="contact-telephone" name="telephone" type="tel" placeholder="06 01 23 34 56"
                                           value={form.telephone} onChange={handleChange}
                                           autoComplete="tel" maxLength={20}/>
                                    {errors.telephone && <span className="contact-error">{errors.telephone}</span>}
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="contact-demande">Votre demande *</label>
                                    <select id="contact-demande" name="demande" value={form.demande}
                                            onChange={handleChange} required>
                                        <option value="" disabled>Choisir un sujet</option>
                                        {DEMANDES.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    {errors.demande && <span className="contact-error">{errors.demande}</span>}
                                </div>

                                <div className="contact-field contact-field-full">
                                    <label htmlFor="contact-message">Votre message *</label>
                                    <textarea id="contact-message" name="message" rows="5"
                                              placeholder="Comment pouvons-nous vous aider ?"
                                              value={form.message} onChange={handleChange}
                                              required minLength={10} maxLength={5000}/>
                                    {errors.message && <span className="contact-error">{errors.message}</span>}
                                </div>

                                <div className="contact-field contact-field-full">
                                    <label className="contact-consent" htmlFor="contact-consentement">
                                        <input id="contact-consentement" name="consentement" type="checkbox"
                                               checked={form.consentement} onChange={handleChange} required/>
                                        <span>J'accepte que mes informations soient utilisées pour répondre à ma demande. *</span>
                                    </label>
                                    {errors.consentement && <span className="contact-error">{errors.consentement}</span>}
                                </div>

                                {errors.global && <span className="contact-error contact-field-full" role="alert">{errors.global}</span>}

                                <button type="submit" className="contact-btn contact-field-full" disabled={sending}>
                                    {sending ? 'Envoi…' : 'Envoyer mon message'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Contact;
