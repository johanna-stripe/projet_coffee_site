import {BrowserRouter, Route, Routes} from "react-router-dom";
import Accueil from "./pages/Accueil.jsx";
import NavBar from "./components/layout/NavBar.jsx";
import Footer from "./components/layout/Footer.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {CartProvider} from "./context/CartContext.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";
import {CATEGORIES, CLIENT_PATHS} from "./routes/paths.js";
import ProductPage from "./pages/ProductPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import TrustBadges from "./components/layout/TrustBadges.jsx";
import TopBanner from "./components/layout/TopBanner.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import AdminRoute from "./components/auth/AdminRoute.jsx";
import React from "react";


export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <ScrollToTop/>
                    <TopBanner/>
                    <NavBar/>
                    {/* mettre la nav bar ici comme ça elle engloble toutes les routes */}
                    <Routes>
                        <Route element={<AdminRoute/>}>
                            <Route path={CLIENT_PATHS.admin} element={<h1>Admin</h1>}/>
                        </Route>                        <Route path={CLIENT_PATHS.home} element={<Accueil/>}/>
                        {CATEGORIES.map((cat => (
                            <Route
                                key={cat.id}
                                path={cat.path}
                                // key : chaque catégorie repart avec ses filtres à zéro (sinon React garde l'état d'une page à l'autre)
                                element={<ProductPage key={cat.id} categoryId={cat.id} title={cat.title}/>}
                            />
                        )))}
                        <Route path={CLIENT_PATHS.product} element={<ProductDetailPage/>}/>
                    </Routes>
                    <TrustBadges/>
                    <Footer/>
                    <CartDrawer/>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
