import {useEffect, useState} from "react";

// Renvoie true tant que la media query correspond (ex : "(max-width: 900px)")
// et se met à jour quand la fenêtre est redimensionnée.
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

    useEffect(() => {
        const mql = window.matchMedia(query)
        const onChange = (e) => setMatches(e.matches)
        mql.addEventListener("change", onChange)
        setMatches(mql.matches)
        return () => mql.removeEventListener("change", onChange)
    }, [query])

    return matches
}

export default useMediaQuery
