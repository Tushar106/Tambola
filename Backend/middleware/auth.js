const jwt=require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send("Authorization header is missing");
    }
  
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).send("Invalid token format. Must be 'Bearer <token>'");
    }
  
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send("Token is missing");
    }
  
    req.token = token;
  
    next();
  };
  