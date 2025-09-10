let express = require('express');
let router = express.Router();
//引用雷达图数据
let RadarData = require('../mock/RadarData.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({RadarData:RadarData})
})

module.exports=router;