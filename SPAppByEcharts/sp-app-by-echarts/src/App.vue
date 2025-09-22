<template>
  <router-view></router-view>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import {provide } from 'vue';

//设置axios基准路径
axios.defaults.baseURL = 'http://localhost:8888';
export default {
  name: 'App',

  setup() {
    provide('axios', axios);
    provide('echarts', echarts);
    return {}
  },
  
}
</script>

<style>

</style>
