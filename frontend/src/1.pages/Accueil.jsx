import React from "react";
import './Accueil.css'

const Accueil = () => {
    return (
        <section className="explore_section">
            <p className="c-tertiary">Nos univers</p>
            <h2 className="c-secondary">Explorez notre sélection</h2>
            <div className="flex justify-content-space-evenly">
                <div className="image-container position-relative overflow-hidden">
                    <img className="w-220px h-300px block"
                         src="http://localhost:5173/src/4.assets/images/coffee/coffee_grain_moulu.jpg"
                         alt="café_grain_moulu"/>
                    <div className="position-absolute text-align-left c-white font-bold bottom-1em left-1em z-index-1">
                        <h3 className="m-0">Café grain & moulu</h3>
                        <p className="m-top-5px font-montserrat">Découvrir ❯</p>
                    </div>
                </div>
                <div className="image-container position-relative overflow-hidden">
                    <img className="w-220px h-300px block" src="http://localhost:5173/src/4.assets/images/tea/tea_3.jpg"
                         alt="café_grain_moulu"/>
                    <div className="position-absolute text-align-left c-white font-bold bottom-1em left-1em z-index-1">
                        <h3 className="m-0">Thé & infusion</h3>
                        <p className="m-top-5px">Découvrir ❯</p>
                    </div>
                </div>
                <div className="image-container position-relative overflow-hidden">
                    <img className="w-220px h-300px block"
                         src="http://localhost:5173/src/4.assets/images/coffee_machine/machine_cafe_1.jpg"
                         alt="café_grain_moulu"/>
                    <div className="position-absolute text-align-left c-white font-bold bottom-1em left-1em z-index-1">
                        <h3 className="m-0">Cafetière & théière</h3>
                        <p className="m-top-5px">Découvrir ❯</p>
                    </div>
                </div>
                <div className="image-container position-relative overflow-hidden">
                    <img className="w-220px h-300px block" src="http://localhost:5173/src/4.assets/images/tea/tea_1.jpg"
                         alt="café_grain_moulu"/>
                    <div className="position-absolute text-align-left c-white font-bold bottom-1em left-1em z-index-1">
                        <h3 className="m-0">Accessoires</h3>
                        <p className="m-top-5px">Découvrir ❯</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Accueil;