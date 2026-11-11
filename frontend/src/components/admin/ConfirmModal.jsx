import "../../style/adminOrders.css";

// Fenêtre de confirmation réutilisable (même style que la modal de connexion)
// isOpen : affichée ou non / onConfirm : clic sur le bouton d'action / onCancel : clic sur Retour, la croix ou le fond
const ConfirmModal = ({isOpen, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Retour', onConfirm, onCancel}) => {
    if (!isOpen) return null;

    return (
        <div className="auth-overlay confirm-overlay" onClick={onCancel}>
            <div className="confirm-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="confirm-close" aria-label="Fermer" onClick={onCancel}>✕</button>

                <div className="confirm-header">
                    <h2 className="confirm-title">{title}</h2>
                </div>

                <div className="confirm-body">
                    <p className="confirm-message">{message}</p>
                    <div className="confirm-actions">
                        <button type="button" className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
                            {cancelLabel}
                        </button>
                        <button type="button" className="confirm-btn confirm-btn-danger" onClick={onConfirm}>
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal;
