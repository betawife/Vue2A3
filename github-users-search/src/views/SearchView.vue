<template>
  <div class="search-container">
    <h1>GitHub User Search</h1>
    
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        @keyup.enter="searchUsers" 
        placeholder="Enter GitHub username..."
      />
      <button @click="searchUsers">Search</button>
    </div>
    
    <!-- 状态组件 -->
    <welcome-state v-if="currentState === 'welcome'" />
    <loading-state v-else-if="currentState === 'loading'" />
    <error-state 
      v-else-if="currentState === 'error'" 
      :error-message="errorMessage" 
      @retry="searchUsers"
    />
    <response-list 
      v-else-if="currentState === 'results'" 
      :users="users" 
    />
  </div>
</template>

<script>
import axios from 'axios'
import WelcomeState from '@/components/WelcomeState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import ResponseList from '@/components/ResponseList.vue'

export default {
  name: 'SearchView',
  components: {
    WelcomeState,
    LoadingState,
    ErrorState,
    ResponseList
  },
  data() {
    return {
      searchQuery: '',
      currentState: 'welcome', // welcome, loading, results, error
      users: [],
      errorMessage: ''
    }
  },
  methods: {
    async searchUsers() {
      if (!this.searchQuery.trim()) return
      
      this.currentState = 'loading'
      
      try {
        const response = await axios.get(
          `https://api.github.com/search/users?q=${this.searchQuery}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )
        
        this.users = response.data.items
        this.currentState = this.users.length ? 'results' : 'welcome'
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred'
        this.currentState = 'error'
        console.error('Search error:', error)
      }
    }
  }
}
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3aa876;
}
</style>