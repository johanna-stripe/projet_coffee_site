import {describe, expect, jest, test} from "@jest/globals"
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../app.js";
import {getByIdUser} from "../../models/userModel.js";

describe('API', () => {

    //1ère façon : prendre un id existant et tester ce qu'on a mis du côté de notre route secured-endpoint, ici authenticate + authorizeRole

    test('Verify authenticate', async () => {
        //Arrange
        // 1ère étape : authenticate va chercher un cookie token dès que la requête arrive sur le serveur.
        // On génére un token, de la même façon que dans tokenUtils (attention de bien passer un id qui existe dans notre bdd)
        const token = jwt.sign(
            {id: 34},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '1d'}
        )

        //Act
        const response = await request(app)
            .get('/api/v1/auth/secured-endpoint')
            .set('Cookie', [`token=${token}`])

        console.log("STATUS :", response.status);
        console.log("BODY :", response.body);

        //Assert
        expect(response.status).toBe(200)

    })

    //2e façon : simuler un user avec mock
    jest.mock('../../models/userModel.js', ()=>({
        getByIdUser: jest.fn()
    }));

    test('Verify authenticate with User Mocked', async () => {

        //Arrange
        const fakeUser = {
            user_id: 1,
            first_name: "admin",
            last_name: "admin",
            email: "admin2@email.com",
            role: "ADMIN",
            is_active: true
        };
        getByIdUser.mockResolvedValue(fakeUser)

        const token = jwt.sign(
            {
                id: fakeUser.user_id,
                email: fakeUser.email,
                role: fakeUser.role
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '1d'}
        );

        //Act
        const response = await request(app)
            .get('/api/v1/auth/secured-endpoint')
            .set('Cookie', [`token=${token}`])

        console.log("STATUS :", response.status);
        console.log("BODY :", response.body);

        //Assert
        expect(response.status).toBe(200);
        expect(getByIdUser).toHaveBeenCalledWith(fakeUser.user_id);

    })

})