import React, {useEffect, useState} from "react";
import api from "../../axios/axiosConfig.js";
import {useAuth} from "../../context/AuthContext.jsx";
import '../../style/productReviews.css'

const formatDate = (date) =>
    new Date(date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})

const Stars = ({value}) => (
    <span className="product-reviews__stars" aria-hidden="true">
        {'★'.repeat(value)}{'☆'.repeat(5 - value)}
    </span>
)

/*
Avis clients d'un produit. Les avis sont stockés dans MongoDB (GET/POST /products/:id/reviews).
Lecture : ouverte à tous. Écriture : réservée aux utilisateurs connectés (sinon on ouvre la modale de connexion).
*/
const ProductReviews = ({productId}) => {
    const {isAuthenticated, openAuthModal} = useAuth()

    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState(null)

    useEffect(() => {
        const loadReviews = async () => {
            try {
                setLoading(true)
                setLoadError(null)
                const response = await api.get(`/products/${productId}/reviews`)
                setReviews(response.data)
            } catch (err) {
                setLoadError('Impossible de charger les avis')
            } finally {
                setLoading(false)
            }
        }
        loadReviews()
    }, [productId])

    const average = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0

    const handleSubmit = async (event) => {
        event.preventDefault()
        setFormError(null)

        if (rating === 0) return setFormError('Choisissez une note de 1 à 5 étoiles')
        if (comment.trim().length < 3) return setFormError('Votre commentaire est trop court')

        try {
            setSubmitting(true)
            const response = await api.post(`/products/${productId}/reviews`, {rating, comment})
            setReviews((previous) => [response.data, ...previous]) // le nouvel avis s'affiche en premier
            setRating(0)
            setComment('')
        } catch (err) {
            // 409 = l'utilisateur a déjà donné son avis sur ce produit
            setFormError(err.response?.status === 409
                ? 'Vous avez déjà donné votre avis sur ce produit'
                : err.response?.data?.message || "Impossible d'envoyer votre avis")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="product-reviews" aria-labelledby="product-reviews-title">
            <div className="product-reviews__layout">
                <div className="product-reviews__list">
                    <h2 id="product-reviews-title" className="product-reviews__title">Avis clients</h2>

                    {reviews.length > 0 && (
                        <p className="product-reviews__summary" aria-label={`Note moyenne : ${average.toFixed(1)} sur 5`}>
                            <Stars value={Math.round(average)}/>
                            <span>{average.toFixed(1).replace('.', ',')} / 5 · {reviews.length} avis</span>
                        </p>
                    )}

                    {loading && <p>Chargement des avis...</p>}
                    {loadError && <p>{loadError}</p>}
                    {!loading && !loadError && reviews.length === 0 && (
                        <p className="product-reviews__empty">Aucun avis pour le moment. Soyez le premier à donner le vôtre.</p>
                    )}

                    <ul>
                        {reviews.map((review) => (
                            <li key={review._id} className="product-reviews__item">
                                <div className="product-reviews__item-head">
                                    <Stars value={review.rating}/>
                                    <span className="product-reviews__author">{review.username}</span>
                                    <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
                                </div>
                                <p>{review.comment}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="product-reviews__form-wrapper">
                    {isAuthenticated ? (
                        <form className="product-reviews__form" onSubmit={handleSubmit} noValidate>
                            <p className="product-reviews__label">Donner mon avis</p>

                            <div className="product-reviews__rating" role="group" aria-label="Votre note">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={star <= rating ? 'is-active' : ''}
                                        aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                                        aria-pressed={star === rating}
                                        onClick={() => setRating(star)}>
                                        ★
                                    </button>
                                ))}
                            </div>

                            <label htmlFor="review-comment" className="product-reviews__label">Votre commentaire</label>
                            <textarea
                                id="review-comment"
                                rows="5"
                                maxLength="1000"
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                            />

                            {formError && <p className="product-reviews__error" role="alert">{formError}</p>}

                            <button type="submit" className="product-reviews__submit" disabled={submitting}>
                                {submitting ? 'Envoi...' : 'Publier mon avis'}
                            </button>
                        </form>
                    ) : (
                        <div className="product-reviews__login">
                            <p>Connectez-vous pour partager votre expérience avec ce produit.</p>
                            <button type="button" className="product-reviews__submit" onClick={openAuthModal}>
                                Me connecter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProductReviews
