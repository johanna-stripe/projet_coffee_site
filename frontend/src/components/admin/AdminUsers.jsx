import React, {useEffect, useRef, useState} from 'react';
import api from "../../axios/axiosConfig.js";
import {useAuth} from "../../context/AuthContext.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import "../../style/adminOrders.css";   // classes communes : toolbar, recherche, tableau, pagination
import "../../style/adminUsers.css";
import "../../style/adminProducts.css";   // champs de formulaire (admin-products-field / -grid) réutilisés pour la création

const PAGE_SIZE = 10;   // utilisateurs affichés par page

const ROLE_LABELS = {ADMIN: 'Admin', USER: 'Client'};

// Date au format attendu par <input type="date"> (AAAA-MM-JJ, en heure locale)
const toInputDay = (value) => {
    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const EMPTY_NEW_USER = {first_name: '', last_name: '', username: '', email: '', phone: '', role: 'USER', password: ''};

// Mot de passe temporaire de 12 caractères (sans 0/O/1/l/I pour éviter les confusions à la dictée)
const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const randoms = crypto.getRandomValues(new Uint32Array(12));
    return Array.from(randoms, n => chars[n % chars.length]).join('');
};

const AdminUsers = () => {
    const {user: currentUser} = useAuth()   // l'admin connecté : il ne peut pas modifier son propre compte
    const [users, setUsers] = useState([])
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');   // texte tapé dans la recherche
    const [roleFilter, setRoleFilter] = useState('all');       // 'all' ou 'ADMIN' / 'USER'
    const [statusFilter, setStatusFilter] = useState('all');   // 'all', 'active' ou 'inactive'
    const [sortBy, setSortBy] = useState('date-desc');         // tri sur la date d'inscription
    const [page, setPage] = useState(1);        // page affichée (1 = la première)
    const [selectedUser, setSelectedUser] = useState(null);   // le détail de l'utilisateur ouvert
    const [detailError, setDetailError] = useState('');
    const [identity, setIdentity] = useState({username: '', created_at: ''});   // identifiant et date d'inscription en cours de saisie
    const [creating, setCreating] = useState(false);          // formulaire « ajouter un utilisateur » ouvert ou non
    const [newUser, setNewUser] = useState(EMPTY_NEW_USER);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const createRef = useRef(null);
    const detailRef = useRef(null);   // panneau de détail, pour y descendre au clic
    const [confirmDeactivate, setConfirmDeactivate] = useState(false);   // fenêtre « désactiver le compte ? » ouverte ou non

    // Minuscules + sans accents : "Éloïse" et "eloise" se trouvent mutuellement
    const normalize = (text) => (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    // Chaque mot tapé doit se retrouver dans le prénom, le nom, le username ou l'email
    const visibleUsers = users.filter(user => {
        const words = normalize(search).split(/\s+/).filter(Boolean);
        const haystack = normalize(
            `${user.first_name} ${user.last_name} ${user.last_name} ${user.first_name} ${user.username} ${user.email}`
        );
        return words.every(word => haystack.includes(word));
    })
        .filter(user => roleFilter === 'all' || user.role === roleFilter)
        .filter(user => statusFilter === 'all' || (statusFilter === 'active') === !!user.is_active)
        // filter() renvoie un nouveau tableau : sort() ne modifie donc pas l'état `users`
        .sort((a, b) => sortBy === 'date-asc'
            ? new Date(a.created_at) - new Date(b.created_at)
            : new Date(b.created_at) - new Date(a.created_at));

    // Pagination : on découpe la liste déjà filtrée
    const totalPages = Math.max(1, Math.ceil(visibleUsers.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageUsers = visibleUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users')
            setUsers(response.data.results || [])
            setError('')
        } catch (err) {
            if (err.response?.status === 404) {
                setUsers([]);
            } else {
                setError(err.response?.data?.error || err.response?.data?.message || 'Impossible de charger les utilisateurs');
            }
        }
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    // À l'ouverture du formulaire de création, on descend dessus (comme pour le détail)
    useEffect(() => {
        if (creating) {
            createRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [creating]);

    const openCreate = () => {
        setSelectedUser(null)
        setNewUser(EMPTY_NEW_USER)
        setCreateError('')
        setCreateSuccess('')
        setCreating(true)
    };

    const setNewField = (name) => (e) => setNewUser({...newUser, [name]: e.target.value});

    const createUser = async (e) => {
        e.preventDefault()
        const email = newUser.email.trim()
        const username = newUser.username.trim() || `${newUser.first_name} ${newUser.last_name}`.trim()

        if (!newUser.first_name.trim() || !newUser.last_name.trim()) return setCreateError('Le prénom et le nom sont obligatoires.')
        if (!/^\S+@\S+\.\S+$/.test(email)) return setCreateError("L'adresse email n'est pas valide.")
        if (newUser.password.length < 8 || newUser.password.length > 16) return setCreateError('Le mot de passe doit contenir de 8 à 16 caractères.')

        setSaving(true)
        try {
            await api.post('/users/newUser', {
                first_name: newUser.first_name.trim(),
                last_name: newUser.last_name.trim(),
                username,
                email,
                phone: newUser.phone.trim() || undefined,
                role: newUser.role,
                password: newUser.password,
            })
            setCreateSuccess(`Compte créé pour ${username}. Transmettez-lui son mot de passe temporaire.`)
            setCreating(false)
            await fetchUsers()
        } catch (err) {
            setCreateError(err.response?.data?.message || err.response?.data?.error || "Impossible de créer l'utilisateur")
        } finally {
            setSaving(false)
        }
    };

    // Dès qu'un utilisateur est ouvert (ou qu'on en ouvre un autre), on descend sur son détail
    useEffect(() => {
        if (selectedUser) {
            detailRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [selectedUser?.id]);

    const openUser = async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`)
            setCreating(false)   // un seul panneau à la fois
            setSelectedUser({...response.data.results, id: userId})
            setIdentity({username: response.data.results.username, created_at: toInputDay(response.data.results.created_at)})
            setDetailError('')
        } catch (err) {
            setDetailError(err.response?.data?.message || err.response?.data?.error || "Impossible de charger l'utilisateur");
        }
    };

    // Met à jour le panneau ET le tableau avec les champs modifiés
    const applyChange = (changes) => {
        setSelectedUser({...selectedUser, ...changes})
        setUsers(users.map(user => user.id === selectedUser.id ? {...user, ...changes} : user))
        setDetailError('')
    };

    // Enregistre l'identifiant et/ou la date d'inscription modifiés (seuls les champs changés sont envoyés)
    const saveIdentity = async () => {
        const changes = {}
        if (identity.username.trim() !== selectedUser.username) changes.username = identity.username.trim()
        if (identity.created_at !== toInputDay(selectedUser.created_at)) changes.created_at = identity.created_at
        if (!identity.username.trim()) return setDetailError("L'identifiant ne peut pas être vide.")
        if (!identity.created_at) return setDetailError("La date d'inscription est obligatoire.")
        try {
            await api.patch(`/users/update-user/${selectedUser.id}`, changes)
            applyChange({
                username: identity.username.trim(),
                created_at: `${identity.created_at}T12:00:00`   // midi : évite qu'un décalage d'heure change le jour affiché
            })
        } catch (err) {
            setDetailError(err.response?.data?.message || err.response?.data?.error || 'Impossible de modifier ces informations');
        }
    };

    const changeRole = async (newRole) => {
        try {
            await api.patch(`/users/change-role/${selectedUser.id}`, {role: newRole})
            applyChange({role: newRole})
        } catch (err) {
            setDetailError(err.response?.data?.message || err.response?.data?.error || 'Impossible de modifier le rôle');
        }
    };

    const changeActive = async (activate) => {
        try {
            await api.patch(`/users/${activate ? 'activate-user' : 'deactivate-user'}/${selectedUser.id}`)
            applyChange({is_active: activate ? 1 : 0})
        } catch (err) {
            setDetailError(err.response?.data?.message || err.response?.data?.error || 'Impossible de modifier le statut du compte');
        }
    };

    return (
        <div className="admin-users">
            <div className="admin-users-header">
                <div>
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Utilisateurs</h3>
                    <p className="font-size-125em subtitle c-secondary m-0">Tous les clients et utilisateurs de la boutique</p>
                </div>
                <button type="button" className="admin-products-add" onClick={openCreate}>
                    + Ajouter un utilisateur
                </button>
            </div>

            {createSuccess && <p className="admin-products-success" role="status">{createSuccess}</p>}

            {error && <p className="purchase-error">{error}</p>}

            {!error && users.length === 0 && (
                <p className="font-size-125em c-secondary">Aucun utilisateur pour le moment.</p>
            )}

            {users.length > 0 && (
                <div className="admin-toolbar">
                    <input type="search" className="admin-search" placeholder="Rechercher un nom, un identifiant ou un email"
                           aria-label="Rechercher un utilisateur par nom, identifiant ou email"
                           value={search} onChange={(e) => {setSearch(e.target.value); setPage(1)}}/>

                    <select className="admin-status-select" aria-label="Filtrer par rôle"
                            value={roleFilter} onChange={(e) => {setRoleFilter(e.target.value); setPage(1)}}>
                        <option value="all">Tous les rôles</option>
                        {Object.keys(ROLE_LABELS).map(key => (
                            <option key={key} value={key}>{ROLE_LABELS[key]}</option>
                        ))}
                    </select>

                    <select className="admin-status-select" aria-label="Filtrer par statut"
                            value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setPage(1)}}>
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Désactivés</option>
                    </select>

                    <select className="admin-status-select" aria-label="Trier par date d'inscription"
                            value={sortBy} onChange={(e) => {setSortBy(e.target.value); setPage(1)}}>
                        <option value="date-desc">Inscrits récemment d'abord</option>
                        <option value="date-asc">Inscrits depuis longtemps d'abord</option>
                    </select>
                </div>
            )}

            {users.length > 0 && visibleUsers.length === 0 && (
                <p className="font-size-125em c-secondary">Aucun utilisateur ne correspond à votre recherche.</p>
            )}

            {visibleUsers.length > 0 && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Identifiant</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Inscrit le</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pageUsers.map(user => (
                            <tr key={user.id}
                                onClick={() => openUser(user.id)}
                                className="admin-row-clickable">
                                {/* un compte sans fiche client (ex. admin créé à la main) n'a pas de prénom/nom */}
                                <td>{user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}` : '-'}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || '-'}</td>
                                <td>
                                    <span className={`admin-users-role ${user.role === 'ADMIN' ? 'admin-users-role-admin' : ''}`}>
                                        {ROLE_LABELS[user.role] || user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`admin-users-status ${user.is_active ? 'admin-users-status-active' : 'admin-users-status-inactive'}`}>
                                        {user.is_active ? 'Actif' : 'Désactivé'}
                                    </span>
                                </td>
                                <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <nav className="admin-pagination" aria-label="Pagination des utilisateurs">
                    <button type="button" className="admin-pagination-btn"
                            disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                        ← Précédent
                    </button>
                    <span className="admin-pagination-info">
                        Page {currentPage} / {totalPages} · {visibleUsers.length} utilisateurs
                    </span>
                    <button type="button" className="admin-pagination-btn"
                            disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                        Suivant →
                    </button>
                </nav>
            )}

            {creating && (
                <form className="admin-order-detail" ref={createRef} onSubmit={createUser} noValidate>
                    <div className="admin-order-detail-head">
                        <h4 className="admin-order-detail-title">Nouvel utilisateur</h4>
                        <button type="button" className="admin-order-detail-close" aria-label="Fermer"
                                onClick={() => setCreating(false)}>✕</button>
                    </div>

                    <div className="admin-products-grid">
                        <label className="admin-products-field">
                            <span>Prénom *</span>
                            <input type="text" value={newUser.first_name} onChange={setNewField('first_name')}/>
                        </label>
                        <label className="admin-products-field">
                            <span>Nom *</span>
                            <input type="text" value={newUser.last_name} onChange={setNewField('last_name')}/>
                        </label>
                        <label className="admin-products-field">
                            <span>Identifiant</span>
                            <input type="text" placeholder="Par défaut : prénom nom" value={newUser.username} onChange={setNewField('username')}/>
                        </label>
                        <label className="admin-products-field">
                            <span>Email *</span>
                            <input type="email" value={newUser.email} onChange={setNewField('email')}/>
                        </label>
                        <label className="admin-products-field">
                            <span>Téléphone</span>
                            <input type="tel" value={newUser.phone} onChange={setNewField('phone')}/>
                        </label>
                        <label className="admin-products-field">
                            <span>Rôle</span>
                            <select value={newUser.role} onChange={setNewField('role')}>
                                {Object.keys(ROLE_LABELS).map(key => (
                                    <option key={key} value={key}>{ROLE_LABELS[key]}</option>
                                ))}
                            </select>
                        </label>
                        <label className="admin-products-field admin-products-field-wide">
                            <span>Mot de passe temporaire * (8 à 16 caractères)</span>
                            <input type="text" autoComplete="off" value={newUser.password} onChange={setNewField('password')}/>
                        </label>
                        <div className="admin-products-field">
                            <span>&nbsp;</span>
                            <button type="button" className="admin-users-action"
                                    onClick={() => setNewUser({...newUser, password: generatePassword()})}>
                                Générer un mot de passe
                            </button>
                        </div>
                    </div>

                    {createError && <p className="purchase-error" role="alert">{createError}</p>}

                    <div className="admin-products-actions">
                        <button type="submit" className="admin-products-add" disabled={saving}>
                            {saving ? 'Création…' : "Créer l'utilisateur"}
                        </button>
                        <button type="button" className="admin-users-action" onClick={() => setCreating(false)}>Annuler</button>
                    </div>
                </form>
            )}

            {detailError && <p className="purchase-error">{detailError}</p>}

            {selectedUser && (() => {
                const fullName = [selectedUser.first_name, selectedUser.last_name].filter(Boolean).join(' ');
                // le bouton « Enregistrer » n'apparaît que si l'identifiant ou la date a changé
                const identityChanged = identity.username !== selectedUser.username
                    || identity.created_at !== toInputDay(selectedUser.created_at);
                const isSelf = Number(selectedUser.id) === Number(currentUser?.id);   // le panneau ouvert est mon propre compte
                return (
                    <div className="admin-order-detail" ref={detailRef}>
                        <div className="admin-order-detail-head">
                            <div>
                                <h4 className="admin-order-detail-title">{fullName || selectedUser.username}</h4>
                                <span className={`admin-users-role ${selectedUser.role === 'ADMIN' ? 'admin-users-role-admin' : ''}`}>
                                    {ROLE_LABELS[selectedUser.role] || selectedUser.role}
                                </span>
                                {' '}
                                <span className={`admin-users-status ${selectedUser.is_active ? 'admin-users-status-active' : 'admin-users-status-inactive'}`}>
                                    {selectedUser.is_active ? 'Actif' : 'Désactivé'}
                                </span>
                            </div>
                            <button type="button" className="admin-order-detail-close" aria-label="Fermer"
                                    onClick={() => setSelectedUser(null)}>✕</button>
                        </div>

                        <dl className="admin-order-detail-info">
                            <div>
                                <dt>Rôle</dt>
                                <dd>
                                    <select className="admin-status-select" aria-label="Changer le rôle"
                                            value={selectedUser.role} disabled={isSelf}
                                            onChange={(e) => changeRole(e.target.value)}>
                                        {Object.keys(ROLE_LABELS).map(key => (
                                            <option key={key} value={key}>{ROLE_LABELS[key]}</option>
                                        ))}
                                    </select>
                                </dd>
                            </div>
                            <div>
                                <dt>Compte</dt>
                                <dd>
                                    {selectedUser.is_active ? (
                                        <button type="button" className="admin-users-action admin-users-action-danger"
                                                disabled={isSelf} onClick={() => setConfirmDeactivate(true)}>
                                            Désactiver le compte
                                        </button>
                                    ) : (
                                        <button type="button" className="admin-users-action"
                                                onClick={() => changeActive(true)}>
                                            Réactiver le compte
                                        </button>
                                    )}
                                </dd>
                            </div>
                            {/* saut de ligne : Identifiant et la suite passent sous Rôle / Compte */}
                            <div className="admin-users-detail-break"/>
                            <div>
                                <dt>Identifiant</dt>
                                <dd>
                                    <input type="text" className="admin-users-input" aria-label="Identifiant"
                                           value={identity.username}
                                           onChange={(e) => setIdentity({...identity, username: e.target.value})}/>
                                </dd>
                            </div>
                            <div>
                                <dt>Email de connexion</dt>
                                <dd>{selectedUser.email}</dd>
                            </div>
                            <div>
                                <dt>Email de contact</dt>
                                <dd>{selectedUser.customer_email || '-'}</dd>
                            </div>
                            <div>
                                <dt>Téléphone</dt>
                                <dd>{selectedUser.phone || '-'}</dd>
                            </div>
                            <div>
                                <dt>Date de naissance</dt>
                                <dd>{selectedUser.birth_date ? new Date(selectedUser.birth_date).toLocaleDateString('fr-FR') : '-'}</dd>
                            </div>
                            <div>
                                <dt>Inscrit le</dt>
                                <dd>
                                    <input type="date" className="admin-users-input" aria-label="Date d'inscription"
                                           max={toInputDay(new Date())}
                                           value={identity.created_at}
                                           onChange={(e) => setIdentity({...identity, created_at: e.target.value})}/>
                                </dd>
                            </div>
                            {identityChanged && (
                                <div>
                                    <dt>&nbsp;</dt>
                                    <dd>
                                        <button type="button" className="admin-users-action" onClick={saveIdentity}>Enregistrer</button>
                                    </dd>
                                </div>
                            )}
                        </dl>
                        {isSelf && (
                            <p className="admin-users-self-note">
                                C'est votre compte : vous ne pouvez ni changer votre rôle ni le désactiver.
                            </p>
                        )}
                    </div>
                )
            })()}

            <ConfirmModal
                isOpen={confirmDeactivate && !!selectedUser}
                title="Désactiver le compte"
                message={<>
                    Êtes-vous sûr de vouloir désactiver le compte de <strong>{selectedUser?.username}</strong> ?
                    Cette personne ne pourra plus se connecter tant que vous ne l'aurez pas réactivé.
                </>}
                confirmLabel="Désactiver"
                cancelLabel="Retour"
                onCancel={() => setConfirmDeactivate(false)}
                onConfirm={() => {
                    setConfirmDeactivate(false)
                    changeActive(false)
                }}
            />
        </div>
    );
};

export default AdminUsers;
