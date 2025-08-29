<template>
  <div class="loading-state">
    <div class="spinner"></div>
    <p>Searching GitHub users...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingState'
}
</script>

<style scoped>
.loading-state {
  margin-top: 50px;
  padding: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>