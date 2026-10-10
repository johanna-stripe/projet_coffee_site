import '../style/navBar.css';

import logo2 from '../assets/images/logos/leTempsDuneTasse_logoHorloge2.png'
import {FaRegUser} from "react-icons/fa";
import {PiBasket} from "react-icons/pi";
import {IoSearch} from "react-icons/io5";

import cartIcon from '../assets/icons/basketB.svg'
import searchIcon from '../assets/icons/searchB.svg'
import userIcon from '../assets/icons/userB.svg'
import AuthModal from "./AuthModal.jsx";
import {useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import UserAccount from "./UserAccount.jsx";
import SubMenu from "./SubMenu.jsx";

const NavBar = () => {
    const navRef = useRef(null)
    const [subMenuPos, setSubMenuPos] = useState({top: 0, gap: 0})
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState(null)
    const [modifyUserAccount, setModifyUserAccount] = useState(false)
    const {user, isAuthenticated, logout} = useAuth()

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

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({behavior: "smooth", block: "start"})
        //?. optional chaining --> si ce qui est à gauche existe, continue ; sinon, arrête-toi sans erreur
    }

    return (
        <div ref={navRef}
             className="navBar flex align-self-center justify-content-space-between m-left-50px p-top-5px p-bottom-5px">
            <div className="logo">
                <img
                    src={logo2}
                    alt="logoleTempsdUneTasse"
                    className="h-90px cursor-pointer"
                />
            </div>
            <div className="menu align-self-center">
                <ul className="c-secondary flex gap-40px list-none font-size-15px">
                    {menuItems.map((item => (
                        <li
                            key={item.label}
                            className="position-relative cursor-pointer"
                            onMouseEnter={item.category ? (e) => openSubMenu(e, item.category) : undefined}
                            onMouseLeave={() => setActiveCategory(null)}
                            onClick={item.targetId ? () => scrollToSection(item.targetId) : undefined}
                        >
                            {item.label}
                            {item.category && (
                                <SubMenu
                                    isOpen={activeCategory === item.category}
                                    category={item.category}
                                    top={subMenuPos.top}
                                    left={subMenuPos.left}
                                    gap={subMenuPos.gap}
                                />
                            )}
                        </li>
                    )))}
                </ul>
            </div>

            <div className=" flex flex-direction-column m-right-50px align-content-center">
                <p className="font-size-125em c-tertiary">
                    {isAuthenticated ? `Bienvenue ${user.first_name}` : ""}</p>
                <div className="icons flex gap-30px align-self-center">
                    <IoSearch
                        size={21}
                        className={"icon cursor-pointer"}
                        alt={"search-icon"}
                    />
                        <FaRegUser
                            size={20}
                            className={"icon cursor-pointer"}
                            alt={"user-icon"}
                            onClick={() => {
                                isAuthenticated ? setModifyUserAccount(true) : setIsAuthModalOpen(true)
                            }}
                        />
                        <PiBasket
                            size={24}
                            className={"icon cursor-pointer"}
                            alt={"basket-icon"}
                        />
                </div>
                <AuthModal
                    //Au clic de userIcon on a passé setIsAuthModalOpen(true)
                    isOpen={isAuthModalOpen}
                    //React prend la valeur actuelle de isAuthModalOpen (donc true) et la met dans un objet : { isOpen: true }.
                    //Donc équivaut maintenant à <AuthModal isOpen={true} .../>
                    onClose={() => setIsAuthModalOpen(false)}
                />
                <UserAccount
                    isOpen={modifyUserAccount}
                    onClose={() => setModifyUserAccount(false)}
                    onLogout={logout}
                />
            </div>
        </div>
)
}

export default NavBar;