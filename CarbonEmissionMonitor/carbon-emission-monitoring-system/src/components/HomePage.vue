<template>
  <div class="home-container">
    <!-- 侧边分页栏 -->
    <Sidebar 
      :active-tab="activeTab" 
      @tab-change="handleTabChange"
      :collapsed="sidebarCollapsed"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
    />
    
    <!-- 主内容区域 -->
    <main class="main-content" :class="{ 'collapsed': sidebarCollapsed }">
      <!-- 顶部导航栏 -->
      <header class="content-header">
        <div class="header-left">
          <button 
            class="toggle-sidebar-btn"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <i class="icon-menu"></i>
          </button>
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        
        <div class="header-right">
          <div class="user-info">
            <span class="user-name">用户名称</span>
            <div class="user-avatar">
              <i class="icon-user"></i>
            </div>
          </div>
        </div>
      </header>
      
      <!-- 内容展示区域 -->
      <div class="content-area">
        <div class="component-container">
          <component :is="currentComponent" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SideBar from './SideBar.vue'

// 示例组件 - 在实际项目中替换为实际组件
const Dashboard = {
  template: `
    <div class="placeholder-component">
      <h2>仪表板页面</h2>
      <p>这里是仪表板内容区域</p>
      <div class="placeholder-content">
        <div class="stats-card">
          <h3>总碳排放量</h3>
          <p class="stat-value">1,245.67 MtCO₂</p>
        </div>
        <div class="stats-card">
          <h3>本月排放</h3>
          <p class="stat-value">89.23 MtCO₂</p>
        </div>
      </div>
    </div>
  `
}

const CarbonMap = {
  template: `
    <div class="placeholder-component">
      <h2>碳排放地图</h2>
      <p>地图组件将在这里显示</p>
      <div class="map-placeholder">
        <i class="icon-map"></i>
        <span>地图加载中...</span>
      </div>
    </div>
  `
}

const Transportation = {
  template: `
    <div class="placeholder-component">
      <h2>交通方式对比</h2>
      <p>交通碳排放对比分析</p>
    </div>
  `
}

export default {
  name: 'HomePage',
  components: {
    Sidebar: SideBar
  },
  data() {
    return {
      activeTab: 'dashboard',
      sidebarCollapsed: false,
      tabs: [
        { 
          id: 'dashboard', 
          name: '仪表板', 
          icon: 'icon-dashboard',
          component: Dashboard
        },
        { 
          id: 'carbon-map', 
          name: '碳排放地图', 
          icon: 'icon-map',
          component: CarbonMap
        },
        { 
          id: 'transportation', 
          name: '交通对比', 
          icon: 'icon-transport',
          component: Transportation
        },
        { 
          id: 'trends', 
          name: '趋势分析', 
          icon: 'icon-trend',
          component: { template: '<div><h2>趋势分析</h2><p>趋势图表将在这里显示</p></div>' }
        },
        { 
          id: 'carbon-account', 
          name: '碳账户', 
          icon: 'icon-account',
          component: { template: '<div><h2>我的碳账户</h2><p>个人碳足迹管理</p></div>' }
        },
        { 
          id: 'settings', 
          name: '设置', 
          icon: 'icon-settings',
          component: { template: '<div><h2>系统设置</h2><p>应用程序设置</p></div>' }
        }
      ]
    }
  },
  computed: {
    currentComponent() {
      const tab = this.tabs.find(t => t.id === this.activeTab)
      return tab ? tab.component : Dashboard
    },
    currentPageTitle() {
      const tab = this.tabs.find(t => t.id === this.activeTab)
      return tab ? tab.name : '仪表板'
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.activeTab = tabId
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 64px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-sidebar-btn:hover {
  background-color: #f0f0f0;
}

.icon-menu {
  font-size: 18px;
  color: #666;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2d3d;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  color: #666;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-user {
  font-size: 18px;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.component-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: auto;
}

.placeholder-component {
  padding: 24px;
}

.placeholder-component h2 {
  color: #1f2d3d;
  margin-bottom: 16px;
}

.placeholder-component p {
  color: #666;
  margin-bottom: 24px;
}

.placeholder-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.stats-card {
  padding: 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  color: white;
}

.stats-card h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  opacity: 0.9;
}

.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.map-placeholder {
  height: 400px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.map-placeholder .icon-map {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.collapsed {
    margin-left: 0;
  }
  
  .content-header {
    padding: 0 16px;
  }
  
  .user-name {
    display: none;
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>