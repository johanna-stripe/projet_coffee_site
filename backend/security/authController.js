import {
    registerUser,
    loginUser,
} from "./authService.js";


//=================REGISTER===================
export const register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({error: 'User data is required'})
        }

        const result = await registerUser(req.body)
        return res.status(201).json({
            message: 'User registered successfully',
            user: result.user,
            token: result.token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error.message || 'Internal Server Error'})
    }
}


//===================LOGIN=====================
export const login = async (req,res)=>{
    try {
        if (!req.body) {
            return res.status(400).json({error: 'User data is required'})
        }

        const result = await loginUser(req.body)
        return res.status(201).json({
            message: 'User logged in successfully',
            user: result.user,
            token: result.token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error.message || 'Internal Server Error'})
    }
}


