import {BrowserRouter, Route, Routes} from "react-router-dom";
import Accueil from "./pages/Accueil.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {CATEGORIES, CLIENT_PATHS} from "./routes/paths.js";
import ProductPage from "./pages/ProductPage.jsx";
import TrustBadges from "./components/TrustBadges.jsx";
import React from "react";


export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <NavBar/>
                {/* mettre la nav bar ici comme ça elle engloble toutes les routes */}
                <Routes>
                    <Route path={CLIENT_PATHS.home} element={<Accueil/>}/>
                    {CATEGORIES.map((cat => (
                        <Route
                            key={cat.id}
                            path={cat.path}
                            element={<ProductPage categoryId={cat.id} title={cat.title}/>}
                        />
                    )))}
                </Routes>
                <TrustBadges/>
                <Footer/>
            </AuthProvider>
        </BrowserRouter>
    );
}
