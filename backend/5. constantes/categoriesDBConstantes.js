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
    #     LEFT JOIN car si la category existe mais n'a pas de produit elle remontera qd même, ce qui n'aurait pas été le cas avec un simple JOIN
    WHERE c.category_id = ?
    GROUP BY c.category_id, c.category_name
`

export const FIND_CATEGORY_PARENT_BY_ID = `
    SELECT category_name
    FROM category
    WHERE parent_id = ?
`


export const PUT_CATEGORY = `
    UPDATE category
    SET category_name = ?,
        parent_id = ?
    WHERE category_id = ?
`

export const DELETE_CATEGORY_BY_ID = `
    DELETE
    FROM category
    WHERE category_id = ?
`