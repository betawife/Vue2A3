<template>
  <div id="container">
    <Map></Map>
    <rightcharts></rightcharts>
  </div>
</template>

<script> 
import Map from './Map.vue';
import rightcharts from './rightcharts.vue';
export default {
  name: 'container',
  components: {
    Map,
    rightcharts
  }
}
</script>

<style scoped>
#container {
  display: flex;
  flex: 1;
  width: 100%;
  height: 1260px;
  overflow: hidden;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

/* 响应式设计 */
@media (max-height: 1347px) {
  #container {
    height: calc(100vh - 90px);
    min-height: 1100px;
  }
}

@media (max-width: 768px) {
  #container {
    padding: 12px;
    gap: 12px;
  }
}
</style>