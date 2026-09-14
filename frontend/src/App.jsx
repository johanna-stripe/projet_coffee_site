import {BrowserRouter, Route, Routes} from "react-router-dom";
import Accueil from "./pages/Accueil.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {CLIENT_PATHS} from "./routes/paths.js";


export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <NavBar/>
                {/* mettre la nav bar ici comme ça elle engloble toutes les routes */}
                <Routes>
                    <Route path={CLIENT_PATHS.home} element={<Accueil/>}/>
                    {/*<Route path={CLIENT_PATHS.cafeGrain} element={<CafeGrain/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.cafeMoulu} element={<CafeMoulu/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.the} element{<The/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.infusion} element={<Infusion/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.accessoires} element={<Accessoires/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.machines} element={<Machines/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.quiSommesNous} element={<QuiSommesNous/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.login} element={<login/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.register} element={<Register/>}/>*/}
                    {/*<Route path={CLIENT_PATHS.admin} element={<AdminDashboard/>}/>*/}
                </Routes>
                <Footer/>
            </AuthProvider>
        </BrowserRouter>
    );
}
