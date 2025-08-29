<template>
  <div class="response-list">
    <h3>Search Results ({{ users.length }})</h3>
    
    <div class="user-grid">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="user-card"
        @click="openUserProfile(user.html_url)"
      >
        <img :src="user.avatar_url" :alt="user.login" class="avatar">
        <p>{{ user.login }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponseList',
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  methods: {
    openUserProfile(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>
.response-list {
  margin-top: 30px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.user-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}
</style>