let express = require('express');
let router = express.Router();
//引用数据waterConsumption
let MapData = require('../mock/WaterConsumption.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({MapData:MapData})
})

module.exports=router;