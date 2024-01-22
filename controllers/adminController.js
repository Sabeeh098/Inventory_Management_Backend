const { generateToken } = require("../middleware/auth");
const Admin = require("../model/adminModel");



const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      const admin = await Admin.findOne({ email: email });
  
      if (!admin) {
        return res.status(401).json({ errMsg: "Admin not found" });
      }
  
      const passwordMatch = await Admin.findOne({
        _id: admin._id,
        password: password,
      });
  
      if (!passwordMatch) {
        return res.status(401).json({ errMsg: "Password didn't match" });
      }
  
      const token = generateToken(passwordMatch._id, "admin");
      res.status(200).json({
        message: "Login Successful",
        name: passwordMatch?.name,
        token,
        role: "admin",
        id: passwordMatch._id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errMsg: "Something Went Wrong" });
    }
  };
  

  module.exports = {
    adminLogin,

  }