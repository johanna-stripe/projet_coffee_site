import {beforeEach, describe, expect, jest, test} from "@jest/globals"
import jwt from "jsonwebtoken";
import request from "supertest";

// Même principe que les autres tests d'intégration : les modèles sont simulés, aucun appel à la vraie base.
const mockGetByIdUser = jest.fn()
jest.unstable_mockModule('../../models/userModel.js', () => ({
    getByIdUser: mockGetByIdUser,
    findUserByEmail: jest.fn(),
    saveUserWithCustomer: jest.fn(),
    findAllUsers: jest.fn(),
    updateUserRole: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    updateUserById: jest.fn(),
}))

const mockFindCategoryById = jest.fn()
const mockFindProductsByCategoryId = jest.fn()
const mockFindChildren = jest.fn()
const mockModifyCategory = jest.fn()
const mockDeleteCategory = jest.fn()
jest.unstable_mockModule('../../models/categoriesModel.js', () => ({
    findAllCategories: jest.fn(),
    findCategoryById: mockFindCategoryById,
    findProductsByCategoryId: mockFindProductsByCategoryId,
    findCategoryParentById: mockFindChildren,
    modifyByIdCategory: mockModifyCategory,
    deleteCategoryById: mockDeleteCategory,
}))

const mockBrandCount = jest.fn()
const mockDeleteBrand = jest.fn()
jest.unstable_mockModule('../../models/brandModel.js', () => ({
    findAllBrands: jest.fn(),
    findBrandById: jest.fn(),
    getBrandProductCount: mockBrandCount,
    modifyBrandById: jest.fn(),
    deleteByIdBrand: mockDeleteBrand,
}))

const mockCreateCategory = jest.fn()
jest.unstable_mockModule('../../models/productModel.js', () => ({
    findAllProducts: jest.fn(),
    findProductInfoById: jest.fn(),
    createANewProduct: jest.fn(),
    findCategoryByName: jest.fn().mockResolvedValue(undefined),
    createCategory: mockCreateCategory,
    findBrandByName: jest.fn().mockResolvedValue(undefined),
    createBrand: jest.fn(),
    createCoffeeTeaInfusionDetails: jest.fn(),
    createMachineDetails: jest.fn(),
    createAccessoryDetails: jest.fn(),
    modifyProductWithDetails: jest.fn(),
    modifyByPatchProduct: jest.fn(),
    deleteByIdProduct: jest.fn(),
}))

const {default: app} = await import("../../app.js")

const ADMIN = {user_id: 1, username: 'admin', email: 'admin@email.com', role: 'ADMIN', is_active: true}
const CUSTOMER = {user_id: 2, username: 'client', email: 'client@email.com', role: 'USER', is_active: true}

const cookieFor = (user) => {
    mockGetByIdUser.mockResolvedValue(user)
    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {expiresIn: '1h'})
    return [`token=${token}`]
}

const MAIN = {category_id: 1, category_name: 'café en grain', parent_id: null}
const SUB = {category_id: 7, category_name: 'grand cru', parent_id: 1}

