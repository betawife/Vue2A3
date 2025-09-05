<template>
  <div id="rightcharts">
  <bar></bar>
  <pie></pie>
  </div>
</template>

<script>
import bar from './barcomponent.vue' 
import pie from './piecomponent.vue'
export default {
  name: 'rightcharts',
  components: {
    bar,
    pie
  },
}
</script>

<style scoped>
#rightcharts {
  display: flex;
  flex-direction: column;
  width: 42%;
  height: 1260px;
  gap: 20px;
}

/* 响应式设计 */
@media(max-height: 1347px) {
  #rightcharts {
    min-width: 500px;
  }
}

@media (max-width: 768px) {
  #rightcharts {
    gap: 12px;
  }
}
</style>