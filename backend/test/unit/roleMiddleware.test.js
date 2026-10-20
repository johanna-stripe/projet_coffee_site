import {describe, expect, jest, test} from "@jest/globals"
import {authorizeRole} from "../../security/middleware/roleMiddleware.js";


describe('authorizeRole', () => {

    //Test 1 : User not authenticated
    test('returns 401 if user is not authenticated', () => {

        //On déclare 3 const car on a 3 paramètres dans notre return côté roleMiddleware
        const req = {} //on teste !req.user
        const res = {} //on déclare le res car il fait partie des paramètres
        const next = jest.fn() //mock : simule le next

        const middleware = authorizeRole("ADMIN")

        expect(() => {
            middleware(req, res, next) //le même nb de paramètres
        }).toThrow('User not authenticated') //exactement le même message

        expect(next).not.toHaveBeenCalled() //s'assurer que next n'a pas été appelé car on test le premier throw de la fonction authorizeRole, donc on veut pas que ça next.
    });

    //Test 2 : User with denied access
    test('returns 403 if user has access denied', () => {

        //On déclare 3 const car on a 3 paramètres dans notre return côté roleMiddleware
        const req = {
            user : {
                role : "USER"
            }
        }
        const res = {}
        const next = jest.fn()

        const middleware = authorizeRole("ADMIN")

        expect(() => {
            middleware(req, res, next) //le même nb de paramètres
        }).toThrow('Access Denied') //exactement le même message

        expect(next).not.toHaveBeenCalled() //s'assurer que next n'a pas été appelé car on test le premier throw de la fonction authorizeRole, donc on veut pas que ça next.
    });

    //Test 3 : returns authorized user
    test('calls next if user has ADMIN role', () => {

        //On déclare 3 const car on a 3 paramètres dans notre return côté roleMiddleware
        const req = {
            user : {
                role : "ADMIN"
            }
        }
        const res = {}
        const next = jest.fn()

        const middleware = authorizeRole("ADMIN")

        middleware(req, res, next) //le même nb de paramètres

        expect(next).toHaveBeenCalledTimes(1)
    })

});