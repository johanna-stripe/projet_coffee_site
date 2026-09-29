// Pour l'affichage texte classique : "03/09/1995"
export const formatDateFR = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Pour la balise <input type="date"> : "1995-09-03" (YYYY-MM-DD obligatoire)
export const formatDateISO = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};