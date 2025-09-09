let express = require('express');
let router = express.Router();
//引用旭日图数据
let SunBurstData = require('../mock/SunBurstData.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({SunBurstData:SunBurstData})
})

module.exports=router;