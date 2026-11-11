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
import {Link, useLocation, useNavigate} from "react-router-dom";
import {CLIENT_PATHS, productPath} from "../../routes/paths.js";
import {useCart} from "../../context/CartContext.jsx";
import api from "../../axios/axiosConfig.js";
import {searchProducts} from "../../helper/search.js";

const NavBar = () => {
    const navRef = useRef(null)
    const navigate = useNavigate()
    const {pathname, state: locationState} = useLocation()
    const [subMenuPos, setSubMenuPos] = useState({top: 0, gap: 0})
    const [activeCategory, setActiveCategory] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [suggestionsOpen, setSuggestionsOpen] = useState(false) // liste de suggestions ouverte ou fermée
    const searchRef = useRef(null) // le formulaire de recherche : sert à savoir si un clic est dedans ou dehors
    const [menuOpen, setMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [navHeight, setNavHeight] = useState(0) // hauteur de la barre complète, gardée en réserve quand elle passe en fixed
    const [isHovered, setIsHovered] = useState(false) // survol de la barre : elle se redéplie (menu + sous-menus visibles)
    const [products, setProducts] = useState([])
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
            if (pathname === CLIENT_PATHS.home) {
                scrollToSection(item.targetId)
            } else {
                // la section est sur l'accueil : on y va d'abord, le défilement se fait à l'arrivée (voir le useEffect plus bas)
                navigate(CLIENT_PATHS.home, {state: {scrollTo: item.targetId}})
            }
            closeMenu()
        } else if (isMobile && item.category) {
            setActiveCategory((prev) => (prev === item.category ? null : item.category))
        }
    }

    // Envoi de la recherche : on va sur /recherche?q=... (la page filtre les produits), puis on vide le champ
    const handleSearch = (e) => {
        e.preventDefault()
        const query = searchQuery.trim()
        if (!query) return
        navigate(`${CLIENT_PATHS.search}?q=${encodeURIComponent(query)}`)
        setSearchQuery("")
        setSuggestionsOpen(false)
        closeMenu()
    }

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({behavior: "smooth", block: "start"})
        //?. optional chaining --> si ce qui est à gauche existe, continue ; sinon, arrête-toi sans erreur
    }

    // Arrivée sur l'accueil depuis une autre page avec une section à atteindre (ex : « Qui sommes-nous ? »)
    useEffect(() => {
        if (pathname === CLIENT_PATHS.home && locationState?.scrollTo) {
            scrollToSection(locationState.scrollTo)
            navigate(pathname, {replace: true, state: null})   // on efface la demande : un F5 ne refait pas défiler
        }
    }, [pathname, locationState])

    // version compacte uniquement sur ordinateur : le mobile a déjà sa barre réduite
    // fixée en haut dès qu'on a scrollé (même dépliée au survol), réduite seulement si on ne la survole pas
    const isFixed = isScrolled && !isMobile
    const isCompact = isFixed && !isHovered

    useEffect(() => {
        const loadSuggestions = async () => {
            try {
                const response = await api.get('/products')
                setProducts(response.data)
            } catch (err) {
                // pas de message d'erreur : les suggestions sont un bonus, la recherche marche sans
            }
        }
        loadSuggestions()
    }, [])

    // clic en dehors de la barre de recherche : on ferme la liste
    // (mousedown et pas onBlur : le blur arrive avant le clic et ferait perdre le clic sur un lien de la liste)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSuggestionsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    //Avant 2 lettres, on ne propose rien
    const suggestions = searchQuery.trim().length >= 2
        ? searchProducts(products, searchQuery) // tous les résultats : la liste défile au-delà de 5 lignes (CSS)
        : []

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

                <form ref={searchRef} className="searchBar" role="search" onSubmit={handleSearch}>
                    <input
                        type="search"
                        className="searchBar-input"
                        placeholder="Rechercher..."
                        aria-label="Rechercher un produit"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setSuggestionsOpen(true)
                        }}
                        onFocus={() => setSuggestionsOpen(true)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setSuggestionsOpen(false)
                        }}
                    />
                    <button type="submit" className="searchBar-btn" aria-label="Lancer la recherche">
                        <IoSearch size={21} className="icon"/>
                    </button>
                    {suggestionsOpen && suggestions.length > 0 && (
                        <ul className="searchBar-suggestions">
                            {suggestions.map((product) => (
                                <li key={product.product_id}>
                                    <Link to={productPath(product.product_id)} className="searchBar-suggestion"
                                          onClick={() => setSuggestionsOpen(false)}>
                                        <img className="searchBar-suggestion__image" src={product.product_image_url} alt=""/>
                                        <span className="searchBar-suggestion__text">
                                            {product.origin && <span className="searchBar-suggestion__origin">{product.origin}</span>}
                                            <span className="searchBar-suggestion__name">{product.product_name}</span>
                                            <span className="searchBar-suggestion__meta">
                                                {product.category_name && <span className="searchBar-suggestion__category">{product.category_name}</span>}
                                                {product.roast && <span className="searchBar-suggestion__roast">{product.roast}</span>}
                                            </span>
                                            <span className="searchBar-suggestion__price">{product.price} €</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
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
                    <p className="font-size-135em c-tertiary">
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