import {FaCheck, FaPen} from "react-icons/fa";
import {RxCross2} from "react-icons/rx";
import {formatDateFR, formatDateISO} from "../helper/helper.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import api from "../axios/axiosConfig.js";

const UserInformation = () => {

    const {user, updateUser} = useAuth()

    const [userAccount, setUserAccount] = useState({
        user_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        birth_date: '',
        client_since: '',
    });

    const [isEditing, setIsEditing] = useState(false)

    const [modifyUser, setModifyUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        birth_date: ''
    })

    const [error, setError] = useState('')

    useEffect(() => {
        if (user) {
            setUserAccount({
                user_id: user.user_id || user.id || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                birth_date: user.birth_date || '',
                client_since: user.created_at || '',
            })
        }
    }, [user]);


    const handleEditClick = (e) => {
        setModifyUser({
            first_name: userAccount.first_name,
            last_name: userAccount.last_name,
            email: userAccount.email,
            phone: userAccount.phone,
            birth_date: userAccount.birth_date
        })
        setIsEditing(true)
    }


    const handleModifyChange = (e) => {
        setModifyUser({
            ...modifyUser,
            [e.target.name]: e.target.value
        })
        setIsEditing(true)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const userId = user.user_id || user.id;
        if (!userId) {
            setError("Identifiant utilisateur introuvable.");
            return;
        }

        try {
            const response = await api.patch(
                `/users/update-user/${user.id}`,
                {
                    first_name: modifyUser.first_name,
                    last_name: modifyUser.last_name,
                    email: modifyUser.email,
                    phone: modifyUser.phone,
                    birth_date: modifyUser.birth_date,
                })

            setUserAccount(prev => ({
                ...prev,
                ...modifyUser,
            }));
            updateUser(modifyUser)
            setIsEditing(false)
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Échec de la mise à jour');
        }
    }

    if (!user) return null;

    return (
        <>
            <div className="content-header flex justify-content-space-between">
                <div>
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Mes informations</h3>
                    <p className="font-size-125em subtitle c-secondary m-0 p-bottom-20px">Gérez votre profil personnel</p>
                </div>

                <div className="flex gap-15px">
                    {isEditing ? "" : (
                        <button
                            className="align-self-center m-right-50px b-none p-10px flex cursor-pointer"
                            onClick={handleEditClick}
                        >
                            <FaPen size={15} color={"var(--color-secondary)"}/>
                            <span className="m-left-10px c-secondary">Modifier</span>
                        </button>)}

                    {isEditing ? (
                        <button
                            className="align-self-center m-right-50px b-none p-10px flex cursor-pointer"
                            onClick={() => setIsEditing(false)}
                        >
                            <RxCross2 size={15} color={"var(--color-secondary)"}/>
                            <span className="m-left-10px c-secondary">Annuler</span>
                        </button>) : ("")}
                </div>
            </div>

            <div className="profile-summary flex align-items-center m-top-20px m-bottom-20px">
                <div
                    className="avatar b-quaternary c-primary font-size-150em p-15px flex align-items-center justify-content-center">
                    {userAccount.first_name?.[0]}{userAccount.last_name?.[0]}
                </div>
                <div className="profile-name m-10px flex flex-direction-column gap-5px">
                    <p className="font-size-150em m-0">{userAccount.first_name} {userAccount.last_name}</p>
                    <p className="client-since c-tertiary m-0">Client depuis
                        le {formatDateFR(userAccount.client_since)}</p>
                </div>
            </div>

            <hr className="divider"/>

            <div className="info-grid flex flex-direction-column m-top-20px m-bottom-20px">
                <form
                    onSubmit={handleSubmit}
                >
                    <div className="flex m-bottom-20px">
                        <div className="info-field w-45 flex-1 flex flex-direction-column">
                            <label className="c-tertiary">PRÉNOM</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="first_name"
                                    value={modifyUser.first_name}
                                    onChange={handleModifyChange}
                                    className="auth-input border-none p-top-5px p-bottom-5px font-size-14px w-50 m-0 c-secondary form-placeholder"
                                />
                            ) : (
                                <p className="w-50 m-0 p-top-5px p-bottom-5px font-size-14px c-secondary form-placeholder">{userAccount.first_name || '-'}</p>
                            )
                            }
                        </div>
                        <div className="info-field w-45 flex-1 flex flex-direction-column">
                            <label className="c-tertiary">NOM</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="last_name"
                                    value={modifyUser.last_name}
                                    onChange={handleModifyChange}
                                    className="auth-input p-top-5px p-bottom-5px border-none font-size-14px w-50 m-0 c-secondary form-placeholder"
                                />
                            ) : (
                                <p className="p-top-5px p-bottom-5px w-50 m-0 font-size-14px c-secondary form-placeholder">{userAccount.last_name || '-'}</p>
                            )
                            }
                        </div>
                    </div>

                    <div className="flex m-bottom-20px">
                        <div className="info-field w-45 flex-1 flex flex-direction-column">
                            <label className="c-tertiary">ADRESSE E-MAIL</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="email"
                                    value={modifyUser.email}
                                    onChange={handleModifyChange}
                                    className="auth-input p-top-5px p-bottom-5px border-none font-size-14px w-50 m-0 c-secondary form-placeholder"
                                />
                            ) : (
                                <p className="p-top-5px p-bottom-5px w-50 m-0 font-size-14px c-secondary form-placeholder">{userAccount.email || '-'}</p>
                            )
                            }
                        </div>
                        <div className="info-field w-45 flex-1 flex flex-direction-column">
                            <label className="c-tertiary uppercase">téléphone</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={modifyUser.phone}
                                    onChange={handleModifyChange}
                                    className="auth-input p-top-5px p-bottom-5px border-none font-size-14px w-50 m-0 c-secondary form-placeholder"
                                />
                            ) : (
                                <p className="p-top-5px p-bottom-5px w-50 m-0 font-size-14px c-secondary form-placeholder">{userAccount.phone || '-'}</p>
                            )
                            }
                        </div>
                    </div>

                    <div className="info-field w-45 flex-1 flex flex-direction-column">
                        <label className="c-tertiary uppercase">date de naissance</label>
                        {isEditing ? (
                            <input
                                type="date"
                                name="birth_date"
                                value={formatDateISO(modifyUser.birth_date)}
                                onChange={handleModifyChange}
                                className="auth-input p-top-5px p-bottom-5px border-none font-size-14px w-50 m-0 c-secondary form-placeholder"
                            />
                        ) : (
                            <p className="p-top-5px p-bottom-5px w-50 m-0 font-size-14px c-secondary form-placeholder">{formatDateFR(userAccount.birth_date) || '-'}</p>
                        )
                        }
                    </div>
                    {error && <p style={{color: "red"}}>{error}</p>}
                    {isEditing ? (
                        <button
                            type="submit"
                            className="align-self-center m-right-50px m-top-10px b-none p-10px flex cursor-pointer"
                        ><FaCheck size={15} color={"var(--color-secondary)"} className="m-right-10px"/>Valider
                        </button>
                    ) : ""}

                </form>
            </div>

            <hr className="divider"/>
        </>
    )

}

export default UserInformation