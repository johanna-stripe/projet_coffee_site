import '../../style/navBar.css';

import logo2 from '../../assets/images/logos/leTempsDuneTasse_logo.png'
import {FaRegUser} from "react-icons/fa";
import {PiBasket} from "react-icons/pi";
import {IoSearch, IoMenu, IoClose} from "react-icons/io5";
import useMediaQuery from "../../helper/useMediaQuery.js";
import AuthModal from "../auth/AuthModal.jsx";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import UserAccount from "../user/UserAccount.jsx";
import SubMenu from "./SubMenu.jsx";
import {Link} from "react-router-dom";
import {CLIENT_PATHS} from "../../routes/paths.js";
import {useCart} from "../../context/CartContext.jsx";

const NavBar = () => {
    const navRef = useRef(null)
    const [subMenuPos, setSubMenuPos] = useState({top: 0, gap: 0})
    const [activeCategory, setActiveCategory] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [menuOpen, setMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [navHeight, setNavHeight] = useState(0) // hauteur de la barre complète, gardée en réserve quand elle passe en fixed
    const [isHovered, setIsHovered] = useState(false) // survol de la barre : elle se redéplie (menu + sous-menus visibles)
    const scrolledRef = useRef(false)
    // Sous 900px : menu burger, sous-menus en accordéon au clic (pas de survol sur écran tactile)
    const isMobile = useMediaQuery("(max-width: 900px)")
    const {user, isAuthenticated, logout, isAuthModalOpen, openAuthModal, closeAuthModal, isAccountOpen, accountTab, openAccount, closeAccount} = useAuth()
    const {items, openCart} = useCart()
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)


    useEffect(() => {
        // au-delà de 80px de scroll, la barre passe en version compacte (cf. .navBar--scrolled dans navBar.css)
        const handleScroll = () => {
            const scrolled = window.scrollY > 80
            if (scrolled === scrolledRef.current) return
            // on mesure la barre AVANT qu'elle rétrécisse : un placeholder de même hauteur
            // évite que le contenu de la page saute vers le haut (bug du premier scroll)
            if (scrolled && navRef.current) setNavHeight(navRef.current.offsetHeight)
            scrolledRef.current = scrolled
            setIsScrolled(scrolled)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, {passive: true})
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const menuItems = [
        {label: "Café", category: "café"},
        {label: "Thé & Infusion", category: "thé & infusions"},
        {label: "Machines", category: "machines"},
        {label: "Accessoires", category: "accessoires"},
        {label: "Qui sommes-nous ?", targetId: "brulerie"},
    ]

    const openSubMenu = (e, category) => {
        const li = e.currentTarget.getBoundingClientRect()
        const nav = navRef.current.getBoundingClientRect()
        setSubMenuPos({
            top: li.bottom,
            left: li.left,
            gap: nav.bottom - li.bottom,
        })
        setActiveCategory(category)
    }

    const closeMenu = () => {
        setActiveCategory(null)
        setMenuOpen(false)
    }

    const handleItemClick = (item) => {
        if (item.targetId) {
            scrollToSection(item.targetId)
            closeMenu()
        } else if (isMobile && item.category) {
            setActiveCategory((prev) => (prev === item.category ? null : item.category))
        }
    }

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({behavior: "smooth", block: "start"})
        //?. optional chaining --> si ce qui est à gauche existe, continue ; sinon, arrête-toi sans erreur
    }

    // version compacte uniquement sur ordinateur : le mobile a déjà sa barre réduite
    // fixée en haut dès qu'on a scrollé (même dépliée au survol), réduite seulement si on ne la survole pas
    const isFixed = isScrolled && !isMobile
    const isCompact = isFixed && !isHovered

    return (
        <>
            {isFixed && <div style={{height: navHeight}} aria-hidden="true"/>}
            <div ref={navRef}
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
                 className={`navBar p-top-5px p-bottom-5px ${isFixed ? "navBar--fixed" : ""} ${isCompact ? "navBar--scrolled" : ""}`}>
                <button
                    type="button"
                    className="navBar-burger"
                    aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <IoClose size={28}/> : <IoMenu size={28}/>}
                </button>

                <div className="logo">
                    <Link
                        to={CLIENT_PATHS.home}
                        onClick={closeMenu}>
                        <img
                            src={logo2}
                            alt="logoleTempsdUneTasse"
                            className="h-120px cursor-pointer"
                        />
                    </Link>
                </div>

                <form className="searchBar" role="search" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="search"
                        className="searchBar-input"
                        placeholder="Rechercher..."
                        aria-label="Rechercher un produit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="searchBar-btn" aria-label="Lancer la recherche">
                        <IoSearch size={21} className="icon"/>
                    </button>
                </form>

                <div className={`menu align-self-center ${menuOpen ? "menu--open" : ""}`}>
                    <ul className="c-secondary flex gap-40px list-none font-size-15px">
                        {menuItems.map((item => (
                            <li
                                key={item.label}
                                className="position-relative cursor-pointer"
                                onMouseEnter={item.category && !isMobile ? (e) => openSubMenu(e, item.category) : undefined}
                                onMouseLeave={!isMobile ? () => setActiveCategory(null) : undefined}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.label}
                                {item.category && (
                                    <SubMenu
                                        isOpen={activeCategory === item.category}
                                        category={item.category}
                                        top={subMenuPos.top}
                                        left={subMenuPos.left}
                                        gap={subMenuPos.gap}
                                        inline={isMobile}
                                        onNavigate={closeMenu}
                                    />
                                )}
                            </li>
                        )))}
                    </ul>
                </div>

                <div className="navBar-actions flex flex-direction-column align-content-center">
                    <p className="font-size-125em c-tertiary">
                        {isAuthenticated ? `Bienvenue ${user.first_name}` : ""}</p>
                    <div className="icons flex gap-30px align-self-center">
                        <FaRegUser
                            size={20}
                            className={"icon cursor-pointer"}
                            alt={"user-icon"}
                            onClick={() => {
                                isAuthenticated ? openAccount() : openAuthModal()
                            }}
                        />
                        <span className="navBar-basket cursor-pointer" onClick={openCart}>
                        <PiBasket
                            size={24}
                            className={"icon cursor-pointer"}
                            alt={"basket-icon"}
                        />{itemCount > 0 && <span className="navBar-basket__badge">{itemCount}</span>}
                        {/* si la condition est vraie, affiche le <span> ; sinon, n'affiche rien */}
                        </span>
                    </div>
                    <AuthModal
                        //Au clic de userIcon on a passé openAuthModal()
                        isOpen={isAuthModalOpen}
                        //React prend la valeur actuelle de isAuthModalOpen (donc true) et la met dans un objet : { isOpen: true }.
                        //Donc équivaut maintenant à <AuthModal isOpen={true} .../>
                        onClose={closeAuthModal}
                    />
                    <UserAccount
                        isOpen={isAccountOpen}
                        initialMode={accountTab}
                        onClose={closeAccount}
                        onLogout={logout}
                    />
                </div>
            </div>
        </>
    )
}

export default NavBar;