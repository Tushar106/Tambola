const User = require('../models/user')

// register
const registerUser = async (req, res) => {
    const { username } = req.body;
    console.log(req.body)

    try {
        const newUser = new User({
            username:username
        });
        await newUser.save();

        res.status(201).json({
            message: "Registration Successfully",
            user:
            {
                id: newUser._id,
                username: newUser.username
            },
        });
    }
    catch (error) {
        res.status(500).send("Error registering user: " + error.message);
    }
};

module.exports = { registerUser }