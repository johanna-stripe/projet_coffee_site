import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import "../style/register.css"


const RegisterForm = ({onClose, switchToLogin}) => {
    const {register} = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }
        setIsLoading(true)

        try {
            await register(formData)
            onClose(false)

        } catch (error) {
            setError(error.message || 'Inscription Error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
            className="auth-form flex flex-direction-column gap-20px"
            onSubmit={handleSubmit}>
            {error && (
                <p className="auth-error c-redC1121F font-size-085em">{error}</p>
            )}

            <div className="flex gap-20px">
                <div className="flex flex-direction-column gap-5px flex-1">
                    <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                        Prénom
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Marie"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="auth-input p-10px border-none c-secondary form-placeholder"
                        required
                    />
                </div>

                <div className="flex flex-direction-column gap-5px flex-1">
                    <label className="letter-spacing-1px c-tertiary uppercase c-tertiary font-size-085em">
                        Nom
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="auth-input p-10px border-none c-secondary form-placeholder"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-direction-column gap-5px">
                <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                    Adresse e-mail
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={formData.email}
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
                    value={formData.password}
                    onChange={handleChange}
                    className="auth-input p-10px border-none c-secondary"
                    required
                    minLength={8}
                />
                <button
                    type="button"
                    className="auth-toggle-password position-absolute right-0 bottom-0 cursor-pointer b-none border-none c-secondary c-tertiary bottom-05em "
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                    👁
                </button>
            </div>

            <div className="flex flex-direction-column gap-5px">
                <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                    Confirmer le mot de passe
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth-input p-10px border-none c-secondary"
                    required
                />
            </div>

            <button
                type="submit"
                className="auth-submit b-quaternary w-60 c-white uppercase letter-spacing-1px p-15px border-none cursor-pointer align-self-center"
                disabled={isLoading}
            >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </button>

            <p className="text-align-center font-size-085em">
                Déjà un compte ?{" "}
                <span
                    className="auth-switch c-tertiary cursor-pointer text-decoration-none"
                    onClick={switchToLogin}
                >
                    Se connecter
                </span>
            </p>
        </form>
    );
};

export default RegisterForm