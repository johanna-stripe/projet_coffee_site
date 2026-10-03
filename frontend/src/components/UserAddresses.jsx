import { FaPen, FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../axios/axiosConfig.js";

const UserAddresses = () => {
    const [customer, setCustomer] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/customers/me');
                setCustomer(response.data.customer);
                setAddresses(response.data.addresses);
            } catch (err) {
                setError(err.response?.data?.error || 'Impossible de charger vos adresses');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!customer) return null;

    return (
        <>
            <div className="content-header flex justify-content-space-between">
                <div>
                    <h3 className="font-size-2em c-secondary m-bottom-5px">Mes adresses</h3>
                    <p className="font-size-125em subtitle c-secondary m-0 p-bottom-20px">
                        Gérez vos adresses de livraison et facturation
                    </p>
                </div>
                <div className="flex gap-15px">
                    <button className="align-self-center m-right-50px b-none p-10px flex cursor-pointer b-secondary">
                        <span className="letter-spacing-1px c-primary p-5px m-left-10px m-right-10px">+ Ajouter</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-50px m-right-50px">
                {addresses.length === 0 ? (
                    <p>Aucune adresse enregistrée.</p>
                ) : (
                    addresses.map((address) => (
                        <div key={address.address_id} className="b-white flex-1 p-10px">
                            <div className="flex justify-content-space-between">
                                <h4>{address.address_name || "Adresse"}</h4>
                                <div className="flex gap-10px">
                                    <FaPen size={15} color={"var(--color-secondary)"} />
                                    <FaRegTrashAlt size={15} color={"var(--color-secondary)"} />
                                </div>
                            </div>
                            <div>
                                <p>{customer.first_name} {customer.last_name}</p>
                                <p>{address.street}</p>
                                <p>{address.city}</p>
                                <p>{address.postcode}</p>
                                <p>{address.country}</p>
                                <p>{customer.phone}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default UserAddresses;