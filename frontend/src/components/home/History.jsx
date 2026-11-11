import torrefaction from '../../assets/images/history/torefaction.jpg';


const History = () => {
    return (
        <section className="flex history"
        id="brulerie"
        >
            <div className="flex-1 flex position-relative m-right-20px justify-content-right history-image">
                <img
                    src={torrefaction}
                    alt="torréfaction artisanale"
                    className="h-100 w-100 object-fit-cover block"
                />
                <div className="position-absolute foundedIn c-secondary b-primary text-align-center p-20px">
                    <span className="font-size-2em block">1998</span>
                    <span className="uppercase">Fondée en</span>
                </div>
            </div>

            <div className="flex-1 flex flex-direction-column m-left-20px history-text align-self-center gap-20px">
                <h5 className="m-0 c-secondary font-size-125em letter-spacing-3px">Notre Histoire</h5>
                <h2 className="m-0 font-size-3em">
                    Découvrir <br/>
                    <span className="history-accent">la brûlerie</span>
                </h2>
                <div className="w-60px b-bottom-2px-c-secondary m-0"></div>
                <div>
                    <p className="font-size-15px c-secondary text-align-justify">
                        Depuis 1998, nous sélectionnons les meilleurs grains aux quatre coins du monde —
                        des hauts plateaux éthiopiens aux vallées colombiennes, des jardins de thé japonais
                        aux forêts de Ceylan.
                    </p>
                    <p className="font-size-15px c-secondary text-align-justify">
                        Notre brûlerie artisanale, installée en Provence, travaille en petits lots pour
                        préserver toute la complexité aromatique de chaque origine. Chaque torréfaction est
                        pensée, ajustée, et approuvée par nos maîtres torréfacteurs.
                    </p>

                    <p className="font-size-15px c-secondary text-align-justify">
                        Nous croyons que le café est bien plus qu'une boisson : c'est un moment, une
                        parenthèse, un rituel. Chaque sachet que vous recevez quitte notre atelier dans les
                        48 heures suivant la torréfaction.
                    </p>

                    <p className="font-size-15px c-secondary text-align-justify">
                        Nous travaillons main dans la main avec des producteurs que nous connaissons par leur
                        nom, dans le respect de la terre et de ceux qui la cultivent. Du choix de la parcelle
                        à la tasse, chaque étape est suivie avec la même exigence, pour vous offrir un café
                        sincère, traçable et pleinement savoureux.
                    </p>
                </div>

                <div className="w-100 b-top-1px"></div>

                <div className="flex justify-content-space-evenly history-stats">
                    <div className="flex flex-direction-column align-items-center">
                        <span className="history-stat-value">26</span>
                        <span className="font-size-15px c-secondary">Origines</span>
                    </div>
                    <div className="flex flex-direction-column align-items-center">
                        <span className="history-stat-value">48h</span>
                        <span className="font-size-15px c-secondary">Après torréfaction</span>
                    </div>
                    <div className="flex flex-direction-column align-items-center">
                        <span className="history-stat-value">100%</span>
                        <span className="font-size-15px c-secondary">Arabica tracé</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default History