'use strict';

const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const PORT = process.env.PORT


const mongoose = require('mongoose');
const { query } = require('express');

let FruitModel;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGOOS_API);


  const FruitSchema = new mongoose.Schema({
    name: String,
    price : String,
    image: String,
    email: String,
  });

  FruitModel = mongoose.model('Fruit', FruitSchema);




}




/**Routs */
server.get('/', getDataHandler);
server.post('/addToFav', addToFavHandler)
server.get('/favItems', getFavDataHandler)
server.put('/updateInfo/:id', updateInfoHandler)
server.delete('/deleteItem/:id', deleteHandler)

/**Functions */

function getDataHandler(req,res){

    axios
    .get('https://fruit-api-301.herokuapp.com/getFruit')
    .then(result=>{
        res.send(result.data.fruits)
    })
    .catch(err=>{
        console.log(err);
    })
}

async function addToFavHandler(req,res){
    const {name, price, image, email}=req.body

    await FruitModel.create({name, price, image, email});

    FruitModel.find({email:email}, (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
}

function getFavDataHandler(req,res){
    const email = req.query.email;

    FruitModel.find({email:email},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
}

function updateInfoHandler(req,res){
    const id = req.params.id;

    const {name, price, email} = req.body;

    FruitModel.findByIdAndUpdate(id, {name,price,email}, (err,result)=>{
        FruitModel.find({email:email},(err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result)
            }
        })
    })
}


function deleteHandler(req,res){

    const id = req.params.id;
    const email = req.query.email;

    FruitModel.deleteOne({_id:id}, (err,result)=>{
        FruitModel.find({email:email},(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result)
            }
        })
    })
}

server.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
})