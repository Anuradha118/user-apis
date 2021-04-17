const jwt = require('express-jwt');

const authorization=(req,res,next)=>{
    const token=req.header('x-token');
    if(token && token !== ''){
        next();
    }else{
        res.status(401).send();
    }
};

const extractJwt = (req,res, next)=>{
    if(req.header('x-auth')){
        return req.header('x-auth')
    }
    return null
}

const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['sha1', 'RS256', 'HS256'],
  getToken: extractJwt
});

module.exports={authorization, auth};