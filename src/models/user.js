const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// Creating custom validator method to check string contains 'trt' ?
/*
Object.defineProperty(validator,'isEmailContainsTRT',{
    value: function(str){
        return validator.isEmail(str) && str.includes('trt')
    }
})
*/

const userSchema = mongoose.Schema({
    name:{ 
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
            // Task to add method isTRT() same as isEmail()
        }
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contains "Password"')
            }
        }
    },
    age:{
        type:String,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }
    }],
    avatar: {
        type:Buffer
    }
}, {
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField: '_id',
    foreignField: 'owner'
})

// toJSON is object predefined rule (Video No. 112-11 section 12)
userSchema.methods.toJSON = function(){
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id:user._id.toString() }, process.env.JWT_SECRET)

    user.tokens =  user.tokens.concat({ token : token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user  = await User.findOne({ email:email })

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}
 
// Using the Schema we can do something with the schema like Before event Or After Event
// hash the plaintext password befor saving
userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() 
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner:  user._id })
    next()
})

const User = mongoose.model('User', userSchema )

module.exports = User 