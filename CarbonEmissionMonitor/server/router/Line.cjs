let express = require('express');
let router = express.Router();
//引用散点图数据
let LineData = require('../mock/LineData.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({LineData:LineData})
})

module.exports=router;