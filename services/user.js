const {ObjectID}=require('mongodb');
const User = require('../models/user')
const Task = require('../models/task')
const async = require('async')

class UserService {
    createUser(user){
        return new Promise(async (resolve, reject) => {
            try{
                async.map(user.tasks, userService.createTask, async (err, tasks) =>{
                    try{
                        if(err){
                            throw err;
                        }
                        const newUser = new User({
                            email: user.email,
                            password: user.password
                        })
                        for(let i=0; i<tasks.length;i++){
                            newUser.tasks.push(tasks[i])
                        }
                        let createdUser = await newUser.save();
                        resolve(createdUser);
                    }catch(error){
                        reject(error)
                    }
                })    
            }catch(error){
                console.log('Error while saving...',error.message);
                reject(error)
            }
        })
    }

    generateToken(user){
        try{
            let token = user.generateAuthToken()
            return token;
        }catch(error){
            console.log('Error while generating token...',error.message);
            return error.message;
        }
    }

    deleteUser(id){
        return new Promise(async(resolve, reject) => {
            try{
                let user = await User.findOneAndDelete({_id: id})
                resolve(user)
            }catch(error){
                console.log('Error while deleting user...',error.message);
                reject(error);
            }
        })
    }

    checkValidity(id){
        try{
            return ObjectID.isValid(id)
        }    
        catch(error){
            console.log('Error while checking id...',error.message);
            return error.message;
        }
    }

    findAll(limit, page){
        let offset = (page-1) * limit
        return new Promise(async(resolve, reject) => {
            try{
               const [results, count] = await Promise.all([
                   User.find({}).skip(offset).limit(limit),
                   User.countDocuments({})
               ])
               const response = {
                   totalResults: count,
                   users: results,
                   page: page,
                   limit: limit
               }
               resolve(response)
            }catch(error){
                console.log('Error while fetching...',error.message);
                reject(error)
            }
        })
    }

    createTask(task, callback){
        var task = new Task({...task})
        task.save(callback);
    }

    getUserAndTasks(id){
        return new Promise(async(resolve, reject) => {
            try{
                let user = await User.findById({_id: id})
                                     .populate('tasks')
                                     .exec()
                resolve(user)
            }catch(error){
                console.log('Error while deleting user...',error.message);
                reject(error);
            }
        })
    }

}

let userService = new UserService();
module.exports = userService