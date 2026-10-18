const Selection = ({selections}) => {

    return (
        <section className="explore_section p-bottom-50px">
            <div className="h-200px flex flex-direction-column justify-content-center align-items-center">
                <p className="c-tertiary font-size-150em m-0 slider-eyebrow m-10px">Nos univers</p>
                <h1 className="c-secondary m-0">Explorez notre sélection</h1>
            </div>

            <div className="flex justify-content-space-evenly m-left-50px m-right-50px">
                {selections.map((item, index)=>(
                <div
                    key={index}
                    className="selection-card flex flex-direction-column align-items-center">
                    <img className="selection-card-img block"
                         src={item.img}
                         alt={item.alt}/>
                    <h3 className="c-secondary uppercase m-0 m-bottom-10px">{item.title}</h3>
                    <p className="c-secondary m-0 m-bottom-20px">{item.description}</p>
                    <a className="selection-card-btn" href="#">Découvrir</a>
                </div>
                ))}
            </div>

        </section>
    )
}

export default Selection


