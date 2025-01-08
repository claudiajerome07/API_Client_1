const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose');
const { type } = require('os');
const dotenv=require('dotenv').config()

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json())

mongoose
    .connect(process.env.DB_URI)
    .then(()=>console.log('Connected to DB'))
    .catch((err)=>console.log('Connection Fialed',err))

const MenuSchema=new mongoose.Schema({
  name:{
    required:true,
    type:String
  },
  description:{
    type:String
  },
  price:{
    required:true,
    type:Number
  }
})

const MenuItem=mongoose.model('MenuItem',MenuSchema)

app.post('/menu',async(req,res)=>{
  const {name,description,price}=req.body

  if(!name || !price){
    res.status(400).json({Error:'Enter name and price of the item'})
  }

  try{
    const menu=new MenuItem({name,description,price})
    const savedMenu=await menu.save()

    res.status(201).json({message:'Menu created Successfully',Menu:savedMenu})
  }catch(err){
    res.status(500).json({Error:err.message})
  }
})

app.get('/menu',async(req,res)=>{
  try{
    const Menu=await MenuItem.find()
    res.status(200).json({Menu})
  }catch(err){
    res.status(500).json({message:'Failed to fetch menu items',Error:err.message})
  }
})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
