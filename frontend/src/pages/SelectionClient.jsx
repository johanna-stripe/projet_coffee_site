const SectionClient = ({selectionClient}) => {
    return (
        <section className="selection-client h-550px flex flex-direction-column justify-content-center align-items-center b-secondary c-primary">
            <h2 className="m-bottom-10px">Les cafés préférés de nos clients</h2>
            <div className="w-300px b-bottom-2px-c-primary m-bottom-40px"></div>
            <div className="flex align-items-center justify-content-space-evenly gap-30px m-left-50px m-right-50px">
                {selectionClient.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-direction-column align-items-center h-350px w-220px" style={{backgroundColor: 'rgba(62, 32, 12, 0.73)'}}>
                        <img
                            src={item.img}
                            alt={item.alt}
                            className="h-100 w-100 object-fit-cover"
                        />
                        <div className="inline-block align-self-flex-start m-left-10px">
                            <p className="letter-spacing-3px c-tertiary">{item.origin}</p>
                            <p className="font-size-150em font-italique">{item.title}</p>
                            <p className="">{item.parfums}</p>
                            <p className="font-size-125em">{item.price} <span className="font-size-075em c-tertiary">/ 250g</span></p>
                        </div>
                        <a className=" inline-block align-self-flex-start c-primary uppercase font-size-075em text-decoration-none b-quaternary p-10px" href="#">+ Ajouter au panier</a>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SectionClient

