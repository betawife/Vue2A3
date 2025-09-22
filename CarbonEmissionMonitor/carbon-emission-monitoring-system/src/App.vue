<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import {provide,ref } from 'vue';
//引入图表主题
import {greenEcologyTheme} from './assets/green-ecology-theme.js';
import {lowCarbonTheme} from './assets/low-carbon-theme.js'

//设置axios基准路径
axios.defaults.baseURL = 'http://localhost:8888/';
export default {
  name: 'App',

setup() {
  const theme = ref(localStorage.getItem('appTheme') || 'green');

  //向后代组件提供axios,echarts,theme
  provide('axios', axios);
  provide('echarts', echarts);
  provide('greenEcologyTheme', greenEcologyTheme);
  provide('lowCarbonTheme', lowCarbonTheme);
  provide('theme', theme);
  return {}
},
  
}
</script>