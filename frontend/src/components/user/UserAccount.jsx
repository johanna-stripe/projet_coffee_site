import React, {useEffect, useState} from 'react';

import {FaInfoCircle} from "react-icons/fa";
import {FaAddressBook} from "react-icons/fa";
import {FaShoppingCart} from "react-icons/fa";
import {FaLock} from "react-icons/fa";
import {RiLogoutBoxRLine} from "react-icons/ri";

import "../../style/authModal.css"
import "../../style/userAccount.css"
import {useAuth} from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import UserInformations from "./UserInformation.jsx";
import UserAddresses from "./UserAddresses.jsx";
import UserPurchases from "./UserPuscharses.jsx";
import UserSecurity from "./UserSecurity.jsx";


const UserAccount = ({isOpen, onClose}) => {

    if (!isOpen) return null;

    const {user, logout} = useAuth()
    const [mode, setMode] = useState("UserInformation")
    const [userAccount, setUserAccount] = useState(user)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            setUserAccount({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
            })
        }
    }, [user]);


        const handleLogout = async () => {
            onClose();
            navigate('/');
            await logout();
        };

    return (
        <div
            className="account-page auth-overlay position-fixed top-0 left-0 w-100 h-100 flex align-items-center justify-content-center z-index99"
            onClick={onClose}
        >
            <div className="auth-modal account-modal position-relative b-primary w-80 h-80"
                 onClick={(e) => e.stopPropagation()}>
                <button
                    className="auth-close font-size-150em p-15px position-absolute top-0 right-0 cursor-pointer c-tertiary b-none border-none"
                    onClick={onClose}
                    aria-label="Fermer"
                >
                    ✕
                </button>
                <h3 className="text-align-center font-size-2em c-tertiary">
                    Bienvenue {userAccount.first_name} {userAccount.last_name}</h3>

                <div className="flex side-menu">
                    <div className="sidebar flex flex-25 flex-direction-column">
                        <ul className="list-none text-align-left font-size-125em c-secondary m-right-20px">
                            <li className={`menu-item flex align-items-center p-10px m-top-30px cursor-pointer ${mode === "UserInformation" ? "active" : ""}`}
                                onClick={() => setMode("UserInformation")}>
                                <span><FaInfoCircle size={19} alt="info"
                                                    className={`menu-icon m-right-15px ${mode === "UserInformation" ? "active" : ""}`}/></span> Mes
                                informations
                            </li>
                            <li className={`menu-item flex align-items-center p-10px m-top-30px cursor-pointer ${mode === "UserAddresses" ? "active" : ""}`}
                                onClick={() => setMode("UserAddresses")}
                            >
                                <span><FaAddressBook size={19} alt="address"
                                                     className={`menu-icon m-right-15px ${mode === "UserAddresses" ? "active" : ""}`}/></span> Mes
                                adresses
                            </li>
                            <li className={`menu-item flex align-items-center p-10px m-top-30px cursor-pointer ${mode === "UserPurchases" ? "active" : ""}`}
                                onClick={() => setMode("UserPurchases")}>
                                <span><FaShoppingCart size={19} alt="achat"
                                                      className={`menu-icon m-right-15px ${mode === "UserPurchases" ? "active" : ""}`}/></span> Mes
                                achats
                            </li>
                            <li className={`menu-item flex align-items-center p-10px m-top-30px cursor-pointer ${mode === "UserSecurity" ? "active" : ""}`}
                                onClick={() => setMode("UserSecurity")}>
                                <span><FaLock size={19} alt="security"
                                              className={`menu-icon m-right-15px ${mode === "UserSecurity" ? "active" : ""}`}/></span> Sécurité
                            </li>
                            <li className="menu-item logout flex align-items-center p-10px m-top-30px cursor-pointer"
                                onClick={handleLogout}>
                                <span><RiLogoutBoxRLine size={19} alt="logout"
                                                        className="menu-icon m-right-15px"/></span> Se déconnecter
                            </li>
                        </ul>
                    </div>

                    <div className="account-content flex-75">
                        {
                            mode === "UserInformation" ? (
                                <UserInformations
                                />
                            ) : mode === "UserAddresses" ? (
                                <UserAddresses
                                />
                            ) : mode === "UserPurchases" ? (
                                <UserPurchases/>
                            ) : mode === "UserSecurity" ? (
                                <UserSecurity/>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAccount;