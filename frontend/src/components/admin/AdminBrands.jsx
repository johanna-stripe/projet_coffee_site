import React, {useEffect, useRef, useState} from 'react';
import api from "../../axios/axiosConfig.js";
import ConfirmModal from "./ConfirmModal.jsx";
import "../../style/adminOrders.css";     // classes communes : toolbar, recherche, tableau, panneau détail
import "../../style/adminUsers.css";      // boutons d'action
import "../../style/adminProducts.css";   // en-tête, champs de formulaire, message de succès

const errorText = (err, fallback) =>
    err.response?.data?.message || err.response?.data?.error || fallback;

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);   // sert uniquement à compter les produits de chaque marque
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [search, setSearch] = useState('');

    // Panneau ouvert : null (fermé), 'create' ou la marque modifiée
    const [editing, setEditing] = useState(null);
    const [name, setName] = useState('');
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const panelRef = useRef(null);

    const normalize = (text) => (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    const load = async () => {
        try {
            const [brandsRes, productsRes] = await Promise.all([
                api.get('/brand').catch(err => err.response?.status === 404 ? {data: []} : Promise.reject(err)),
                api.get('/products').catch(err => err.response?.status === 404 ? {data: []} : Promise.reject(err)),
            ]);
            setBrands(Array.isArray(brandsRes.data) ? brandsRes.data : []);
            setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setError('');
        } catch (err) {
            setError(errorText(err, 'Impossible de charger les marques'));
        } finally {
            setLoaded(true);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // Dès qu'un panneau s'ouvre (ou qu'on passe à une autre marque), on descend dessus
    useEffect(() => {
        if (editing !== null) {
            panelRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [editing]);

    const productCount = (brandId) => products.filter(product => product.brand_id === brandId).length;

    const visibleBrands = brands
        .filter(brand => normalize(brand.brand_name).includes(normalize(search).trim()))
        .sort((a, b) => (a.brand_name || '').localeCompare(b.brand_name || '', 'fr'));

    const openCreate = () => {
        setEditing('create');
        setName('');
        setFormError('');
        setSuccess('');
    };

    const openEdit = (brand) => {
        setEditing(brand);
        setName(brand.brand_name);
        setFormError('');
        setSuccess('');
    };

    const closePanel = () => {
        setEditing(null);
        setFormError('');
        setConfirmDelete(false);
    };

    const save = async (e) => {
        e.preventDefault();
        if (!name.trim()) return setFormError('Le nom de la marque est obligatoire.');

        setSaving(true);
        try {
            if (editing === 'create') {
                await api.post('/brand', {brand_name: name.trim()});
                setSuccess(`Marque « ${name.trim()} » créée.`);
            } else {
                await api.put(`/brand/${editing.brand_id}`, {brand_name: name.trim()});
                setSuccess(`Marque « ${name.trim()} » mise à jour.`);
            }
            await load();
            closePanel();
        } catch (err) {
            setFormError(errorText(err, "Impossible d'enregistrer la marque"));
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        setConfirmDelete(false);
        try {
            await api.delete(`/brand/${editing.brand_id}`);
            setSuccess(`Marque « ${editing.brand_name} » supprimée.`);
            await load();
            closePanel();
        } catch (err) {
            // 409 : des produits sont encore rattachés à la marque
            setFormError(errorText(err, 'Impossible de supprimer la marque'));
        }
    };

    const isCreating = editing === 'create';

    return (
        <div className="admin-products">
            <div className="admin-products-header">
                <div>
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Marques</h3>
                    <p className="font-size-125em subtitle c-secondary m-0">Les marques et fournisseurs rattachés aux produits</p>
                </div>
                <button type="button" className="admin-products-add" onClick={openCreate}>
                    + Nouvelle marque
                </button>
            </div>

            {error && <p className="purchase-error">{error}</p>}
            {success && <p className="admin-products-success" role="status">{success}</p>}

            {loaded && !error && brands.length === 0 && (
                <p className="font-size-125em c-secondary">Aucune marque pour le moment.</p>
            )}

            {brands.length > 0 && (
                <div className="admin-toolbar">
                    <input type="search" className="admin-search" placeholder="Rechercher une marque"
                           aria-label="Rechercher une marque"
                           value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
            )}

            {brands.length > 0 && visibleBrands.length === 0 && (
                <p className="font-size-125em c-secondary">Aucune marque ne correspond à votre recherche.</p>
            )}

            {visibleBrands.length > 0 && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Marque</th>
                            <th>Produits</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visibleBrands.map(brand => (
                            <tr key={brand.brand_id} onClick={() => openEdit(brand)} className="admin-row-clickable">
                                <td>{brand.brand_name}</td>
                                <td>{productCount(brand.brand_id)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing !== null && (
                <form className="admin-order-detail" ref={panelRef} onSubmit={save} noValidate>
                    <div className="admin-order-detail-head">
                        <div>
                            <h4 className="admin-order-detail-title">{isCreating ? 'Nouvelle marque' : editing.brand_name}</h4>
                            {!isCreating && <span className="admin-users-role">{productCount(editing.brand_id)} produit(s)</span>}
                        </div>
                        <button type="button" className="admin-order-detail-close" aria-label="Fermer" onClick={closePanel}>✕</button>
                    </div>

                    <div className="admin-products-grid">
                        <label className="admin-products-field admin-products-field-wide">
                            <span>Nom de la marque *</span>
                            <input type="text" maxLength={100} value={name} onChange={(e) => setName(e.target.value)}/>
                        </label>
                    </div>

                    {formError && <p className="purchase-error" role="alert">{formError}</p>}

                    <div className="admin-products-actions">
                        <button type="submit" className="admin-products-add" disabled={saving}>
                            {saving ? 'Enregistrement…' : isCreating ? 'Créer la marque' : 'Enregistrer'}
                        </button>
                        <button type="button" className="admin-users-action" onClick={closePanel}>Annuler</button>
                        {!isCreating && (
                            <button type="button" className="admin-users-action admin-users-action-danger admin-products-delete"
                                    onClick={() => setConfirmDelete(true)}>
                                Supprimer
                            </button>
                        )}
                    </div>
                </form>
            )}

            <ConfirmModal
                isOpen={confirmDelete && editing !== null && editing !== 'create'}
                title="Supprimer la marque"
                message={<>
                    Êtes-vous sûr de vouloir supprimer la marque <strong>{editing?.brand_name}</strong> ?
                    Une marque qui a encore des produits ne peut pas être supprimée.
                </>}
                confirmLabel="Supprimer"
                cancelLabel="Retour"
                onCancel={() => setConfirmDelete(false)}
                onConfirm={remove}
            />
        </div>
    );
};

export default AdminBrands;
