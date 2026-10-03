import {FaCheck, FaPen} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import api from "../axios/axiosConfig.js";
import "../style/authModal.css"
import "../style/userAccount.css"

const UserSecurity = () => {

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const {user, updateUser} = useAuth()

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    const [showPassword, setShowPassword] = useState({
        current_password: false,
        new_password: false,
        confirm_password: false
    })

    const toggleShowPassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    useEffect(() => {
        if (!success) return
        const timer = setTimeout(() => setSuccess(''), 4000)
        return () => clearTimeout(timer)
    }, [success])


    const handleChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        })
        setSuccess('')
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const userId = user.user_id || user.id;
        if (!userId) {
            setError("Identifiant utilisateur introuvable.");
            return
        }

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setError('Les nouveaux mots de passe ne correspondent pas')
            return
        }

        try {
            await api.patch(`/users/update-user/${userId}`, {
                user_id: userId,
                new_password: passwordForm.new_password,
                current_password: passwordForm.current_password
            })

            setPasswordForm({current_password: '', new_password: '', confirm_password: ''})
            setError('')
            setSuccess('Mot de passe modifié avec succès')

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Échec de la mise à jour');
        }
    }


    return (
        <>
            <div className="content-header flex justify-content-space-between">
                <div className="m-bottom-20px">
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Sécurité</h3>
                    <p className="subtitle c-secondary m-0">Gérez votre mot de passe et la sécurité du compte</p>
                </div>
            </div>

            <div className="info-grid flex flex-direction-column b-white p-10px w-50">
                <p className="font-size-125em m-bottom-30px">Changer le mot de passe</p>
                <form
                    onSubmit={handleSubmit}
                >
                    <div className="flex m-bottom-20px">
                        <div className="info-field w-45 flex-1 gap-20px flex flex-direction-column">

                            <div className="flex flex-direction-column gap-5px w-70 position-relative">
                                <label className="c-tertiary letter-spacing-1px uppercase font-size-085em">Mot de passe
                                    actuel</label>
                                <input
                                    type={showPassword.current_password ? "text" : "password"}
                                    name="current_password"
                                    value={passwordForm.current_password}
                                    placeholder="••••••••••"
                                    onChange={handleChange}
                                    className="auth-input letter-spacing-2px border-none p-top-5px p-bottom-5px b-primary font-size-1em w-100 m-0 c-secondary form-placeholder"
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-password position-absolute right-0 cursor-pointer b-none border-none c-secondary c-tertiary bottom-05em "
                                    onClick={() => toggleShowPassword("current_password")}
                                    aria-label={showPassword.current_password ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    👁
                                </button>
                            </div>

                            <div className="flex flex-direction-column gap-5px w-70 position-relative">
                                <label className="c-tertiary letter-spacing-1px uppercase font-size-085em">Nouveau mot
                                    de passe
                                </label>
                                <input
                                    type={showPassword.new_password ? "text" : "password"}
                                    name="new_password"
                                    value={passwordForm.new_password}
                                    placeholder="••••••••••"
                                    onChange={handleChange}
                                    className="auth-input letter-spacing-2px border-none p-top-5px p-bottom-5px b-primary font-size-1em w-100 m-0 c-secondary form-placeholder"
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-password cursor-pointer b-none border-none c-secondary c-tertiary bottom-05em "
                                    onClick={() => toggleShowPassword("new_password")}
                                    aria-label={showPassword.new_password ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    👁
                                </button>
                            </div>


                            <div className="flex flex-direction-column gap-5px w-70 position-relative">
                                <label className="c-tertiary letter-spacing-1px uppercase font-size-085em">Confirmez le
                                    nouveau mot de passe
                                </label>
                                <input
                                    type={showPassword.confirm_password ? "text" : "password"}
                                    name="confirm_password"
                                    value={passwordForm.confirm_password}
                                    placeholder="••••••••••"
                                    onChange={handleChange}
                                    className="auth-input letter-spacing-2px border-none p-top-5px p-bottom-5px b-primary font-size-1em w-100 m-0 c-secondary form-placeholder"
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-password position-absolute right-0 cursor-pointer b-none border-none c-secondary c-tertiary bottom-05em "
                                    onClick={() => toggleShowPassword("confirm_password")}
                                    aria-label={showPassword.confirm_password ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    👁
                                </button>
                            </div>


                        </div>
                    </div>


                    {error && <p style={{color: "red"}}>{error}</p>}
                    {success && <p style={{color: "green"}}>{success}</p>}

                    <button
                        type="submit"
                        className="align-self-center m-right-50px m-top-10px b-none b-secondary c-primary p-10px flex cursor-pointer"
                    ><FaCheck size={15} color={"var(--color-primary)"} className="m-right-10px"/>Mettre à jour
                    </button>

                </form>
            </div>

            <hr className="divider"/>
        </>
    )

}

export default UserSecurity