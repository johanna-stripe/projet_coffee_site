import {FaPen, FaRegTrashAlt} from "react-icons/fa";
import {useEffect, useState} from "react";
import api from "../../axios/axiosConfig.js";
import "../../style/userAddresses.css";

// Valeurs du formulaire quand on ajoute une nouvelle adresse
const EMPTY_FORM = {
    address_name: '',
    street: '',
    postcode: '',
    city: '',
    country: 'France',
};

const UserAddresses = () => {
    const [customer, setCustomer] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // editingId : null = aucun formulaire ouvert, 'new' = ajout, sinon l'address_id modifiée
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    //=============== CHARGER LE PROFIL + LES ADRESSES ===============
    const fetchAddresses = async () => {
        try {
            const response = await api.get('/customer/me');
            setCustomer(response.data.customer);
            setAddresses(response.data.addresses);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Impossible de charger vos adresses');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    //=============== OUVRIR / FERMER LE FORMULAIRE ===============
    const openNewForm = () => {
        setForm(EMPTY_FORM);
        setFormError('');
        setEditingId('new');
    };

    const openEditForm = (address) => {
        setForm({
            address_name: address.address_name || '',
            street: address.street || '',
            postcode: address.postcode || '',
            city: address.city || '',
            country: address.country || '',
        });
        setFormError('');
        setEditingId(address.address_id);
    };

    const closeForm = () => {
        setEditingId(null);
        setFormError('');
    };

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    //=============== ENREGISTRER (AJOUT OU MODIFICATION) ===============
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.street.trim() || !form.postcode.trim() || !form.city.trim() || !form.country.trim()) {
            setFormError('Adresse, code postal, ville et pays sont obligatoires.');
            return;
        }

        setIsSaving(true);
        try {
            if (editingId === 'new') {
                await api.post(`/customer/${customer.customer_id}/address`, form);
            } else {
                await api.patch(`/customer/${customer.customer_id}/address/${editingId}`, form);
            }
            await fetchAddresses(); // on recharge la liste pour afficher la version enregistrée
            closeForm();
        } catch (err) {
            setFormError(err.response?.data?.error || err.response?.data?.message || "L'adresse n'a pas pu être enregistrée.");
        } finally {
            setIsSaving(false);
        }
    };

    //=============== SUPPRIMER ===============
    const handleDelete = async (address) => {
        const label = address.address_name || address.street;
        if (!window.confirm(`Supprimer l'adresse « ${label} » ?`)) return;

        try {
            await api.delete(`/customer/${customer.customer_id}/addresses/${address.address_id}`);
            if (editingId === address.address_id) closeForm();
            await fetchAddresses();
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "L'adresse n'a pas pu être supprimée.");
        }
    };

    //=============== DÉFINIR PAR DÉFAUT ===============
    const handleSetDefault = async (address) => {
        try {
            await api.patch(`/customer/${customer.customer_id}/address/${address.address_id}/default`);
            await fetchAddresses(); // le serveur renvoie l'adresse par défaut en premier
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "L'adresse par défaut n'a pas pu être modifiée.");
        }
    };

    //=============== FORMULAIRE (utilisé pour l'ajout et la modification) ===============
    const renderForm = () => (
        <form className="address-form" onSubmit={handleSubmit}>
            <h4 className="address-form-title">
                {editingId === 'new' ? 'Nouvelle adresse' : "Modifier l'adresse"}
            </h4>

            <div className="address-form-grid">
                <div className="address-field">
                    <label htmlFor="address_name">Étiquette</label>
                    <input id="address_name" name="address_name" type="text"
                           placeholder="Domicile, Bureau..."
                           value={form.address_name} onChange={handleChange}/>
                </div>
                <div className="address-field">
                    <label htmlFor="country">Pays</label>
                    <input id="country" name="country" type="text"
                           value={form.country} onChange={handleChange}/>
                </div>
                <div className="address-field address-field-full">
                    <label htmlFor="street">Adresse</label>
                    <input id="street" name="street" type="text"
                           placeholder="12 rue des Oliviers, Apt 4B"
                           value={form.street} onChange={handleChange}/>
                </div>
                <div className="address-field">
                    <label htmlFor="postcode">Code postal</label>
                    <input id="postcode" name="postcode" type="text" inputMode="numeric"
                           value={form.postcode} onChange={handleChange}/>
                </div>
                <div className="address-field">
                    <label htmlFor="city">Ville</label>
                    <input id="city" name="city" type="text"
                           value={form.city} onChange={handleChange}/>
                </div>
            </div>

            {formError && <p className="address-error">{formError}</p>}

            <div className="address-form-actions">
                <button type="button" className="address-btn address-btn-outline" onClick={closeForm}>
                    Annuler
                </button>
                <button type="submit" className="address-btn address-btn-green" disabled={isSaving}>
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );

    //=============== AFFICHAGE ===============
    if (isLoading) return <p>Chargement...</p>;
    if (!customer) return <p className="address-error">{error || 'Profil client introuvable.'}</p>;

    return (
        <>
            <div className="address-header m-right-20px">
                <div>
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Mes adresses</h3>
                    <p className="font-size-125em subtitle c-secondary m-0">Gérez vos adresses de livraison</p>
                </div>
                <button type="button" className="address-btn address-btn-dark" onClick={openNewForm}>
                    + Ajouter
                </button>
            </div>

            {error && <p className="address-error">{error}</p>}

            <div className="address-grid m-right-20px">
                {editingId === 'new' && (
                    <div className="address-column">{renderForm()}</div>
                )}

                {addresses.length === 0 && editingId !== 'new' && (
                    <p className="c-secondary">Aucune adresse enregistrée. Cliquez sur « Ajouter » pour en créer une.</p>
                )}

                {addresses.map((address) => {
                    const isEditing = editingId === address.address_id;
                    const isDefault = Boolean(address.is_default); // MySQL renvoie 1 ou 0
                    return (
                        <div key={address.address_id} className="address-column">
                            <article className={`address-card ${isDefault || isEditing ? 'address-card-active' : ''}`}>
                                <div className="address-card-header">
                                    <div className="address-card-title-row">
                                        <h4 className="address-card-title">{address.address_name || 'Adresse'}</h4>
                                        {isDefault && <span className="address-badge">Par défaut</span>}
                                    </div>
                                    <div className="address-card-icons">
                                        <button type="button" className="address-icon-btn"
                                                onClick={() => openEditForm(address)}
                                                aria-label={`Modifier l'adresse ${address.address_name || ''}`}>
                                            <FaPen size={13}/>
                                        </button>
                                        {/* l'adresse par défaut ne se supprime pas : il faut d'abord en choisir une autre */}
                                        {!isDefault && (
                                            <button type="button" className="address-icon-btn"
                                                    onClick={() => handleDelete(address)}
                                                    aria-label={`Supprimer l'adresse ${address.address_name || ''}`}>
                                                <FaRegTrashAlt size={13}/>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Nom et téléphone : ceux de la fiche client */}
                                <div className="address-card-body">
                                    <p className="capitalize">{customer.first_name} {customer.last_name}</p>
                                    <p>{address.street}</p>
                                    <p>{address.postcode} {address.city}</p>
                                    <p>{address.country}</p>
                                    {customer.phone && <p>{customer.phone}</p>}
                                </div>

                                {!isDefault && (
                                    <button type="button" className="address-link-btn"
                                            onClick={() => handleSetDefault(address)}>
                                        Définir par défaut
                                    </button>
                                )}
                            </article>

                            {isEditing && renderForm()}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default UserAddresses;
