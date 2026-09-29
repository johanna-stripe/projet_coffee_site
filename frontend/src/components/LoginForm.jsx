import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import "../style/authModal.css"


const LoginForm = ({onClose, switchToRegister}) => {
    const {login} = useAuth()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            await login(user)
            onClose()

        } catch (error) {
            setError('Adresse mail ou mot de passe invalide')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
        className="auth-form flex flex-direction-column gap-20px"
        onSubmit={handleSubmit}>
            {error && (<p className="auth-error c-redC1121F font-size-085em">{error}</p>)}

            <div className="flex flex-direction-column gap-20px">
                <div className="flex flex-direction-column gap-5px flex-1">
                    <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                        Adresse e-mail
                    </label>
                    <input
                        type="text"
                        name="email"
                        placeholder="votre@email.com"
                        value={user.email}
                        onChange={handleChange}
                        className="auth-input p-10px border-none c-secondary form-placeholder"
                        required
                    />
                </div>

                <div className="flex flex-direction-column gap-5px position-relative">
                    <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                        Mot de passe
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="••••••••••"
                        className="auth-input p-10px border-none c-secondary form-placeholder"
                        required
                    />
                    <button
                    type="button"
                    className="auth-toggle-password position-absolute right-0 bottom-0 cursor-pointer b-none border-none c-secondary c-tertiary bottom-05em "
                    onClick={()=>setShowPassword(prevState => !prevState)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                        👁
                    </button>
                </div>

                <button
                type="submit"
                className="auth-submit b-quaternary w-60 c-white uppercase letter-spacing-1px p-15px border-none cursor-pointer align-self-center"
                disabled={isLoading}
                >
                    {isLoading?"Connexion en cours..." : " Se connecter"}
                </button>

                <p className="text-align-center font-size-085em">
                    Pas encore de compte ?{" "}
                    <span
                        className="auth-switch c-tertiary cursor-pointer text-decoration-none"
                        onClick={switchToRegister}
                    >
                    Créer un compte
                </span>
                </p>
            </div>
        </form>
    )

}

export default LoginForm