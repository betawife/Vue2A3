let express = require('express');
let router = express.Router();
//引用扇形图数据
let PieData = require('../mock/PieData_E.json');
//设置路由Map
router.get('/data', (req, res) =>{
  res.send({PieData:PieData})
})

module.exports=router;