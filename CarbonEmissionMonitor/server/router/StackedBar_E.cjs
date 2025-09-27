let express = require('express');
let router = express.Router();
//引用堆叠柱形图数据
let StackedBarData = require('../mock/StackedBarData_E.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({StackedBarData:StackedBarData})
})

module.exports=router;