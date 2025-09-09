let express = require('express');
let app = express();
const port = 8888;

//添加 CORS 中间件,解决跨域问题
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // 允许的前端地址
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // 处理预检请求 (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
// 其他中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true }));

//引用路由文件
let Map =require("./router/Map.cjs");
let SunBurst =require("./router/SunBurst.cjs")
//中间件配置各路由
app.use('/map',Map);
app.use('/sunburst',SunBurst);
//监听端口
app.listen(port,()=>{
  console.log(`服务已启动，端口${port}监听中...`)
})
