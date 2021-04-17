const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');

const UserSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tasks:[{type: mongoose.Schema.Types.ObjectId, ref:'Task'}]
},
{ 
    usePushEach: true 
});
UserSchema.methods.toJSON=function(){
    var user=this;
    var userObject=user.toObject();

    return _.omit(userObject,['password']);
};
UserSchema.methods.generateAuthToken=function(){
    var user=this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET,{expiresIn: '24h'}).toString();
    return token;
};

UserSchema.statics.findByCredentials=function(email,password){
    var User=this;
   return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject(`No user found with ${email}`);
        }

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user);
                }else{
                    if(!err){
                        err = 'Bad Credentials.'
                    }
                    reject(err);
                }  
            });
        });
    });
};

UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }else{
        next();
    }
})
const User=mongoose.model('User',UserSchema);

module.exports= User;