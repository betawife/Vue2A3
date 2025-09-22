<template>
  <div class="home-container">
    <!-- 侧边分页栏 -->
    <SideBar 
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
      </header>
      
      <!-- 内容展示区域 -->
      <div class="content-area">
        <div class="component-container">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue'

export default {
  name: 'HomePage',
  components: {
    SideBar
  },
  data() {
    return {
      sidebarCollapsed: false,
    }
  },
  computed: {
    currentPageTitle() {
    // 处理嵌套路由的标题显示
    const routeName = this.$route.name;
    const routeTitles = {
      'EnergyCarbonCharts': '能源与碳排图表',
      'CarbonEmissionCharts': '碳排放图表',
      'EnergyConsumptionCharts': '能源消耗图表',
      'Dashboard': '我的仪表盘',
      'CarbonAccount': '碳账户',
      'Settings': '设置'
    };
    return routeTitles[routeName] || '能源与碳排图表';
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
  
  .content-area {
    padding: 16px;
  }
}
</style>