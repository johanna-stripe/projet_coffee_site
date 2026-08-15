import db from "../6. config/database.js"

import {
    FIND_CART_BY_CUSTOMER_ID
} from "../5. constantes/cartDBConstantes.js";


//==================GET CART BY CUSTOMER ID=====================
export const findCartByCustomerId = async (customerId) => {
    const [results] = await db.query(FIND_CART_BY_CUSTOMER_ID,[customerId])
    return results[0] ?? null
}