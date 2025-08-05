<template>
  <div id="app">
    <Toper></Toper>
    <Footer></Footer>
  </div>
</template>

<script>
  export default {
    name: 'App',
    
    methods: {
      // 可以在这里添加方法
    },
    components: {
      Footer: () => import('./Footer.vue'),
      Toper: () => import('./Toper.vue')
    },
    
  }
</script>
