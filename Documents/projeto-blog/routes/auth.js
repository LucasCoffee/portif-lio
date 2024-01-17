const JWTSecret = "ndajsnd778bcxi*&*s*&";
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => { 
    const token = req.header('Authorization').split(" ")[1]
    if(token == undefined){
        res.send("Token incorreto").status = 401;
    }else{
        try {
            const decoded = jwt.verify(token, JWTSecret);
            req.usuario = {id: decoded.id, email: decoded.email};
            next();
          } catch (error) {
            console.log(error)
            res.status(401).json({ mensagem: 'Token inválido' });
          }
    }

}

module.exports = auth;