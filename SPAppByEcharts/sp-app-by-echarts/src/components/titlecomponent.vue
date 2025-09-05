<template>
  <div id="title">
    <h1>河南省农业用水量监测平台</h1>
  </div>
</template>

<script>
export default {
  name: 'titlecomponent',
}
</script>

<style scoped>
  #title {
  height: 55px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15 0;
  background-color: rgba(0, 20, 40, 0.7);
  border-bottom: 1 solid rgba(0, 149, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 10;
}
  #title h1 {
  margin: 0;
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
  @media (max-width: 768px) {
  #title h1 {
    font-size: 19.2px;
  }
  
}
</style>