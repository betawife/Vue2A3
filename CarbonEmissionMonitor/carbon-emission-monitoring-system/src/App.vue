<template>
  <div id="app">
    <HomePage />
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import {provide } from 'vue';

import HomePage from './components/HomePage.vue';

//设置基准路径
axios.defaults.baseURL = 'http://localhost:8888';
export default {
  name: 'App',

  components: {
    HomePage
  },
  
  setup() {
    provide('axios', axios);
    provide('echarts', echarts);
    return {}
  },
  
}
</script>

<style>

</style>
