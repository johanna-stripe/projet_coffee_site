import {beforeEach, describe, expect, jest, test} from "@jest/globals"
import jwt from "jsonwebtoken";
import request from "supertest";

// En ESM, jest.mock n'est pas "hissé" : on utilise unstable_mockModule AVANT d'importer l'app.
// Le modèle est entièrement simulé : aucun appel à la vraie base de données.
const mockGetByIdUser = jest.fn()
const mockUpdateUserRole = jest.fn()
const mockActivate = jest.fn()
const mockDeactivate = jest.fn()
const mockUpdateUserById = jest.fn()

jest.unstable_mockModule('../../models/userModel.js', () => ({
    getByIdUser: mockGetByIdUser,
    updateUserRole: mockUpdateUserRole,
    activate: mockActivate,
    deactivate: mockDeactivate,
    findUserByEmail: jest.fn(),
    saveUserWithCustomer: jest.fn(),
    findAllUsers: jest.fn(),
    updateUserById: mockUpdateUserById,
}))

// import dynamique : l'app doit être chargée une fois le mock en place
const {default: app} = await import("../../app.js")

const ADMIN = {user_id: 1, username: 'admin', email: 'admin@email.com', role: 'ADMIN', is_active: true}
const CUSTOMER = {user_id: 2, username: 'client', email: 'client@email.com', role: 'USER', is_active: true}

// Cookie d'authentification pour un utilisateur donné (authenticate relit l'user en base via getByIdUser)
const cookieFor = (user) => {
    mockGetByIdUser.mockResolvedValue(user)
    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {expiresIn: '1h'})
    return [`token=${token}`]
}

describe('Protection de son propre compte (admin)', () => {

    beforeEach(() => {
        jest.clearAllMocks()
        mockUpdateUserRole.mockResolvedValue(true)
        mockActivate.mockResolvedValue(true)
        mockDeactivate.mockResolvedValue(true)
    })

    test("un admin ne peut pas changer son propre rôle", async () => {
        const response = await request(app)
            .patch(`/api/v1/users/change-role/${ADMIN.user_id}`)
            .set('Cookie', cookieFor(ADMIN))
            .send({role: 'USER'})

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('You cannot change your own role')
        expect(mockUpdateUserRole).not.toHaveBeenCalled()
    })

    test("un admin ne peut pas désactiver son propre compte", async () => {
        const response = await request(app)
            .patch(`/api/v1/users/deactivate-user/${ADMIN.user_id}`)
            .set('Cookie', cookieFor(ADMIN))

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('You cannot deactivate your own account')
        expect(mockDeactivate).not.toHaveBeenCalled()
    })

    test("un admin peut changer le rôle d'un autre utilisateur", async () => {
        const response = await request(app)
            .patch(`/api/v1/users/change-role/${CUSTOMER.user_id}`)
            .set('Cookie', cookieFor(ADMIN))
            .send({role: 'ADMIN'})

        expect(response.status).toBe(200)
        expect(mockUpdateUserRole).toHaveBeenCalledWith('2', 'ADMIN')
    })

    test("un admin peut désactiver un autre utilisateur", async () => {
        const response = await request(app)
            .patch(`/api/v1/users/deactivate-user/${CUSTOMER.user_id}`)
            .set('Cookie', cookieFor(ADMIN))

        expect(response.status).toBe(200)
        expect(mockDeactivate).toHaveBeenCalledWith('2')
    })

    test("un client simple ne peut pas changer de rôle (même le sien)", async () => {
        const response = await request(app)
            .patch(`/api/v1/users/change-role/${CUSTOMER.user_id}`)
            .set('Cookie', cookieFor(CUSTOMER))
            .send({role: 'ADMIN'})

        expect(response.status).toBe(403)
        expect(mockUpdateUserRole).not.toHaveBeenCalled()
    })

    test("un client ne peut pas modifier le compte d'un autre utilisateur", async () => {
        const response = await request(app)
            .patch(`/api/v1/users/update-user/${ADMIN.user_id}`)
            .set('Cookie', cookieFor(CUSTOMER))
            .send({username: 'pirate'})

        expect(response.status).toBe(403)
        expect(mockUpdateUserById).not.toHaveBeenCalled()
    })

    test("un client ne peut pas se donner le rôle ADMIN via update-user (champ ignoré)", async () => {
        mockUpdateUserById.mockResolvedValue({affectedRows: 1})

        const response = await request(app)
            .patch(`/api/v1/users/update-user/${CUSTOMER.user_id}`)
            .set('Cookie', cookieFor(CUSTOMER))
            .send({username: 'nouveau', role: 'ADMIN', is_active: false})

        expect(response.status).toBe(200)
        // seule la colonne username est mise à jour : role et is_active sont ignorés
        expect(mockUpdateUserById).toHaveBeenCalledWith(['username'], ['nouveau', '2'])
    })
})
