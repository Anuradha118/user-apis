const mongoose=require('mongoose');

const TaskSchema= new mongoose.Schema({
    text:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    }
});

const Task=mongoose.model('Task',TaskSchema);

module.exports= Task;