import {
    useState,
    useEffect
} from "react";
import {Link} from "react-router-dom";

const Slider = ({slides}) => {
    /*
    une fonction qui reçoit un paramètre (un objet props)
    En React, tout ce que le parent passe (slides={slides} côté Accueil) arrive ici sous forme d'un objet { slides, autrePropSiExiste, ... }.
    ({ slides }) : c'est de la déstructuration. Plutôt que d'écrire :
    const Slider = (props) => {
        const slides = props.slides;
     */

    const [currentSlide, setCurrentSlide] = useState(0);
    //useState : Permet à un composant de conserver une valeur d'un rendu à l'autre, ici initialisée à 0.
    //currentSlide : valeur actuelle, ici 0
    //setCurrentSlide : fonction pour la modifier

    const goToPrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        //le modulo (%) fait boucler l'index.
        // Exemple avec 3 slides (slides.length = 3) : si prev = 0 (premier slide) et qu'on clique "précédent", on veut arriver à l'index 2 (dernier slide), pas -1 (qui n'existe pas).
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 7000); // 7000 ms = 7 secondes

        return () => clearInterval(interval);
        // le "cleanup" : à chaque fois que ce useEffect est relancé (ou que le composant est démonté),
        // on arrête l'ancien intervalle avant d'en créer un nouveau, sinon plusieurs intervalles
        // tourneraient en même temps et le défilement s'accélérerait au lieu de rester à 15s.
    }, [slides.length]);
    // dépendance : si le nombre de slides change un jour, on relance proprement l'intervalle


    return (
        <section className="slider h-500px">
            <div className="slider-images w-100 h-100 position-relative overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="slider-slide position-absolute w-100 h-100"
                        style={{
                            opacity: index === currentSlide ? 1 : 0,
                            transition: "opacity 0.6s ease-in-out",
                            pointerEvents: index === currentSlide ? "auto" : "none",
                        }}

                    >
                        <img
                            className="w-100 h-100 block object-fit-cover"
                            src={slide.img}
                            alt={slide.alt}
                        />
                        { /*les accolades permettent d'injecter une valeur JavaScript dans le JSX. Ici, on affiche dynamiquement l'image du slide courant.*/}

                        <div
                            className="slider-text h-50 position-absolute flex flex-direction-column align-items-start justify-content-center">
                            <p className="letter-spacing-3px uppercase c-tertiary">{slide.eyebrow}</p>
                            <h1 className="m-0">{slide.title}</h1>
                            <p className="font-size-150em">{slide.text}</p>
                            {/* le bouton n'apparaît que si le slide a un path (cf. slides dans Accueil.jsx) */}
                            {slide.path && (
                                <Link to={slide.path}
                                      className="c-white uppercase font-size-150em text-decoration-none b-quaternary p-15px">
                                    {slide.cta}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}


                <button className="slider-arrow slider-arrow-prev cursor-pointer" onClick={goToPrev}
                        aria-label="Slide précédent">
                    {/*on attache la fonction goToPrev à l'événement clic. Sans parenthèses — onClick={goToPrev} passe la fonction elle-même (elle sera appelée au clic), alors que onClick={goToPrev()} l'exécuterait immédiatement au chargement, ce qui serait un bug.*/}
                    ❮
                </button>
                <button className="slider-arrow slider-arrow-next cursor-pointer" onClick={goToNext}
                        aria-label="Slide suivant">
                    ❯
                </button>

                <div className="slider-dots">
                    {slides.map((_, index) => (
                        //slides.map(...) : on parcourt le tableau slides pour générer un <span> par slide (donc 3 points ici).
                        //(_, index) : le premier paramètre de .map() serait l'élément du tableau (un objet slide), mais on ne s'en sert pas ici, donc on met _ par convention ("je l'ignore"). Le deuxième paramètre, index, est la position (0, 1, 2...).
                        <span
                            key={index}
                            //React exige une prop key unique sur chaque élément généré par une boucle, pour optimiser le rendu de listes.
                            className={`dot ${index === currentSlide ? "active" : ""}`}
                            //template string qui ajoute la classe active seulement si ce point correspond au slide actuellement affiché
                            onClick={() => setCurrentSlide(index)}
                            //ici, contrairement à goToPrev, on doit utiliser une fonction fléchée () => ... (et non juste setCurrentSlide(index)) car on doit passer un argument précis (index). Sans le () =>, setCurrentSlide(index) s'exécuterait immédiatement à chaque rendu de la boucle, au lieu d'attendre le clic.
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );

};

export default Slider;