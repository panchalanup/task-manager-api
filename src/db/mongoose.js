const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
})

// -----------------------------
//  *** To create User Model ***
// -----------------------------

// const User = mongoose.model('User', {
//     name: {
//         type: String
//     },
//     age: {
//         type: Number
//     }
// })

// const me = new User({
//     name: "Anup",
//     age: 21
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log("Error! ", error)
// })

// -----------------------------
//  *** To create Task Model ***
// -----------------------------

// const Task = mongoose.model('Task',{
//     task:{
//         type:String
//     },
//     completed:{
//         type:Boolean
//     }
// })

// const task1 = new Task({
//     description:"To reading a book",
//     completed:true
// })

// task1.save().then(() => {
//     console.log(task1)
// }).catch((error) => {
//     console.log("Error! ",error)
// })

// --------------------------------
//  *** Validate the User Model *** 
// --------------------------------

// const User = mongoose.model('User',{
//     name:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     email:{
//         type:String,
//         require:true,
//         trim:true,
//         lowercase:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         minLength:7,
//         trim:true,
//         validate(value){
//             if(value.toLowercase().includes('password')){
//                 throw new Error('Password cannot contains "Password"')
//             }
//         }
//     },
//     age:{
//         type:String,
//         default:0,
//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })

// const me = new User({
//     name:'  Anup   ',
//     email:'PANCHALANUP2572@GMAIL.COM   ',
//     password:'Anup123  '
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// }) 

// --------------------------------
//  *** Validate the Task Model *** 
// --------------------------------

// const Task = mongoose.model('Task',{
//    description:{
//         type:String,
//         required:true,
//         trim:true
//    },
//    completed:{
//         type:Boolean,
//         default:false
//    }
// })

// const task = new Task({
//     description:"   Clean the room  ",
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })