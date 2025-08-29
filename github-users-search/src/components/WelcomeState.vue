<template>
  <div class="welcome-state">
    <img src="@/assets/logo.png" alt="GitHub Logo" width="100">
    <h2>Welcome to GitHub User Search</h2>
    <p>Enter a username in the search box above to find GitHub users</p>
  </div>
</template>

<script>
export default {
  name: 'WelcomeState'
}
</script>

<style scoped>
.welcome-state {
  margin-top: 50px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.welcome-state img {
  margin-bottom: 20px;
}
</style>