import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
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
import AdminLayout from "./components/admin/AdminLayout.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import Cgv from "./pages/Cgv.jsx";
import CookieBanner from "./components/layout/CookieBanner.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import AdminProducts from "./components/admin/AdminProducts.jsx";


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
                        <Route element={<AdminRoute/>}>           {/* garde : qui peut entrer */}
                            <Route element={<AdminLayout/>}>      {/* cadre : menu + Outlet */}
                                <Route path={CLIENT_PATHS.admin} element={<Navigate to={CLIENT_PATHS.adminProducts} replace/>}/>
                                <Route path={CLIENT_PATHS.adminProducts} element={<AdminProducts/>}/>
                                <Route path={CLIENT_PATHS.adminOrders} element={<AdminOrders/>}/>
                                <Route path={CLIENT_PATHS.adminUsers} element={<AdminUsers/>}/>
                            </Route>
                        </Route>
                        <Route path={CLIENT_PATHS.home} element={<Accueil/>}/>
                        {CATEGORIES.map((cat => (
                            <Route
                                key={cat.id}
                                path={cat.path}
                                // key : chaque catégorie repart avec ses filtres à zéro (sinon React garde l'état d'une page à l'autre)
                                element={<ProductPage key={cat.id} categoryId={cat.id} title={cat.title}/>}
                            />
                        )))}
                        <Route path={CLIENT_PATHS.search} element={<SearchPage/>}/>
                        <Route path={CLIENT_PATHS.product} element={<ProductDetailPage/>}/>
                        <Route path={CLIENT_PATHS.mentionsLegales} element={<MentionsLegales/>}/>
                        <Route path={CLIENT_PATHS.cgv} element={<Cgv/>}/>
                        <Route path={CLIENT_PATHS.checkout} element={<CheckoutPage/>}/>
                        <Route path={CLIENT_PATHS.orderConfirmation} element={<OrderConfirmationPage/>}/>
                    </Routes>
                    <TrustBadges/>
                    <Footer/>
                    <CartDrawer/>
                    <CookieBanner/>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
