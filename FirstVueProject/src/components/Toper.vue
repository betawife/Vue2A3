<template>
  <div class="toper"> 
    <h1>Welcome to My Vue App</h1>
    <p>This is the header section of the application.</p>
    <button @click="showinfo">show info</button>
  </div>
</template>

<script>
  export default {
    name: 'Toper',
    methods: {
      showinfo() {
        alert('This is the header section of the application.');
      }
    },
  }
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
toper {
  background-color: #007bff;
  color: white;
  padding: 20px;
  text-align: center;
}
</style>