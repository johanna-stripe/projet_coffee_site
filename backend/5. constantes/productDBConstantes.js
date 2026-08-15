//========================GET ALL PRODUCTS=========================
export const FIND_ALL_PRODUCTS = `SELECT *
                                  FROM product`

//======================GET PRODUCT INFO BY ID=====================
export const FIND_PRODUCT_FULL_INFO_BY_ID = `SELECT p.product_id,
                                                    ca.category_name,
                                                    br.brand_name,
                                                    p.product_name,
                                                    p.product_description,
                                                    p.product_image_url,
                                                    p.price,
                                                    p.stock,
                                                    p.created_at,
                                                    p.updated_at
                                             FROM product p
                                                      LEFT JOIN category ca ON ca.category_id = p.category_id
                                                      LEFT JOIN brand br ON br.brand_id = p.brand_id
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
    INSERT INTO category (category_name)
    VALUES (?)
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



//======================DELETE PRODUCT==============================
export const DELETE_PRODUCT_BY_ID = `
    DELETE
    FROM product
    WHERE product_id = ?
`