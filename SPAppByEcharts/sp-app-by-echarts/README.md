# 河南省农业用水监测平台
##  基于 Vue3 + ECharts + Express 的SPA解决方案

---

## &#127919; 项目简介
本项目是一个单页应用(SPA)，通过可视化手段展示河南省历史月份农业用水量数据。采用现代前端技术栈实现多图表联动交互，利用EventBus实现跨组件通信，确保月份切换时所有图表同步更新。

---

## &#9881;️ 核心技术架构
| 层级       | 技术选型              | 作用说明                          |
|------------|-----------------------|-----------------------------------|
| **前端框架** | Vue 3.x             | Composition API开发模式           |
| **可视化库** | ECharts v5           | 高性能图表渲染                    |
| **通信机制** | Mitt (EventBus)      | 全局事件驱动的状态同步            |
| **构建工具** | Vite                 | 极速热更新与生产环境优化          |
| **后端服务** | Express             | RESTful API模拟数据接口           |

---

## &#128202; 核心功能演示
### 1. 动态交互系统
- &#128279; **自动联动**：图表事件 + `eventBus.emit('monthChange')` 更新、发送月份
- &#128260; **多图响应**：折线图/柱状图/饼图实时同步更新数据
- &#127806; **区域钻取**：点击饼图扇形可下探具体地市详情

### 2. EventBus实现原理
```javascript
// src/main.js
    import mitt from 'mitt';

    const eventBus = mitt();
    export default eventBus;

//src/components/barcomponent.vue
     import eventBus from '@/main';

// echarts图表点击事件，更新并发送currentMonth
     myChart.value.on("click", function(params) {
        currentMonth.value = params.name;
        eventBus.emit('monthChanged', currentMonth.value); 
      });
//Map.vue & piecomponent.vue
     import eventBus from '@/main';

//监听月份变化的事件总线
    eventBus.on('monthChanged', (newMonth) => {
      currentMonth.value = newMonth;
      disposeData(currentMonth.value); //处理数据,获取当月数据
      initChart(); //重新初始化图表
    });
```
## 💻 项目展示
     ！[首页](./src/assets/homepage.png)
## 🔨 部署说明
   - **部署说明安装依赖**：npm install
   - **启动前端服务**：npm run serve → 访问 http://localhost:8080
   - **后端模拟服务启动**：node server.js
   - **构建生产包(可选)**：npm run build → 部署dist、server目录到服务器

      
