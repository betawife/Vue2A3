<template>
  <div class="home-container">
    <!-- 侧边分页栏 -->
    <SideBar 
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
import DashboardComponent from './DashboardComponent.vue'
import CarbonMap from './CarbonMap.vue'
import TransportationComponent from './TransportationComponent.vue'
import SunBurst from './SunBurst.vue'
import CarbonAccount from './CarbonAccount.vue'
import SettingsComponent from './SettingsComponent.vue'

export default {
  name: 'HomePage',
  components: {
    SideBar,
    DashboardComponent,
    CarbonMap,
    TransportationComponent,
    SunBurst,
    CarbonAccount,
    SettingsComponent
  },
  data() {
    return {
      activeTab: 'dashboard',
      sidebarCollapsed: false,
      // 定义侧边栏的标签和对应的组件
      tabs: [
        { 
          id: 'dashboard', 
          name: '仪表盘', 
          icon: 'icon-dashboard',
          component: DashboardComponent
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
          component: TransportationComponent
        },
        { 
          id: 'sunburst', 
          name: '贡献占比', 
          icon: 'icon-trend',
          component: SunBurst
        },
        { 
          id: 'carbon-account', 
          name: '碳账户', 
          icon: 'icon-account',
          component: CarbonAccount
        },
        { 
          id: 'settings', 
          name: '设置', 
          icon: 'icon-settings',
          component: SettingsComponent
        }
      ]
    }
  },
  computed: {
    // 根据 activeTab 动态加载组件currentComponent
    currentComponent() {
      const tab = this.tabs.find(t => t.id === this.activeTab);
      return tab ? tab.component : DashboardComponent; 
    },
    currentPageTitle() {
      const tab = this.tabs.find(t => t.id === this.activeTab)
      return tab ? tab.name : '仪表盘'
    }
  },
  methods: {
    //侧边栏触发事件，传参tabId
    handleTabChange(tabId) {
      this.activeTab = tabId //更新当前激活的标签
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