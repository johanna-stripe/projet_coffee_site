// Pour l'affichage texte classique : "03/09/1995"
export const formatDateFR = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const pad = (n) => String(n).padStart(2, '0')

// Pour <input type="date"> : "1995-09-03"
export const formatDateISO = (dateString) => {
    if (!dateString) return ''

    // Déjà au format YYYY-MM-DD : on ne touche à rien
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString

    // Sinon on lit la date en heure locale (et non en UTC)
    const d = new Date(dateString)
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}