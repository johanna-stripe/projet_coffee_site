import React, {useEffect, useRef, useState} from 'react';
import api from "../../axios/axiosConfig.js";
import ConfirmModal from "./ConfirmModal.jsx";
import "../../style/adminOrders.css";   // classes communes : toolbar, recherche, tableau, pagination, panneau détail
import "../../style/adminProducts.css";

const PAGE_SIZE = 10;       // produits affichés par page
const LOW_STOCK = 5;        // en dessous (ou égal) : « stock bas »

const TYPE_LABELS = {
    'coffee/tea/infusion': 'Café / thé / infusion',
    'machine': 'Machine',
    'accessory': 'Accessoire',
};

// Formulaire vide pour une création
const EMPTY_FORM = {
    product_type: 'coffee/tea/infusion',
    product_name: '', product_description: '', product_image_url: '',
    category_id: '', brand_id: '', price: '', stock: '0',
    origin: '', roast: '', intensity: '', weight: '',
    pressure_power: '', tank_capacity: '', grinder: '',
    material: '', capacity: '', color: '',
};

// Une ligne de GET /products n'a pas de « type » : on le déduit de la sous-table remplie
const getProductType = (product) => {
    if (product.product_type) return product.product_type;
    if (product.origin !== null && product.origin !== undefined) return 'coffee/tea/infusion';
    if (product.pressure_power !== null && product.pressure_power !== undefined) return 'machine';
    if (product.material !== null && product.material !== undefined) return 'accessory';
    return 'coffee/tea/infusion';
};

// null → '' pour que les <input> restent contrôlés
const orEmpty = (value) => (value === null || value === undefined) ? '' : String(value);

