import {useState} from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../style/authModal.css"

const AuthModal = ({isOpen, onClose}) => {
    // mode contrôle quel formulaire est affiché : "login" ou "register"
    const [mode, setMode] = useState("login");

    // Si la modal n'est pas ouverte, on ne rend rien du tout
    if (!isOpen) return null;
    //Cette ligne dit : "si la valeur que j'ai reçue est false, je n'affiche rien". C'est ça qui contrôle l'ouverture/fermeture. Rien d'autre.

    return (
        <div
            className="auth-overlay position-fixed top-0 left-0 w-100 h-100 flex align-items-center justify-content-center z-index99"
            onClick={onClose}
            // clic sur l'overlay (le fond) ferme la modal
        >
            <div
                className="auth-modal position-relative"
                onClick={(e) => e.stopPropagation()}
                // stopPropagation empêche qu'un clic À L'INTÉRIEUR de la modal remonte jusqu'à l'overlay et la ferme par erreur
            >
                <button
                    className="auth-close position-absolute p-10px top-0 right-0 cursor-pointer c-tertiary b-none border-none"
                    onClick={onClose}
                    aria-label="Fermer"
                >
                    ✕
                </button>

                <div className="auth-header b-secondary text-align-center p-top-50px p-right-50px p-left-50px">
                    <h2 className="c-primary font-size-250em m-0">
                        {mode === "login" ? "Bon retour parmi nous" : "Rejoignez-nous"}
                    </h2>
                    <p className="letter-spacing-1px uppercase font-size-1em c-tertiary m-top-10px">
                        {mode === "login"
                            ? "Connectez-vous à votre compte"
                            : "Créez votre compte"}
                    </p>

                    <div className="auth-tabs flex justify-content-center gap-40px m-top-20px">
                        <button
                            className={`auth-tab uppercase letter-spacing-1px cursor-pointer b-secondary border-none c-primary opacity-05 ${
                                mode === "login" ? "auth-tab-active" : ""
                            }`}
                            onClick={() => setMode("login")}
                        >
                            Login
                        </button>
                        <button
                            className={`auth-tab uppercase letter-spacing-1px cursor-pointer b-secondary border-none c-primary opacity-05 ${
                                mode === "register" ? "auth-tab-active" : ""
                            }`}
                            onClick={() => setMode("register")}
                        >
                            Register
                        </button>
                    </div>
                </div>

                <div className="auth-body b-primary p-40px h-100">
                    {mode === "login" ? (
                        <LoginForm
                            onClose={onClose}
                            switchToRegister={() => setMode("register")}
                        />
                    ) : (
                        <RegisterForm
                            onClose={onClose}
                            switchToLogin={() => setMode("login")}
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthModal;