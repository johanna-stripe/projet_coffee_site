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

        res.cookie('token', result.token, { //on récupère le token qu'on vient de générer dans loginUser qui est dans const result
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 360000
            }
        )

        return res.status(201).json({
            message: 'User registered successfully',
            user: result.user,
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

        res.cookie('token', result.token, { //on récupère le token qu'on vient de générer dans loginUser qui est dans const result
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 360000
            }
        )
        return res.status(200).json({
            message: 'User logged in successfully',
            user: result.user,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error.message || 'Internal Server Error'})
    }
}

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    return res.status(200).json({message: 'Logged out successfully'});
}



//===================SECURED ENDPOINT=====================
export const securedEnPoint = async (req, res) => {
    return res.json({
        message: "Welcome to secured endpoint",
        user: req.user,
    })
}

