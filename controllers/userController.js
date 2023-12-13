const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

const SECRET_KEY = "API";

app.use(express.json())

const signup = async (req, res) => {
    const { name, password, email } = req.body;
    console.log(req.body);
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            name: name,
            password: hashPassword,
            email: email,
        });

        const authtoken = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
        console.log(authtoken)
        res.status(201).json({ user: result, authtoken, name:result.name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const signin = async (req, res) => {
    const {email,password} = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchPassword = await bcrypt.compare(password,existingUser.password);
        if(!matchPassword){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const authtoken = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY);
        res.status(200).json({ user: existingUser, authtoken});
        // console.log(authtoken)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const userInfo = async (req,res)=>{
    const userID = req.userId;
   try {
    const user = await userModel.findOne({ _id: userID });
    if(user){
        res.json({name:user.name})
    }else{
        res.status(500).json({ message: "Something went wrong" });
    }
   } catch (error) {
    console.log(error);
        res.status(500).json({ message: "Something went wrong" });
   }

}
module.exports = { signin, signup, userInfo };