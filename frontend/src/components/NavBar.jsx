import '../style/navBar.css';

import logo2 from '../assets/images/logos/leTempsDuneTasse_logoHorloge2.png'
import cartIcon from '../assets/icons/basketB.svg'
import searchIcon from '../assets/icons/searchB.svg'
import userIcon from '../assets/icons/userB.svg'
import AuthModal from "./AuthModal.jsx";
import {useState} from "react";

const NavBar = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

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
                    <li className="position-relative cursor-pointer">Café grain</li>
                    <li className="position-relative cursor-pointer">Café moulu</li>
                    <li className="position-relative cursor-pointer">Thé</li>
                    <li className="position-relative cursor-pointer">Infusions</li>
                    <li className="position-relative cursor-pointer">Accessoires</li>
                    <li className="position-relative cursor-pointer">Machines</li>
                    <li className="position-relative cursor-pointer">Qui sommes-nous ?</li>
                </ul>
            </div>
            <div className="icons flex gap-20px align-self-center m-right-50px">
                <img src={searchIcon} className="icon h-20px cursor-pointer" alt="search-icon"/>
                <img src={userIcon} className="icon h-20px cursor-pointer" alt="user-icon" onClick={()=>setIsAuthModalOpen(true)}/>
                <img src={cartIcon} className="icon h-20px cursor-pointer" alt="cart-icon"/>
            </div>
            <AuthModal
            isOpen={isAuthModalOpen}
            onClose={()=>setIsAuthModalOpen(false)}
            />
        </div>
    )
}

export default NavBar;