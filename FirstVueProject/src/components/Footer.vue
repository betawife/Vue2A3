<template>
  <footer>
    <p>© 2024 My Vue App，{{ rightsperson }}all rights reserved</p>
  </footer>
</template>

<script>
  export default {
    name: 'Footer',
    data() {
      return {
      rightsperson:'张三'
      };
    },
    methods: {
      // 可以在这里添加方法
    },
  }
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

footer {
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  color: #6c757d;
}
</style>