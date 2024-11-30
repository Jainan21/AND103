var express = require('express');
var router = express.Router();

var serviceModel = require("../models/serviceModel");

module.exports = router;

router.get("/all", async function (req, res) {
    try{
        var list = await serviceModel.find();
        res.status(200).  json(list)
    }
    catch(e){
    }  
})

router.post("/add", async function (req, res){
    
})