const express = require('express')
require('./db/mongoose')

//Load routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
 
app.use(express.json()) // This line parse  the incoming json to object
app.use(userRouter)     // Register the userRouter
app.use(taskRouter)     // Register the taskRouter

module.exports = app

// const pet = {
//     dog(){

//     }
// }

// Experiment - File upload
/*
const multer = require('multer')
const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){  // cb is a callback function
        if(!file.originalname.match(/\.(doc|docx)$/)){
            cb(new Error('Please upload a word documents'))
        }

        cb(undefined, true)
    }
})
app.post('/upload', upload.single('upload') , (req, res) => {
    res.send()
}, (error, req, res, next) => { // this callback fun for handling error
    res.status(400).send({ error: error.message })
})
*/

// <><><><><> <><><><><><><> <><><><><><><> <><><><><><><> <><><><><><> <><><><><> <><><><><> <><><><><> <><>

// Experiment - the User and Task relationship
/*
const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById({_id: "6149ad374f50b585f690a785"})
    // await task.populate('owner')
    // console.log(task.owner)

    const user = await User.findById('6149acd64f50b585f690a777')
    await user.populate('tasks')
    console.log(user.tasks)
}

main()
*/

// Experiment - the toJSON mathod of object (Video No. 112-11 section 12)
/*

const cat = {
    name:"pat"
}

cat.toJSON = function(){
    console.log(this)
    return this 
}

console.log(JSON.stringify(cat))

*/

// Experiment - How to use jsonwebtoken
/*
const jwt = require('jsonwebtoken')

const myFunction = async () =>{
    const token = jwt.sign({_id:'abc123'}, 'thisismynewcourse', { expiresIn: '7 days' })
    console.log(token)

    const data = jwt.verify(token, 'thisismynewcourse')
    console.log(data)
}

myFunction()
*/

// Experiment - How to use bcrypt
/*
const bcrypt = require('bcryptjs')

const myFunction = async () =>{
    const password = 'Red123!$'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare('Red123!$',hashedPassword)

    console.log(isMatch)
}

myFunction()
*/

// <><><><><> <><><><><><><> <><><><><><><> <><><><><><><> <><><><><><> <><><><><> <><><><><> <><><><><> <><>

/*  [ End Points by async await comments Bcoz of it all are fixed in seperate file (16-09-2021)] 

// Creating endpoint for create new user (using async await)
app.post('/users',async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    } catch(e){
        res.status(400).send(e)
    }    
})

// Creating Endpoint for fetching all the users (using async await)
app.get('/users',async (req,res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e){
        res.status(500).send(e)
    }  
})

// Creating endpoint for fetching user by id (using async await)
app.get('/users/:id',async (req,res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send('Not Found!!')
        }
        res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for update the user (using async await)
app.patch('/users/:id',async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'emails', 'password', 'age']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updtes!'})
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true})
        
        if(!user){
            return res.status(404).send('Not Found!')
        } 

        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

// Creating endpoint for delete the user (using async await)
app.delete('/users/:id',async (req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send('Not Found!')
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for creat new task (using async await)
app.post('/tasks',async (req,res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

// Creating endpoint for fetching tasks (using async await)
app.get('/tasks',async (req,res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for fetching task by id (using async await)
app.get('/tasks/:id',async (req,res) => {
    const _id = req.params.id
    try{
        const user = await Task.findById(_id)
        if(!user){
            return res.status(404).send('Not Found!')
        }
        res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for update the task (using async await)
app.patch('/tasks/:id',async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    
    if(!isValidOperation){
        return res.status(400).send({error:'invalid update!'})
    }
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true , runValidators:true})

        if(!task){
            return res.status(404).send('Not Found!')
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for delete the task (using async await)
app.delete('/tasks/:id',async (req,res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send('Not Found!')
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

*/

// <><><><><> <><><><><><><> <><><><><><><> <><><><><><><> <><><><><><> <><><><><> <><><><><> <><><><><> <><>

/*  [_ I was Setting Routes with promise chaining and now use the async await thats why It has been commented (16-09-2021)_]

// Creating endpoint for create new user
app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// Creating Endpoint for fetching all the users
app.get('/users',(req,res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// Creating endpoint for fetching user by id
app.get('/users/:id',(req,res) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send('Not Found!!')
        }
        res.send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// Creating endpoint for creat new task
app.post('/tasks',(req,res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// Creating endpoint for fetching tasks
app.get('/tasks',(req,res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// Creating endpoint for fetching task by id
app.get('/tasks/:id',(req,res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if(!task){
           return res.status(404).send('Not Found!!')
        } 
        res.send(task)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

*/