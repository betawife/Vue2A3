let express = require('express');
let router = express.Router();
//引用折线图数据
let LineData = require('../mock/LineData_E.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({LineData:LineData})
})

module.exports=router;