const errorText = (err, fallback) =>
    err.response?.data?.message || err.response?.data?.error || fallback;

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');   // 'all', 'low' (stock bas) ou 'out' (rupture)
    const [sortBy, setSortBy] = useState('name-asc');
    const [page, setPage] = useState(1);

    // Panneau ouvert : null (fermé), 'create' ou l'id du produit modifié
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const panelRef = useRef(null);   // panneau création / modification, pour y descendre au clic

    // Minuscules + sans accents : "Éthiopie" et "ethiopie" se trouvent mutuellement
    const normalize = (text) => (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    const loadProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(Array.isArray(response.data) ? response.data : []);
            setError('');
        } catch (err) {
            if (err.response?.status === 404) {
                setProducts([]);
            } else {
                setError(errorText(err, 'Impossible de charger les produits'));
            }
        } finally {
            setLoaded(true);
        }
    };

    useEffect(() => {
        loadProducts();
        // catégories et marques servent aux listes déroulantes du formulaire et au filtre
        api.get('/categories').then(res => setCategories(res.data || [])).catch(() => setCategories([]));
        api.get('/brand').then(res => setBrands(res.data || [])).catch(() => setBrands([]));
    }, []);

    // « Café en grain › Grand cru » : on affiche le parent pour distinguer les sous-catégories
    const categoryLabel = (category) => {
        const parent = categories.find(c => c.category_id === category.parent_id);
        return parent ? `${parent.category_name} › ${category.category_name}` : category.category_name;
    };

    // Le filtre ne propose que les catégories qui contiennent au moins un produit
    // (les catégories « parent » comme Café ou Thé n'ont pas de produit directement)
    const usedCategoryIds = new Set(products.map(product => product.category_id));
    const filterCategories = categories.filter(category => usedCategoryIds.has(category.category_id));

    // ---------- Liste : recherche + filtres + tri + pagination ----------
    const visibleProducts = products
        .filter(product => {
            const words = normalize(search).split(/\s+/).filter(Boolean);
            const haystack = normalize(`${product.product_name} ${product.brand_name} ${product.category_name} ${product.origin} ${product.product_id}`);
            return words.every(word => haystack.includes(word));
        })
        .filter(product => typeFilter === 'all' || getProductType(product) === typeFilter)
        .filter(product => categoryFilter === 'all' || String(product.category_id) === categoryFilter)
        .filter(product => stockFilter === 'all'
            || (stockFilter === 'out' && product.stock <= 0)
            || (stockFilter === 'low' && product.stock > 0 && product.stock <= LOW_STOCK))
        // filter() renvoie un nouveau tableau : sort() ne modifie donc pas l'état `products`
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'stock-asc': return a.stock - b.stock;
                case 'stock-desc': return b.stock - a.stock;
                default: return (a.product_name || '').localeCompare(b.product_name || '', 'fr');
            }
        });

    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageProducts = visibleProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const resetPageAnd = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    // Dès qu'un produit est ouvert (ou qu'on en ouvre un autre, ou une création), on descend sur le panneau
    useEffect(() => {
        if (editing !== null) {
            panelRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [editing]);

    // ---------- Panneau création / modification ----------
    const openCreate = () => {
        setEditing('create');
        setForm(EMPTY_FORM);
        setFormError('');
        setSuccess('');
    };

    const openEdit = async (productId) => {
        try {
            // la fiche complète (GET /products/:id) contient le type et tous les champs du produit
            const response = await api.get(`/products/${productId}`);
            const product = response.data.results;
            setForm({
                product_type: product.product_type,
                product_name: orEmpty(product.product_name),
                product_description: orEmpty(product.product_description),
                product_image_url: orEmpty(product.product_image_url),
                category_id: orEmpty(product.category_id),
                brand_id: orEmpty(product.brand_id),
                price: orEmpty(product.price),
                stock: orEmpty(product.stock),
                origin: orEmpty(product.origin),
                roast: orEmpty(product.roast),
                intensity: orEmpty(product.intensity),
                weight: orEmpty(product.weight),
                pressure_power: orEmpty(product.pressure_power),
                tank_capacity: orEmpty(product.tank_capacity),
                grinder: orEmpty(product.grinder),
                material: orEmpty(product.material),
                capacity: orEmpty(product.capacity),
                color: orEmpty(product.color),
            });
            setEditing(productId);
            setFormError('');
            setSuccess('');
        } catch (err) {
            setError(errorText(err, 'Impossible de charger le produit'));
        }
    };

    const closePanel = () => {
        setEditing(null);
        setFormError('');
        setConfirmDelete(false);
    };

    const setField = (name) => (e) => setForm({...form, [name]: e.target.value});

    const validateForm = () => {
        if (!form.product_name.trim()) return 'Le nom du produit est obligatoire.';
        if (!form.product_description.trim()) return 'La description est obligatoire.';
        if (!form.category_id) return 'Choisissez une catégorie.';
        if (form.price === '' || Number(form.price) < 0 || Number.isNaN(Number(form.price))) return 'Le prix doit être un nombre positif ou nul.';
        if (!/^\d+$/.test(String(form.stock))) return 'Le stock doit être un nombre entier positif ou nul.';
        const image = form.product_image_url.trim();
        if (image && !/^(\/|https?:\/\/)/i.test(image)) return "L'adresse de l'image doit commencer par / ou http(s)://";
        return '';
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        const problem = validateForm();
        if (problem) {
            setFormError(problem);
            return;
        }

        // champs vides → null (la sous-table accepte des valeurs facultatives)
        const payload = {...form};
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'string') payload[key] = payload[key].trim();
        });
        payload.brand_id = payload.brand_id || null;

        setSaving(true);
        try {
            if (editing === 'create') {
                await api.post('/products', payload);
                setSuccess(`Produit « ${payload.product_name} » créé.`);
            } else {
                await api.put(`/products/${editing}`, payload);
                setSuccess(`Produit « ${payload.product_name} » mis à jour.`);
            }
            await loadProducts();
            closePanel();
        } catch (err) {
            setFormError(errorText(err, "Impossible d'enregistrer le produit"));
        } finally {
            setSaving(false);
        }
    };

    const deleteProduct = async () => {
        setConfirmDelete(false);
        try {
            await api.delete(`/products/${editing}`);
            setSuccess(`Produit « ${form.product_name} » supprimé.`);
            await loadProducts();
            closePanel();
        } catch (err) {
            // 409 : produit déjà présent dans des commandes → le message explique de passer le stock à 0
            setFormError(errorText(err, 'Impossible de supprimer le produit'));
        }
    };

    const stockBadge = (stock) => {
        if (stock <= 0) return <span className="admin-products-stock admin-products-stock-out">Rupture</span>;
        if (stock <= LOW_STOCK) return <span className="admin-products-stock admin-products-stock-low">{stock} · bas</span>;
        return <span className="admin-products-stock">{stock}</span>;
    };

    const formatPrice = (price) => `${Number(price).toFixed(2).replace('.', ',')} €`;

    const isCreating = editing === 'create';

    return (
        <div className="admin-products">
            <div className="admin-products-header">
                <div>
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Produits</h3>
                    <p className="font-size-125em subtitle c-secondary m-0">Le catalogue de la boutique : prix, stock et fiches</p>
                </div>
                <button type="button" className="admin-products-add" onClick={openCreate}>
                    + Nouveau produit
                </button>
            </div>

            {error && <p className="purchase-error">{error}</p>}
            {success && <p className="admin-products-success" role="status">{success}</p>}

            {loaded && !error && products.length === 0 && (
                <p className="font-size-125em c-secondary">Aucun produit pour le moment.</p>
            )}

            {products.length > 0 && (
                <div className="admin-toolbar">
                    <input type="search" className="admin-search" placeholder="Rechercher un nom, une marque, une origine ou un n°"
                           aria-label="Rechercher un produit"
                           value={search} onChange={resetPageAnd(setSearch)}/>

                    <select className="admin-status-select" aria-label="Filtrer par type"
                            value={typeFilter} onChange={resetPageAnd(setTypeFilter)}>
                        <option value="all">Tous les types</option>
                        {Object.keys(TYPE_LABELS).map(key => (
                            <option key={key} value={key}>{TYPE_LABELS[key]}</option>
                        ))}
                    </select>

                    <select className="admin-status-select" aria-label="Filtrer par catégorie"
                            value={categoryFilter} onChange={resetPageAnd(setCategoryFilter)}>
                        <option value="all">Toutes les catégories</option>
                        {filterCategories.map(category => (
                            <option key={category.category_id} value={category.category_id}>{categoryLabel(category)}</option>
                        ))}
                    </select>

                    <select className="admin-status-select" aria-label="Filtrer par stock"
                            value={stockFilter} onChange={resetPageAnd(setStockFilter)}>
                        <option value="all">Tous les stocks</option>
                        <option value="low">Stock bas (≤ {LOW_STOCK})</option>
                        <option value="out">En rupture</option>
                    </select>

                    <select className="admin-status-select" aria-label="Trier les produits"
                            value={sortBy} onChange={resetPageAnd(setSortBy)}>
                        <option value="name-asc">Nom (A → Z)</option>
                        <option value="price-asc">Prix croissant</option>
                        <option value="price-desc">Prix décroissant</option>
                        <option value="stock-asc">Stock croissant</option>
                        <option value="stock-desc">Stock décroissant</option>
                    </select>
                </div>
            )}

            {products.length > 0 && visibleProducts.length === 0 && (
                <p className="font-size-125em c-secondary">Aucun produit ne correspond à votre recherche.</p>
            )}

            {visibleProducts.length > 0 && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Catégorie</th>
                            <th>Marque</th>
                            <th>Prix</th>
                            <th>Stock</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pageProducts.map(product => (
                            <tr key={product.product_id}
                                onClick={() => openEdit(product.product_id)}
                                className="admin-row-clickable">
                                <td>
                                    {product.product_image_url
                                        ? <img className="admin-products-thumb" src={product.product_image_url} alt=""/>
                                        : <span className="admin-products-thumb admin-products-thumb-empty">-</span>}
                                </td>
                                <td>{product.product_name}</td>
                                <td>{TYPE_LABELS[getProductType(product)]}</td>
                                <td>{product.category_name}</td>
                                <td>{product.brand_name || '-'}</td>
                                <td className="admin-order-total">{formatPrice(product.price)}</td>
                                <td>{stockBadge(product.stock)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <nav className="admin-pagination" aria-label="Pagination des produits">
                    <button type="button" className="admin-pagination-btn"
                            disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                        ← Précédent
                    </button>
                    <span className="admin-pagination-info">
                        Page {currentPage} / {totalPages} · {visibleProducts.length} produits
                    </span>
                    <button type="button" className="admin-pagination-btn"
                            disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                        Suivant →
                    </button>
                </nav>
            )}

            {editing !== null && (
                <form className="admin-order-detail admin-products-form" ref={panelRef} onSubmit={saveProduct} noValidate>
                    <div className="admin-order-detail-head">
                        <div>
                            <h4 className="admin-order-detail-title">
                                {isCreating ? 'Nouveau produit' : form.product_name || 'Modifier le produit'}
                            </h4>
                            {!isCreating && <span className="admin-users-role">{TYPE_LABELS[form.product_type]}</span>}
                        </div>
                        <button type="button" className="admin-order-detail-close" aria-label="Fermer" onClick={closePanel}>✕</button>
                    </div>

                    <div className="admin-products-grid">
                        {isCreating && (
                            <label className="admin-products-field">
                                <span>Type de produit</span>
                                <select className="admin-status-select" value={form.product_type} onChange={setField('product_type')}>
                                    {Object.keys(TYPE_LABELS).map(key => (
                                        <option key={key} value={key}>{TYPE_LABELS[key]}</option>
                                    ))}
                                </select>
                            </label>
                        )}

                        <label className="admin-products-field admin-products-field-wide">
                            <span>Nom *</span>
                            <input type="text" maxLength={150} value={form.product_name} onChange={setField('product_name')}/>
                        </label>

                        <label className="admin-products-field">
                            <span>Catégorie *</span>
                            <select className="admin-status-select" value={form.category_id} onChange={setField('category_id')}>
                                <option value="">Choisir…</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>{categoryLabel(category)}</option>
                                ))}
                            </select>
                        </label>

                        <label className="admin-products-field">
                            <span>Marque</span>
                            <select className="admin-status-select" value={form.brand_id} onChange={setField('brand_id')}>
                                <option value="">Aucune</option>
                                {brands.map(brand => (
                                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                                ))}
                            </select>
                        </label>

                        <label className="admin-products-field">
                            <span>Prix (€) *</span>
                            <input type="number" min="0" step="0.01" value={form.price} onChange={setField('price')}/>
                        </label>

                        <label className="admin-products-field">
                            <span>Stock *</span>
                            <input type="number" min="0" step="1" value={form.stock} onChange={setField('stock')}/>
                        </label>

                        <label className="admin-products-field admin-products-field-full">
                            <span>Description *</span>
                            <textarea rows={4} maxLength={2000} value={form.product_description} onChange={setField('product_description')}/>
                        </label>

                        <label className="admin-products-field admin-products-field-full">
                            <span>Image (chemin du site ou adresse https)</span>
                            <input type="text" placeholder="/images/sachets/mon-cafe.png" value={form.product_image_url} onChange={setField('product_image_url')}/>
                        </label>

                        {form.product_image_url.trim() && (
                            <img className="admin-products-preview" src={form.product_image_url.trim()} alt="Aperçu du produit"/>
                        )}
                    </div>

                    <h5 className="admin-order-detail-subtitle">Caractéristiques · {TYPE_LABELS[form.product_type]}</h5>
                    <div className="admin-products-grid">
                        {form.product_type === 'coffee/tea/infusion' && (<>
                            <label className="admin-products-field">
                                <span>Origine</span>
                                <input type="text" value={form.origin} onChange={setField('origin')}/>
                            </label>
                            <label className="admin-products-field">
                                <span>Torréfaction</span>
                                <input type="text" value={form.roast} onChange={setField('roast')}/>
                            </label>
                            <label className="admin-products-field">
                                <span>Intensité (0 – 10)</span>
                                <input type="number" min="0" max="10" step="0.1" value={form.intensity} onChange={setField('intensity')}/>
                            </label>
                            <label className="admin-products-field">
                                <span>Poids (g)</span>
                                <input type="number" min="0" step="1" value={form.weight} onChange={setField('weight')}/>
                            </label>
                        </>)}

                        {form.product_type === 'machine' && (<>
                            <label className="admin-products-field">
                                <span>Pression / puissance</span>
                                <input type="text" value={form.pressure_power} onChange={setField('pressure_power')}/>
                            </label>
                            <label className="admin-products-field">
                                <span>Capacité du réservoir</span>
                                <input type="number" min="0" step="0.1" value={form.tank_capacity} onChange={setField('tank_capacity')}/>
                            </label>
                            <label className="admin-products-field">
                                <span>Broyeur</span>
                                <input type="text" value={form.grinder} onChange={setField('grinder')}/>
                            </label>
                        </>)}

                        {form.product_type === 'accessory' && (<>
                            <label className="admin-products-field">
                                <span>Matière</span>
                                <input type="text" value={form.material} onChange={setField('material')}/>
                            </label>
                            <label className="admin-products-field">
                                <span>Capacité</span>
                                <input type="number" min="0" step="0.1" value={form.capacity} onChange={setField('capacity')}/>
                            </label>
                            <label className="admin-products-field">
                                <span>Couleur</span>
                                <input type="text" value={form.color} onChange={setField('color')}/>
                            </label>
                        </>)}
                    </div>

                    {formError && <p className="purchase-error" role="alert">{formError}</p>}

                    <div className="admin-products-actions">
                        <button type="submit" className="admin-products-add" disabled={saving}>
                            {saving ? 'Enregistrement…' : isCreating ? 'Créer le produit' : 'Enregistrer'}
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
                isOpen={confirmDelete}
                title="Supprimer le produit"
                message={<>
                    Êtes-vous sûr de vouloir supprimer <strong>{form.product_name}</strong> ? Il disparaîtra
                    du catalogue et des paniers. Un produit déjà présent dans une commande ne peut pas être
                    supprimé : mettez alors son stock à 0.
                </>}
                confirmLabel="Supprimer"
                cancelLabel="Retour"
                onCancel={() => setConfirmDelete(false)}
                onConfirm={deleteProduct}
            />
        </div>
    );
};

export default AdminProducts;
