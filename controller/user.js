const passport = require('passport');
const UserService = require('../services/user');
const {errorHandler} = require('../utils/dbErrorHandler');
const PAGE_SIZE = 500

exports.register = async (req,res) => {
    try{
        const user = req.body
        if(!user || !user.email || !user.password){
            let error = new Error('Email and Password are required.');
            return res.status(400).json({error : error.message});
        }
        let savedUser = await UserService.createUser(user)
        let token = UserService.generateToken(savedUser)
        return res.status(200).header('x-auth',token).send(savedUser)
    }catch(error){
        let err=errorHandler(error);
        if(err.includes('is not a valid email')){
            return res.status(400).json({error : err});
        }else if(err.includes('email already exists')){
            return res.status(400).json({error : err});
        }
        return res.status(500).json({error : err});
    }
 };

 exports.login = async (req,res) => {
     try{
        passport.authenticate('local', (err, user, info) => {
            if(err){
                console.log(err)
                throw err;
            }
            if(user){
               let token = UserService.generateToken(user)
               res.status(200).header('x-auth',token).send(user)
            }else{
               res.status(401).json({results: info})
            }
        })(req,res);
     }catch(error){
        let err=errorHandler(error);
        res.status(404).json({error: err})
     }
 }

 exports.remove = async (req,res) => {
    try{
        if(req.params.id){
            let isValidId = UserService.checkValidity(req.params.id)
            if(!isValidId)
                res.status(404).send('Please send a valid user!');
            else{
                let result = await UserService.deleteUser(req.params.id)
                res.status(200).json(result);
            }  
        }
    }catch(error){
        console.log(error)
        let err=errorHandler(error);
        res.status(500).send({error: err});
    }
 }

 exports.getAllUsers = async (req,res) => {
     try{
        if(!req.user._id){
            return res.status(401).json({"message" : "Unauthorized Error"})
        }
        const limit = req.query.limit ? parseInt(req.query.limit) : PAGE_SIZE
        const page = req.query.page ? parseInt(req.query.page)  : 0;
        const users = await UserService.findAll(limit, page)
        return res.status(200).send(users)
     }catch(error){
        console.log(error)
        let err=errorHandler(error);
        return res.status(500).send({error: err}); 
     }

 }

 exports.getUserAndTasks = async(req,res) => {
     try{
        if(!req.user._id){
            return res.status(401).json({"message" : "Unauthorized Error"})
        }
        if(req.params.id){
            let isValidId = UserService.checkValidity(req.params.id)
            if(!isValidId){
                res.status(404).send('Please send a valid user!');
            }else{
                let results = await UserService.getUserAndTasks(req.params.id)
                res.status(200).json(results);
            }
        }
     }catch(error){
        console.log(error)
        let err=errorHandler(error);
        return res.status(500).send({error: err});
     }
 }