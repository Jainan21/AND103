var express = require('express');
var router = express.Router();

var serviceModel = require("../models/serviceModel");
var upload = require('../ultil/upload');


module.exports = router;

//1
router.get("/all", async function (req, res) {
    try{
        var list = await serviceModel.find();
        res.json({status: 200, message: "Thanh cong", data: list});
    }
    catch(e){
      res.json({status: 400, message: "Có lỗi xãy ra: "+ e});
    }  
});

//2
router.post("/add", [upload.single('image')] , async function (req, res){
    try {
        const {name, used} = req.body;
        const {file} = req;

        if (!file || !name) {
            return res.json({ status: 0, message: "Nhập tên và thêm ảnh" });
        }

        const linkImage = `http://localhost:3000/uploads/${file.filename}`;

        const newService = {name, linkImage, used};
        await serviceModel.create(newService);
        res.json({status: 200, message: "Thêm dịch vụ thành công"});
    } catch (error) {
        res.json({status: 400, message:"Thêm dịch vụ thất bại"});
    }
});

//3
router.delete("/delete/:id", async function (req, res) {
    try {
      const {id} = req.params;
      const result = await serviceModel.findByIdAndDelete(id);
      
      if(result){
        res.status(200).json({ status: true, message: "Xóa dịch vụ thành công" });
      }else{
        res.status(404).json({ status: false, message: "Không tìm thấy dịch vụ"});
      }
    } catch (err) {
        res.status(400).json({ status: false, message: "Xóa dịch vụ thất bại", err: err });
    }
  });

  //4
  router.put("/edit", [upload.single('image')], async function (req, res, next) {
    try {
      const {id, name, used} = req.body;
      const linkImage = req.file ? req.file.path : null;
  
      var item = await serviceModel.findById(id);
      if (item) {
        item.name = name ? name : item.name;
        item.linkImage = linkImage ? linkImage : item.linkImage;
        item.used = used ? used : item.used;
        await item.save();
        res.json({ status: 200, message: "Sửa dịch vụ thành công" });
      }
    } catch (err) {
      res.json({ status: 400, message: "Sửa dịch vụ thất bại" });
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