import React, {useEffect, useRef, useState} from 'react';
import api from "../../axios/axiosConfig.js";
import {useAuth} from "../../context/AuthContext.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import "../../style/adminOrders.css";   // classes communes : toolbar, recherche, tableau, pagination
import "../../style/adminUsers.css";

const PAGE_SIZE = 10;   // utilisateurs affichés par page

const ROLE_LABELS = {ADMIN: 'Admin', USER: 'Client'};

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

    useEffect(() => {
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
        fetchUsers()
    }, []);

    // Dès qu'un utilisateur est ouvert (ou qu'on en ouvre un autre), on descend sur son détail
    useEffect(() => {
        if (selectedUser) {
            detailRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [selectedUser?.id]);

    const openUser = async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`)
            setSelectedUser({...response.data.results, id: userId})
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
                <h3 className="font-size-2em c-secondary m-bottom-5px">Utilisateurs</h3>
                <p className="font-size-125em subtitle c-secondary m-0">Tous les clients et utilisateurs de la boutique</p>
            </div>

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

            {detailError && <p className="purchase-error">{detailError}</p>}

            {selectedUser && (() => {
                const fullName = [selectedUser.first_name, selectedUser.last_name].filter(Boolean).join(' ');
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
                                <dd>{selectedUser.username}</dd>
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
                                <dd>{new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</dd>
                            </div>
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
