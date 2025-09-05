let express = require('express');
let router = express.Router();
//引用数据waterConsumptionBar
let BarData = require('../mock/WaterComsumptionBar.json');
//设置路由Bar
router.get('/data', (req, res) =>{
  res.send({BarData:BarData})
})

module.exports=router;