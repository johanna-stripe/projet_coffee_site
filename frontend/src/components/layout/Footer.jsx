import logo from '../../assets/images/logos/leTempsDuneTasse_logo_2.png'
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="site-footer b-primary c-secondary p-30px">
            <div className="footer-top flex flex-wrap justify-content-space-between p-right-50px">
                {/* Colonne marque */}
                <div className="footer-brand flex m-0 gap-20px align-items-center">
                    <img src={logo} alt="logoLeTempsDuneTasse" className="h-150px "/>
                    <div className="flex flex-direction-column">
                    <p className="footer-text m-top-20px w-200px">
                        Brûlerie artisanale en Provence. Grains sélectionnés à la source, torréfiés avec soin, livrés
                        dans leur fraîcheur.
                    </p>
                    <div className="footer-socials flex gap-20px m-top-10px">
                        <a href="#" className="social-icon flex align-items-center justify-content-center"
                           aria-label="Instagram"><FaInstagram size={17} /></a>
                        <a href="#" className="social-icon flex align-items-center justify-content-center"
                           aria-label="Facebook"><FaFacebook size={17} />
                        </a>
                        <a href="#" className="social-icon flex align-items-center justify-content-center"
                           aria-label="Pinterest"><FaPinterest size={17}  />
                        </a>
                        <a href="#" className="social-icon flex align-items-center justify-content-center"
                           aria-label="Tiktok"><FaTiktok size={17} />
                        </a>
                    </div>
                    </div>
                </div>

                {/* Colonne Boutique */}
                <nav className="footer-nav flex flex-direction-column">
                    <p className="letter-spacing-3px uppercase font-size-085em c-tertiary">Boutique</p>
                    <ul className="footer-links list-none p-0 m-0 flex flex-direction-column gap-12px">
                        <li><a href="#" className="c-secondary text-decoration-none">Café grain</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">Café moulu</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">Thé</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">Infusions</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">Accessoires</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">Machines</a></li>
                    </ul>
                </nav>

                {/* Colonne Informations */}
                <nav className="footer-nav flex flex-direction-column">
                    <p className="letter-spacing-3px uppercase font-size-085em c-tertiary">Informations</p>
                    <ul className="footer-links list-none p-0 m-0 flex flex-direction-column gap-12px">
                        <li><a href="#" className="c-secondary text-decoration-none">Notre brûlerie</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">Contact</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">FAQ</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">Mentions légales</a></li>
                        <li><a href="#" className="c-secondary text-decoration-none">CGV</a></li>
                    </ul>
                </nav>

                {/* Colonne Newsletter */}
                <div className="footer-newsletter flex flex-direction-column max-w-300px">
                    <p className="letter-spacing-3px uppercase font-size-085em c-tertiary">Restez informé</p>
                    <p className="footer-text m-top-10px">
                        Nouveaux arrivages, événements brûlerie, offres exclusives — directement dans votre boîte.
                    </p>
                    <form className="newsletter-form flex flex-direction-column gap-10px m-top-20px">
                        <input
                            type="email"
                            placeholder="votre@email.fr"
                            className="newsletter-input w-100 p-10px b-transparent border-tertiary c-white form-placeholder"
                            required
                        />
                        <button type="submit"
                                className="newsletter-submit uppercase letter-spacing-1px c-white b-quaternary p-12px cursor-pointer">
                            S'abonner
                        </button>
                    </form>
                </div>

            </div>

            <div className="footer-divider border-top-tertiary m-top-40px m-bottom-20px"></div>

            <div className="footer-bottom flex flex-wrap justify-content-space-between align-items-center">
                <p className="footer-copyright c-tertiary m-0">
                    © 2024 Le temps d'une tasse — Tous droits réservés
                </p>
                <div className="footer-payments flex align-items-center gap-15px">
                    <span className="c-tertiary">Visa</span>
                    <span className="c-tertiary">Mastercard</span>
                    <span className="c-tertiary">PayPal</span>
                    <span className="c-tertiary">Amex</span>
                </div>
            </div>
        </footer>)
}

export default Footer;