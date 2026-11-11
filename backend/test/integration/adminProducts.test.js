import {beforeEach, describe, expect, jest, test} from "@jest/globals"
import jwt from "jsonwebtoken";
import request from "supertest";

// Même principe que userSelfProtection.test.js : les modèles sont simulés, aucun appel à la vraie base.
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

const mockCreateANewProduct = jest.fn()
const mockCreateCoffee = jest.fn()
const mockFindProductInfoById = jest.fn()
const mockModifyWithDetails = jest.fn()
const mockDeleteByIdProduct = jest.fn()

jest.unstable_mockModule('../../models/productModel.js', () => ({
    findAllProducts: jest.fn(),
    findProductInfoById: mockFindProductInfoById,
    createANewProduct: mockCreateANewProduct,
    findCategoryByName: jest.fn(),
    createCategory: jest.fn(),
    findBrandByName: jest.fn(),
    createBrand: jest.fn(),
    createCoffeeTeaInfusionDetails: mockCreateCoffee,
    createMachineDetails: jest.fn(),
    createAccessoryDetails: jest.fn(),
    modifyProductWithDetails: mockModifyWithDetails,
    modifyByPatchProduct: jest.fn(),
    deleteByIdProduct: mockDeleteByIdProduct,
}))

const {default: app} = await import("../../app.js")

const ADMIN = {user_id: 1, username: 'admin', email: 'admin@email.com', role: 'ADMIN', is_active: true}
const CUSTOMER = {user_id: 2, username: 'client', email: 'client@email.com', role: 'USER', is_active: true}

const cookieFor = (user) => {
    mockGetByIdUser.mockResolvedValue(user)
    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {expiresIn: '1h'})
    return [`token=${token}`]
}

const validCoffee = {
    product_type: 'coffee/tea/infusion',
    category_id: 7,
    brand_id: 3,
    product_name: 'Café test',
    product_description: 'Un café de test',
    product_image_url: '/images/test.png',
    price: 12.5,
    stock: 10,
    origin: 'Colombie',
    roast: 'Moyenne',
    intensity: 5,
    weight: 250,
}

describe('Admin produits : droits et validation', () => {

    beforeEach(() => {
        jest.clearAllMocks()
        mockCreateANewProduct.mockResolvedValue({insertId: 99, affectedRows: 1})
        mockCreateCoffee.mockResolvedValue({affectedRows: 1})
    })

    test("un visiteur ne peut pas créer de produit (401)", async () => {
        const response = await request(app).post('/api/v1/products').send(validCoffee)
        expect(response.status).toBe(401)
        expect(mockCreateANewProduct).not.toHaveBeenCalled()
    })

    test("un client ne peut pas créer de produit (403)", async () => {
        const response = await request(app)
            .post('/api/v1/products')
            .set('Cookie', cookieFor(CUSTOMER))
            .send(validCoffee)
        expect(response.status).toBe(403)
        expect(mockCreateANewProduct).not.toHaveBeenCalled()
    })

    test("un admin crée un produit valide (201) et la sous-table est remplie", async () => {
        const response = await request(app)
            .post('/api/v1/products')
            .set('Cookie', cookieFor(ADMIN))
            .send(validCoffee)
        expect(response.status).toBe(201)
        expect(mockCreateANewProduct).toHaveBeenCalledTimes(1)
        expect(mockCreateCoffee).toHaveBeenCalledWith(99, expect.objectContaining({origin: 'Colombie', weight: 250}))
    })

    test.each([
        ['prix négatif', {price: -1}],
        ['prix non numérique', {price: 'abc'}],
        ['stock décimal', {stock: 1.5}],
        ['stock négatif', {stock: -3}],
        ['nom vide', {product_name: '   '}],
        ['description vide', {product_description: ''}],
        ['image avec un protocole dangereux', {product_image_url: 'javascript:alert(1)'}],
    ])("création refusée (400) : %s", async (_label, change) => {
        const response = await request(app)
            .post('/api/v1/products')
            .set('Cookie', cookieFor(ADMIN))
            .send({...validCoffee, ...change})
        expect(response.status).toBe(400)
        expect(mockCreateANewProduct).not.toHaveBeenCalled()
    })

    test("PUT : le type du produit vient de la base, pas de la requête", async () => {
        mockFindProductInfoById.mockResolvedValue({
            product_id: 5, category_id: 7, brand_id: 3, product_name: 'x', product_description: 'x',
            price: 1, stock: 1, origin: 'Brésil', roast: 'Foncée', intensity: 5, weight: 250,
            pressure_power: null, material: null,
        })
        mockModifyWithDetails.mockResolvedValue({affectedRows: 1})

        const response = await request(app)
            .put('/api/v1/products/5')
            .set('Cookie', cookieFor(ADMIN))
            .send({...validCoffee, product_type: 'machine'})

        expect(response.status).toBe(200)
        expect(mockModifyWithDetails).toHaveBeenCalledWith(
            '5', expect.any(Array), 'coffee/tea/infusion', expect.objectContaining({origin: 'Colombie'})
        )
    })

    test("PUT : produit inexistant (404)", async () => {
        mockFindProductInfoById.mockResolvedValue(null)
        const response = await request(app)
            .put('/api/v1/products/404')
            .set('Cookie', cookieFor(ADMIN))
            .send(validCoffee)
        expect(response.status).toBe(404)
        expect(mockModifyWithDetails).not.toHaveBeenCalled()
    })

    test("DELETE : un produit déjà commandé n'est pas supprimé (409)", async () => {
        const fkError = Object.assign(new Error('FK'), {errno: 1451})
        mockDeleteByIdProduct.mockRejectedValue(fkError)
        const response = await request(app)
            .delete('/api/v1/products/5')
            .set('Cookie', cookieFor(ADMIN))
        expect(response.status).toBe(409)
    })

    test("DELETE : un client ne peut pas supprimer (403)", async () => {
        const response = await request(app)
            .delete('/api/v1/products/5')
            .set('Cookie', cookieFor(CUSTOMER))
        expect(response.status).toBe(403)
        expect(mockDeleteByIdProduct).not.toHaveBeenCalled()
    })
})
