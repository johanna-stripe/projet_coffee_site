import {BrowserRouter, Route, Routes} from "react-router-dom";
import Accueil from "./1.pages/Accueil.jsx";


export default function App() {
  return (
      <BrowserRouter>
        {/*  mettre la nav bar ici comme ça elle engloble toutes les routes */}
        <Routes>
          <Route path="/" element={<Accueil/>}/>
          {/*<Route path="/collection" element={<CaféGrain/>}/>*/}
          {/*<Route path="/collection" element={<CaféMoulu/>}/>*/}
          {/*<Route path="/collection" element={<Thé/>}/>*/}
          {/*<Route path="/collection" element={<Infusion/>}/>*/}
          {/*<Route path="/collection" element={<Accessoires/>}/>*/}
          {/*<Route path="/collection" element={<Machines/>}/>*/}
          {/*<Route path="/pages" element={<Qui-sommes-nous/>}/>*/}
        </Routes>
      </BrowserRouter>
  );
}
