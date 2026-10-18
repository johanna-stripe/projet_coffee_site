import {useEffect} from "react";
import {useLocation} from "react-router-dom";

// React Router change de page sans recharger : le scroll reste où il était.
// À chaque changement de route, on remonte donc en haut de la page.
const ScrollToTop = () => {
    const {pathname} = useLocation()

    useEffect(() => {
        // "instant" : le html a scroll-behavior: smooth, on ne veut pas d'animation à l'arrivée sur la page
        window.scrollTo({top: 0, left: 0, behavior: "instant"})
    }, [pathname])

    return null
}

export default ScrollToTop
