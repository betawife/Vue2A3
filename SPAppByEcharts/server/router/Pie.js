let express = require('express');
let router = express.Router();
//引用数据waterConsumption
let PieData = require('../mock/WaterConsumption.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({PieData:PieData})
})

module.exports=router;