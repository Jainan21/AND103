var express = require('express');
var router = express.Router();

var serviceModel = require("../models/serviceModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");

module.exports = router;

//1
router.get("/all", async function (req, res) {
    try {
      const token = req.header("Authorization").split(' ')[1];
      if(token){
          JWT.verify(token, config.SECRETKEY, async function (err, id){
          if(err){
              res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
          }else{
              var list = await serviceModel.find();
              res.json({status: 200, message: "Thanh cong", data: list});          }
          });
      }else{
          res.status(401).json({status: false,  message: 'Không xác thực'});
      }
  } catch (error) {
      res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});
  }
});

//2
router.post("/add" , async function (req, res){
    try {
        const {name, used, linkImage} = req.body;
        
        const newService = {name, linkImage, used};
        await serviceModel.create(newService);
        res.json({status: 200, message: "Thêm tỉnh thành công"});
    } catch (error) {
        res.json({status: 400, message:"Thêm tỉnh thất bại"});
    }
});

//3
router.delete("/delete/:id", async function (req, res) {
    try {
      const {id} = req.params;
      const result = await serviceModel.findByIdAndDelete(id);
      
      if(result){
        res.status(200).json({ status: true, message: "Xóa tỉnh thành công" });
      }else{
        res.status(404).json({ status: false, message: "Không tìm thấy tỉnh"});
      }
    } catch (err) {
        res.status(400).json({ status: false, message: "Xóa tỉnh thất bại", err: err });
    }
  });

  //4
  router.put("/edit", async function (req, res, next) {
    try {
      const {id, name, used, linkImage} = req.body;
  
      var item = await serviceModel.findById(id);
      if (item) {
        item.name = name ? name : item.name;
        item.linkImage = linkImage ? linkImage : item.linkImage;
        item.used = used ? used : item.used;
        await item.save();
        res.json({ status: 200, message: "Sửa tỉnh thành công" });
      }
    } catch (err) {
      res.json({ status: 400, message: "Sửa tỉnh thất bại" });
    }
  });

  //5
  router.get("/getByID/:id", async function (req, res) {
    try{
        const {id} = req.params;
        var list = await serviceModel.find({id : id});
        res.status(200).json(list);
    }
    catch(e){
    }  
});

//6
router.get("/getByName", async function (req, res){
  try{
      const {name} = req.query;
      var list = await serviceModel.find({name : name});
      res.status(200).json(list);
  }catch(e){
      res.json({status: 400, message: "Có lỗi xãy ra: "+ e});
  }
});

//7
router.get("/getUsed/:used", async function (req, res){
  try{
    const {used} = req.params;
    var list = await serviceModel.find({used : {$gte:used}});
    res.status(200).json(list);
  }catch(e){
    res.json({status: 400, message: "Có lỗi xãy ra: "+ e});
  }
});

//8 
router.get("/getMostUsed", async function (req, res){
  try{
    const {used} = req.params;
    var list = await serviceModel.find({used : {$gte:used}});
    res.status(200).json(list);
  }catch(e){
    res.json({status: 400, message: "Có lỗi xãy ra: "+ e});
  }
});

//9
router.put("/increseUsed/:id", async function (req, res){
  try {
    const {id} = req.params;
    const service = await serviceModel.findByIdAndUpdate(id,{ $inc: { used: 1 } })
    res.status(200).json(list);
  } catch (e) {
    res.json({status: 400, message: "Có lỗi xãy ra: "+ e});
  }
});

//10
router.get("/sort", async function (req, res){
  var list = await serviceModel.find().sort({used : 1});
  res.status(200).json(list);
});