describe('Admin catégories', () => {

    beforeEach(() => {
        jest.clearAllMocks()
        mockFindCategoryById.mockImplementation(async (id) => [MAIN, SUB].find(c => c.category_id === Number(id)) ?? null)
        mockFindChildren.mockResolvedValue([])
        mockCreateCategory.mockResolvedValue(99)
        mockModifyCategory.mockResolvedValue({affectedRows: 1})
        mockDeleteCategory.mockResolvedValue({affectedRows: 1})
    })

    test("un client ne peut pas supprimer une catégorie (403)", async () => {
        const response = await request(app).delete('/api/v1/categories/7').set('Cookie', cookieFor(CUSTOMER))
        expect(response.status).toBe(403)
        expect(mockDeleteCategory).not.toHaveBeenCalled()
    })

    test("suppression refusée si la catégorie contient des produits (409)", async () => {
        mockFindProductsByCategoryId.mockResolvedValue({...SUB, product_count: 3})
        const response = await request(app).delete('/api/v1/categories/7').set('Cookie', cookieFor(ADMIN))
        expect(response.status).toBe(409)
        expect(mockDeleteCategory).not.toHaveBeenCalled()
    })

    test("suppression refusée si la catégorie a des sous-catégories (409)", async () => {
        mockFindProductsByCategoryId.mockResolvedValue({...MAIN, product_count: 0})
        mockFindChildren.mockResolvedValue([{category_name: 'grand cru'}])
        const response = await request(app).delete('/api/v1/categories/1').set('Cookie', cookieFor(ADMIN))
        expect(response.status).toBe(409)
        expect(mockDeleteCategory).not.toHaveBeenCalled()
    })

    test("une catégorie vide est supprimée", async () => {
        mockFindProductsByCategoryId.mockResolvedValue({...SUB, product_count: 0})
        const response = await request(app).delete('/api/v1/categories/7').set('Cookie', cookieFor(ADMIN))
        expect(response.status).toBeLessThan(300)
        expect(mockDeleteCategory).toHaveBeenCalledWith('7')
    })

    test("création : le parent doit être une catégorie principale (400)", async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Cookie', cookieFor(ADMIN))
            .send({category_name: 'Nouvelle', parent_id: SUB.category_id})
        expect(response.status).toBe(400)
        expect(mockCreateCategory).not.toHaveBeenCalled()
    })

    test("création : parent inexistant (400)", async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Cookie', cookieFor(ADMIN))
            .send({category_name: 'Nouvelle', parent_id: 555})
        expect(response.status).toBe(400)
    })

    test("création d'une catégorie principale : le parent est enregistré à null", async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Cookie', cookieFor(ADMIN))
            .send({category_name: 'Chocolats'})
        expect(response.status).toBe(201)
        expect(mockCreateCategory).toHaveBeenCalledWith(['chocolats', null])
    })

    test("modification : une catégorie ne peut pas être son propre parent (400)", async () => {
        const response = await request(app)
            .put('/api/v1/categories/1')
            .set('Cookie', cookieFor(ADMIN))
            .send({category_name: 'café en grain', parent_id: 1})
        expect(response.status).toBe(400)
        expect(mockModifyCategory).not.toHaveBeenCalled()
    })

    test("modification : une catégorie qui a des sous-catégories ne devient pas sous-catégorie (400)", async () => {
        mockFindChildren.mockResolvedValue([{category_name: 'grand cru'}])
        mockFindCategoryById.mockImplementation(async (id) => ({category_id: Number(id), category_name: 'x', parent_id: null}))   // le parent 9 existe et est une catégorie principale
        const response = await request(app)
            .put('/api/v1/categories/1')
            .set('Cookie', cookieFor(ADMIN))
            .send({category_name: 'café en grain', parent_id: 9})
        expect(response.status).toBe(400)
        expect(mockModifyCategory).not.toHaveBeenCalled()
    })
})

describe('Admin marques', () => {

    beforeEach(() => {
        jest.clearAllMocks()
        mockDeleteBrand.mockResolvedValue({affectedRows: 1})
    })

    test("suppression refusée si des produits sont rattachés (409)", async () => {
        mockBrandCount.mockResolvedValue({brand_id: 3, brand_name: 'illy', product_count: 2})
        const response = await request(app).delete('/api/v1/brand/3').set('Cookie', cookieFor(ADMIN))
        expect(response.status).toBe(409)
        expect(mockDeleteBrand).not.toHaveBeenCalled()
    })

    test("marque inexistante (404)", async () => {
        mockBrandCount.mockResolvedValue(null)
        const response = await request(app).delete('/api/v1/brand/404').set('Cookie', cookieFor(ADMIN))
        expect(response.status).toBe(404)
    })

    test("une marque sans produit est supprimée", async () => {
        mockBrandCount.mockResolvedValue({brand_id: 3, brand_name: 'illy', product_count: 0})
        const response = await request(app).delete('/api/v1/brand/3').set('Cookie', cookieFor(ADMIN))
        expect(response.status).toBe(200)
        expect(mockDeleteBrand).toHaveBeenCalledWith('3')
    })

    test("un client ne peut pas supprimer une marque (403)", async () => {
        const response = await request(app).delete('/api/v1/brand/3').set('Cookie', cookieFor(CUSTOMER))
        expect(response.status).toBe(403)
    })
})
