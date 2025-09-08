let express = require('express');
let router = express.Router();
//引用散点图数据
let MapScatterData = require('../mock/MapScatterData.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({ScatterData:MapScatterData})
})

module.exports=router;