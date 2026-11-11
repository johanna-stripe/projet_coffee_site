import React, {useEffect, useRef, useState} from 'react';
import api from "../../axios/axiosConfig.js";
import ConfirmModal from "./ConfirmModal.jsx";
import "../../style/adminOrders.css";     // classes communes : toolbar, recherche, tableau, panneau détail
import "../../style/adminUsers.css";      // boutons d'action
import "../../style/adminProducts.css";   // en-tête, champs de formulaire, message de succès

const errorText = (err, fallback) =>
    err.response?.data?.message || err.response?.data?.error || fallback;

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);   // sert uniquement à compter les produits de chaque catégorie
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [search, setSearch] = useState('');

    // Panneau ouvert : null (fermé), 'create' ou la catégorie modifiée
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({category_name: '', parent_id: ''});
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const panelRef = useRef(null);

    const normalize = (text) => (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    const load = async () => {
        try {
            const [categoriesRes, productsRes] = await Promise.all([
                api.get('/categories').catch(err => err.response?.status === 404 ? {data: []} : Promise.reject(err)),
                api.get('/products').catch(err => err.response?.status === 404 ? {data: []} : Promise.reject(err)),
            ]);
            setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
            setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setError('');
        } catch (err) {
            setError(errorText(err, 'Impossible de charger les catégories'));
        } finally {
            setLoaded(true);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // Dès qu'un panneau s'ouvre (ou qu'on passe à une autre catégorie), on descend dessus
    useEffect(() => {
        if (editing !== null) {
            panelRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [editing]);

    const productCount = (categoryId) => products.filter(product => product.category_id === categoryId).length;
    const subCategories = (categoryId) => categories.filter(category => category.parent_id === categoryId);
    const parentName = (category) => categories.find(c => c.category_id === category.parent_id)?.category_name;

    // Liste : une catégorie principale suivie de ses sous-catégories
    const matches = (category) => normalize(`${category.category_name} ${parentName(category) || ''}`).includes(normalize(search).trim());
    const mainCategories = categories.filter(category => category.parent_id === null);
    const orderedCategories = mainCategories
        .sort((a, b) => a.category_name.localeCompare(b.category_name, 'fr'))
        .flatMap(main => [main, ...subCategories(main.category_id).sort((a, b) => a.category_name.localeCompare(b.category_name, 'fr'))])
        .filter(matches);

    // Parents proposés : uniquement des catégories principales, jamais la catégorie elle-même
    const parentChoices = mainCategories.filter(category => editing === 'create' || category.category_id !== editing?.category_id);

    const openCreate = () => {
        setEditing('create');
        setForm({category_name: '', parent_id: ''});
        setFormError('');
        setSuccess('');
    };

    const openEdit = (category) => {
        setEditing(category);
        setForm({category_name: category.category_name, parent_id: category.parent_id === null ? '' : String(category.parent_id)});
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
        if (!form.category_name.trim()) return setFormError('Le nom de la catégorie est obligatoire.');

        const payload = {category_name: form.category_name.trim(), parent_id: form.parent_id ? Number(form.parent_id) : null};

        setSaving(true);
        try {
            if (editing === 'create') {
                await api.post('/categories', payload);
                setSuccess(`Catégorie « ${payload.category_name} » créée.`);
            } else {
                await api.put(`/categories/${editing.category_id}`, payload);
                setSuccess(`Catégorie « ${payload.category_name} » mise à jour.`);
            }
            await load();
            closePanel();
        } catch (err) {
            setFormError(errorText(err, "Impossible d'enregistrer la catégorie"));
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        setConfirmDelete(false);
        try {
            await api.delete(`/categories/${editing.category_id}`);
            setSuccess(`Catégorie « ${editing.category_name} » supprimée.`);
            await load();
            closePanel();
        } catch (err) {
            // 409 : la catégorie contient encore des produits ou des sous-catégories
            setFormError(errorText(err, 'Impossible de supprimer la catégorie'));
        }
    };

    const isCreating = editing === 'create';

    return (
        <div className="admin-products">
            <div className="admin-products-header">
                <div>
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Catégories</h3>
                    <p className="font-size-125em subtitle c-secondary m-0">L'organisation du catalogue : catégories et sous-catégories</p>
                </div>
                <button type="button" className="admin-products-add" onClick={openCreate}>
                    + Nouvelle catégorie
                </button>
            </div>

            {error && <p className="purchase-error">{error}</p>}
            {success && <p className="admin-products-success" role="status">{success}</p>}

            {loaded && !error && categories.length === 0 && (
                <p className="font-size-125em c-secondary">Aucune catégorie pour le moment.</p>
            )}

            {categories.length > 0 && (
                <div className="admin-toolbar">
                    <input type="search" className="admin-search" placeholder="Rechercher une catégorie"
                           aria-label="Rechercher une catégorie"
                           value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
            )}

            {categories.length > 0 && orderedCategories.length === 0 && (
                <p className="font-size-125em c-secondary">Aucune catégorie ne correspond à votre recherche.</p>
            )}

            {orderedCategories.length > 0 && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Catégorie</th>
                            <th>Parent</th>
                            <th>Sous-catégories</th>
                            <th>Produits</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderedCategories.map(category => (
                            <tr key={category.category_id} onClick={() => openEdit(category)} className="admin-row-clickable">
                                <td className={category.parent_id === null ? 'admin-categories-main' : 'admin-categories-sub'}>
                                    {category.category_name}
                                </td>
                                <td>{parentName(category) || '-'}</td>
                                <td>{category.parent_id === null ? subCategories(category.category_id).length : '-'}</td>
                                <td>{productCount(category.category_id)}</td>
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
                            <h4 className="admin-order-detail-title">{isCreating ? 'Nouvelle catégorie' : editing.category_name}</h4>
                            {!isCreating && (
                                <span className="admin-users-role">
                                    {productCount(editing.category_id)} produit(s) · {subCategories(editing.category_id).length} sous-catégorie(s)
                                </span>
                            )}
                        </div>
                        <button type="button" className="admin-order-detail-close" aria-label="Fermer" onClick={closePanel}>✕</button>
                    </div>

                    <div className="admin-products-grid">
                        <label className="admin-products-field">
                            <span>Nom de la catégorie *</span>
                            <input type="text" maxLength={100} value={form.category_name}
                                   onChange={(e) => setForm({...form, category_name: e.target.value})}/>
                        </label>
                        <label className="admin-products-field">
                            <span>Catégorie parente</span>
                            <select value={form.parent_id} onChange={(e) => setForm({...form, parent_id: e.target.value})}>
                                <option value="">Aucune (catégorie principale)</option>
                                {parentChoices.map(category => (
                                    <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <p className="admin-users-self-note">
                        Les noms de catégories sont enregistrés en minuscules : le site s'en sert pour filtrer les pages.
                    </p>

                    {formError && <p className="purchase-error" role="alert">{formError}</p>}

                    <div className="admin-products-actions">
                        <button type="submit" className="admin-products-add" disabled={saving}>
                            {saving ? 'Enregistrement…' : isCreating ? 'Créer la catégorie' : 'Enregistrer'}
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
                title="Supprimer la catégorie"
                message={<>
                    Êtes-vous sûr de vouloir supprimer la catégorie <strong>{editing?.category_name}</strong> ?
                    Une catégorie qui contient encore des produits ou des sous-catégories ne peut pas être supprimée.
                </>}
                confirmLabel="Supprimer"
                cancelLabel="Retour"
                onCancel={() => setConfirmDelete(false)}
                onConfirm={remove}
            />
        </div>
    );
};

export default AdminCategories;
