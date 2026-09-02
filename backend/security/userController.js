import {
    getUsers,
    getUser,
    modifyUser
} from "./userService.js";


//===========GET ALL USERS===============
export const getAllUsers = async (req, res) => {
    try {
        const results = await getUsers()
        if (!results) return res.status(400).json('Could not find any user')

        return res.json({
            results,
            message: 'Here are all users:'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}


//===========GET USER BY ID===============
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) return res.status(400).json('User Id is required')

        const results = await getUser(userId)
        if (!results) return res.status(400).json('User Id does not exist')

        return res.json({
            userId,
            results,
            message: 'User found successfully:'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}



//===========PATCH===============
export const updateUser = async(req,res)=>{
    try {
        const userId = req.params.id
        if (!userId) return res.status(400).json('User Id is required')

        const results = await modifyUser(userId)

        return res.json({
            message: 'User modified successfully:',
            results
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}