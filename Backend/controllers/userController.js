const User=require('../models/user')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')

// register
const registerUser=async (req,res)=>
{
const{username,email,password}=req.body;

try
{
    const existinguser=await User.findOne({email});

    if(existinguser)
    {
        return res.status(400).send("User already exists");
    }
    
    const hashedPassword=await bcrypt.hash(password,10);

    const newUser= new User({
        username,
        email,
        password:hashedPassword
    });
    await newUser.save();

    res.status(201).json({
        message:"Registration Successfully",
        user:
        {
            id:newUser._id,
            email:newUser.email,
            username:newUser.username
        },
    });
}
catch(error)
{
    res.status(500).send("Error registering user: "+error.message);
}
};

// login
const loginUser=async (req,res)=>
{
const {email,password}=req.body;

try
{
    const user=await User.findOne({email});
    if(!user)
    {
        return res.status(404).send("User is not found");
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid)
    {
        res.status(400).send("Invalid credential");
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful!', token });
}
catch(error)
{
    res.status(500).json({ message: 'Error logging in: ' + error.message });
}
}
module.exports={registerUser,loginUser}