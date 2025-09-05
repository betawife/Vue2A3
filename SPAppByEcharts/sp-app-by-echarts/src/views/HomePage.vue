<template>
  <div id="home-page">
    <Titlecomponent></Titlecomponent>
    <Containercomponent></Containercomponent>
  </div>
</template>

<script>
import Titlecomponent from '@/components/titlecomponent.vue';
import Containercomponent from '../components/containercomponent.vue';

export default {
  name: 'HomePage',
  components: {
    Titlecomponent,
    Containercomponent
  }
}
</script>

<style scoped>
#home-page {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: flex-start;
  background-color: #01020d;
  background-image: url("../assets/backgroundIMG.png");
  background-size: cover;
  background-position: center;
  color: #fff;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-height: 1347px) {
  #home-page {
    min-height: auto;
    height: 100%;
  }
}

@media (max-width: 768px) {
  #home-page {
    overflow-y: auto;
  }
}
</style>