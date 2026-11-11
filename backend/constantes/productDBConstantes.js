//========================GET ALL PRODUCTS=========================
export const FIND_ALL_PRODUCTS = `
    SELECT c.category_id,
           c.category_name,
           c.parent_id,
           p.product_id,
           p.product_name,
           p.product_description,
           b.brand_id,
           b.brand_name,
           p.product_image_url,
           p.price,
           p.stock,
           ct.origin,
           ct.roast,
           ct.grind_type,
           ct.intensity,
           ct.weight,
           m.technology,
           m.pressure_power,
           m.grinder,
           m.tank_capacity,
           a.usage,
           a.material,
           a.capacity,
           a.color
    FROM product p
             JOIN category c ON c.category_id = p.category_id
        # JOIN --> ne garde que les lignes où la correspondance existe des deux côtés. 
# donc produit et category sont en relation 1,N --> Un produit est forcément relié à une ou plusieurs category donc JOIN classique suffit
             LEFT JOIN brand b ON b.brand_id = p.brand_id
             LEFT JOIN coffee_tea_infusion ct ON ct.product_id = p.product_id
             LEFT JOIN machines m ON m.product_id = p.product_id
             LEFT JOIN accessories a ON a.product_id = p.product_id
    # LEFT JOIN coffee_tea_infusion --> le poids n'existe que pour café/thé/infusion (null pour machines et accessoires)
    #     LEFT JOIN --> garde toutes les lignes de la table de gauche (celle après FROM, donc product ici)
# comme produit et brand sont en 0,N, la marque n'est pas obligatoire pour le produit, donc on peut avoir brand_id = null
# donc si un produit n'a pas de marque, il disparaît silencieusement de la liste avec un simple JOIN
# JOIN LEFT va garder tous les éléments de product
`

//======================GET PRODUCT INFO BY ID=====================
export const FIND_PRODUCT_FULL_INFO_BY_ID = `
    SELECT p.*,
           ca.category_name,
           br.brand_name,
           ct.origin, ct.roast, ct.intensity, ct.weight,
           ma.pressure_power, ma.tank_capacity, ma.grinder,
           ac.material, ac.capacity, ac.color
    FROM product p
             LEFT JOIN category ca ON ca.category_id = p.category_id
             LEFT JOIN brand br ON br.brand_id = p.brand_id
             LEFT JOIN coffee_tea_infusion ct ON ct.product_id = p.product_id
             LEFT JOIN machines ma ON ma.product_id = p.product_id
             LEFT JOIN accessories ac ON ac.product_id = p.product_id
    WHERE p.product_id = ?
`

//======================POST NEW PRODUCT==============================
export const CREATE_NEW_PRODUCT = `
    INSERT INTO product (category_id, brand_id, product_name, product_description,
                         product_image_url, price, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`

export const GET_CATEGORY_BY_NAME = `
    SELECT category_id
    FROM category
    where category_name = ?
`

export const CREATE_CATEGORY = `
    INSERT INTO category (category_name, parent_id)
    VALUES (?, ?)
`

export const GET_BRAND_BY_NAME = `
    SELECT brand_id
    FROM brand
    where brand.brand_name = ?
`

export const CREATE_BRAND = `
    INSERT INTO brand (brand_name)
    VALUES (?)
`

export const CREATE_NEW_PRODUCT_COFFEE_TEA_INFUSION = `
    INSERT INTO coffee_tea_infusion (product_id, origin, roast, intensity, weight)
    VALUES (?, ?, ?, ?, ?)
`

export const CREATE_NEW_MACHINE = `
    INSERT INTO machines (product_id, pressure_power, tank_capacity, grinder)
    VALUES (?, ?, ?, ?)
`

export const CREATE_NEW_ACCESSORY = `
    INSERT INTO accessories (product_id, material, capacity, color)
    VALUES (?, ?, ?, ?)
`

//==========================PUT PRODUCT============================
export const PUT_PRODUCT = `
    UPDATE product
    SET category_id= ?,
        brand_id= ?,
        product_name=?,
        product_description=?,
        product_image_url=?,
        price=?,
        stock=?
    WHERE product_id = ?
`

export const UPDATE_COFFEE_TEA_INFUSION = `
    UPDATE coffee_tea_infusion
    SET origin = ?,
        roast = ?,
        intensity = ?,
        weight = ?
    WHERE product_id = ?
`

export const UPDATE_MACHINE = `
    UPDATE machines
    SET pressure_power = ?,
        tank_capacity = ?,
        grinder = ?
    WHERE product_id = ?
`

export const UPDATE_ACCESSORY = `
    UPDATE accessories
    SET material = ?,
        capacity = ?,
        color = ?
    WHERE product_id = ?
`

//==========================PATCH PRODUCT============================
export const PATCH_PRODUCT = (fields) => {
    //Fonction exportée qui prend fields (le tableau des noms de colonnes à modifier) et retourne une chaîne de requête SQL.
    const setClause = fields.map(field => `${field} = ?`).join(', ')
    //On transforme le tableau fields en une chaîne SQL de type SET. Par exemple, si fields = ['order_status', 'shipping_cost'] :
    // .map(field => \${field}=?`) transforme chaque champ en "order_status=?", "shipping_cost=?"`
    // .join(', ') assemble ces éléments avec une virgule : "order_status=?, shipping_cost=?"

    //Cela construit dynamiquement la clause SET en fonction des champs réellement fournis (SET order_status=?, shipping_cost=? etc.)
    return `
        UPDATE product
        SET ${setClause}
        WHERE product_id = ?
    `
}


//======================DELETE PRODUCT==============================
export const DELETE_PRODUCT_BY_ID = `
    DELETE
    FROM product
    WHERE product_id = ?
`

// Les tables liées sont vidées avant le produit (même si la base n'a pas de ON DELETE CASCADE).
// order_item n'est volontairement PAS vidée : un produit déjà commandé ne doit pas être supprimé (historique).
export const DELETE_COFFEE_TEA_INFUSION_BY_PRODUCT_ID = `DELETE FROM coffee_tea_infusion WHERE product_id = ?`
export const DELETE_MACHINE_BY_PRODUCT_ID = `DELETE FROM machines WHERE product_id = ?`
export const DELETE_ACCESSORY_BY_PRODUCT_ID = `DELETE FROM accessories WHERE product_id = ?`
export const DELETE_CART_ITEMS_BY_PRODUCT_ID = `DELETE FROM cart_item WHERE product_id = ?`
