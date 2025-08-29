<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <h3>Something went wrong</h3>
    <p>{{ errorMessage }}</p>
    <button @click="$emit('retry')">Try Again</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    errorMessage: {
      type: String,
      default: 'An unknown error occurred'
    }
  }
}
</script>

<style scoped>
.error-state {
  margin-top: 50px;
  padding: 20px;
  background-color: #ffebee;
  border-radius: 8px;
}

.error-icon {
  font-size: 40px;
  margin-bottom: 20px;
}

button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #d32f2f;
}
</style>