export const FIND_ALL_CATEGORIES = 'SELECT * FROM category'

export const FIND_CATEGORY_BY_ID = `SELECT *
                                    FROM category
                                    WHERE category_id = ?
`


export const FIND_PRODUCTS_BY_CATEGORY_ID = `
    SELECT c.category_id,
           c.category_name,
           COUNT(p.product_id) AS product_count
    FROM CATEGORY c
             LEFT JOIN PRODUCT p ON p.category_id = c.category_id
    WHERE c.category_id = ?
`



