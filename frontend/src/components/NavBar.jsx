import '../style/navBar.css';

import logo2 from '../assets/images/logos/leTempsDuneTasse_logoHorloge2.png'
import cartIcon from '../assets/icons/basketB.svg'
import searchIcon from '../assets/icons/searchB.svg'
import userIcon from '../assets/icons/userB.svg'
import AuthModal from "./AuthModal.jsx";
import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import UserAccount from "./UserAccount.jsx";

const NavBar = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [modifyUserAccount, setModifyUserAccount] = useState(false)
    const {user, isAuthenticated, logout} = useAuth()

    return (
        <div className="navBar flex align-self-center justify-content-space-between m-left-50px p-top-5px p-bottom-5px">
            <div className="logo">
                <img
                    src={logo2}
                    alt="logoleTempsdUneTasse"
                    className="h-90px cursor-pointer"
                />
            </div>
            <div className="menu align-self-center">
                <ul className="c-secondary flex gap-40px list-none font-size-15px">
                    <li className="position-relative cursor-pointer">Café</li>
                    <li className="position-relative cursor-pointer">Thé & Infusion</li>
                    <li className="position-relative cursor-pointer">Machines</li>
                    <li className="position-relative cursor-pointer">Accessoires</li>
                    <li className="position-relative cursor-pointer">Qui sommes-nous ?</li>
                </ul>
            </div>

            <div className=" flex flex-direction-column m-right-50px align-content-center">
                <p className="font-size-125em c-tertiary">
                    {isAuthenticated ? `Bienvenue ${user.first_name}` : ""}</p>
                <div className="icons flex gap-20px align-self-center">
                    <img src={searchIcon} className="icon h-20px cursor-pointer" alt="search-icon"/>
                    <img src={userIcon} className="icon h-20px cursor-pointer" alt="user-icon"
                         onClick={()=>{isAuthenticated ? setModifyUserAccount(true) : setIsAuthModalOpen(true)}}/>
                   <div className="flex flex-1 ">
                    <img src={cartIcon} className="icon h-20px cursor-pointer position-absolute z-index1" alt="cart-icon"/>
                    <div className="border-radius-50 b-quaternary w-12px h-12px position-relative z-index2 left-125em c-primary"></div>
                   </div>
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
                onClose={()=>setModifyUserAccount(false)}
                onLogout={logout}
                />
            </div>
        </div>
    )
}

export default NavBar;