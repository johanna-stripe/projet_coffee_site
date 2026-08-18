export const FIND_ALL_BRANDS = `
    SELECT *
    FROM brand
`

export const FIND_BRAND_BY_ID = `
    SELECT *
    FROM brand
    WHERE brand_id = ?
`

export const FIND_PRODUCTS_BY_BRAND_ID = `
    SELECT b.brand_id,
           b.brand_name,
           COUNT(p.product_id) AS product_count
    FROM brand b
             LEFT JOIN product p ON p.brand_id = b.brand_id
#     LEFT JOIN car si la brand existe mais n'a pas de produit elle remontera qd même, ce qui n'aurait pas été le cas avec un simple JOIN
    WHERE b.brand_id = ?
    GROUP BY b.brand_id, b.brand_name
`

export const PUT_BRAND = `
    UPDATE brand
    SET brand_name = ?
    WHERE brand_id = ?
`


export const DELETE_BRAND_BY_ID = `
    DELETE
    FROM brand
    WHERE brand_id = ?
`