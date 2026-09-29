const Selection = ({selections}) => {

    return (
        <section className="explore_section h-600px">
            <div className="h-200px flex flex-direction-column justify-content-center align-items-center">
                <p className="c-tertiary m-0 slider-eyebrow m-10px">Nos univers</p>
                <h1 className="c-secondary m-0">Explorez notre sélection</h1>
            </div>

            <div className="flex justify-content-space-evenly m-left-50px m-right-50px">
                {selections.map((item, index)=>(
                <div
                    key={index}
                    className="image-container position-relative overflow-hidden">
                    <img className="w-220px h-300px block"
                         src={item.img}
                         alt={item.alt}/>
                    <div
                        className="position-absolute text-align-left c-white font-bold bottom-1em left-1em z-index1">
                        <h3 className="m-0">{item.title}</h3>
                        <p className="m-top-5px font-montserrat">{item.cta}</p>
                    </div>
                </div>
                ))}
            </div>

        </section>
    )
}

export default Selection


