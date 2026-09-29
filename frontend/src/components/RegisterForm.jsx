import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import "../style/authModal.css"


const RegisterForm = ({onClose, switchToLogin}) => {
    const {register} = useAuth();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        user_email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        birth_date: ""
    });

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
            // Les crochets [...] disent à JS : "n'utilise pas le texte littéral e.target.name comme nom de clé — évalue d'abord cette expression, et utilise le résultat comme nom de clé.
            // la value après les : est la valeur qu'on veut associer à cette clé, donc comme d'abitude, sans crochet
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
            onClose()

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
            {/*
            dit "affiche ce paragraphe d'erreur seulement si error contient quelque chose ; sinon, n'affiche rien du tout."
            équivalent d'écrire :
            {error ? <p className="auth-error...">{error}</p> : null}
            */}

            <div className="flex gap-20px">
                <div className="flex flex-direction-column gap-5px flex-1">
                    <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                        Prénom*
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Marie"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="auth-input p-10px border-none c-secondary form-placeholder"
                        required
                    />
                </div>

                <div className="flex flex-direction-column gap-5px flex-1">
                    <label className="letter-spacing-1px c-tertiary uppercase c-tertiary font-size-085em">
                        Nom*
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Dupont"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="auth-input p-10px border-none c-secondary form-placeholder"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-direction-column gap-5px">
                <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                    Adresse e-mail*
                </label>
                <input
                    type="email"
                    name="user_email"
                    placeholder="votre@email.com"
                    value={formData.user_email}
                    onChange={handleChange}
                    className="auth-input p-10px border-none c-secondary form-placeholder"
                    required
                />
            </div>

            <div className="flex flex-direction-column gap-5px flex-1">
                <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                    Téléphone
                </label>
                <input
                    type="tel"
                    name="phone"
                    pattern="^(?:(?:\+33|0033)[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={handleChange}
                    className="auth-input p-10px border-none c-secondary form-placeholder"
                />
            </div>

            <div className="flex flex-direction-column gap-5px flex-1">
                <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                    Date de naissance
                </label>
                <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="auth-input p-10px border-none c-secondary form-placeholder"
                />
            </div>

            <div className="flex flex-direction-column gap-5px position-relative">
                <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                    Mot de passe*
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
                    onClick={() => setShowPassword((prevState) => !prevState)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                    👁
                </button>
            </div>

            <div className="flex flex-direction-column gap-5px">
                <label className="letter-spacing-1px c-tertiary uppercase font-size-085em">
                    Confirmer le mot de passe *
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