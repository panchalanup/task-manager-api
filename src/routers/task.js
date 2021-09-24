const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// Creating endpoint for creat new task (using async await)
router.post('/tasks', auth, async (req,res) => {

    const task = new Task({  
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

// Creating endpoint for fetching tasks (using async await)
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res) => {

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try{ 
        //const tasks = await Task.find({owner:req.user._id})

        // Second Approach
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

        res.send(req.user.tasks)
    } catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for fetching task by id (using async await)
router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})

        if(!task){
            return res.status(404).send('Not Found!')
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for update the task (using async await)
router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    
    if(!isValidOperation){
        return res.status(400).send({error:'invalid update!'})
    }
    try{

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

         updates.forEach((update) => task[update] = req.body[update])
         await task.save()

        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true , runValidators:true})

        if(!task){
            return res.status(404).send('Not Found!')
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

// Creating endpoint for delete the task (using async await)
router.delete('/tasks/:id', auth, async (req,res) => {
    try{
        const task = await Task.findByIdAndDelete({_id:req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send('Not Found!')
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router