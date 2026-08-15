
export const FIND_ALL_BRANDS = `
SELECT * FROM brand
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
    from brand b
             JOIN product p ON p.brand_id = b.brand_id
    WHERE b.brand_id = ?
`