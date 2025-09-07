<template>
  <aside class="sidebar" :class="{ 'collapsed': collapsed }">
    <!-- 品牌标识 -->
    <div class="sidebar-header">
      <div class="brand" v-if="!collapsed">
        <i class="icon-earth"></i>
        <span class="brand-name">碳足迹分析仪</span>
      </div>
      <div class="brand-collapsed" v-else>
        <i class="icon-earth"></i>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-item"
          :class="{ 'active': activeTab === tab.id }"
          @click="handleTabClick(tab.id)"
        >
          <div class="nav-link">
            <i :class="tab.icon"></i>
            <span class="nav-text" v-if="!collapsed">{{ tab.name }}</span>
          </div>
        </li>
      </ul>
    </nav>
    
    <!-- 折叠按钮 -->
    <div class="sidebar-footer">
      <button class="collapse-btn" @click="$emit('toggle-collapse')">
        <i :class="collapsed ? 'icon-expand' : 'icon-collapse'"></i>
        <span v-if="!collapsed">折叠菜单</span>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    activeTab: {
      type: String,
      default: 'dashboard'
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabs: [
        { id: 'dashboard', name: '仪表盘', icon: 'icon-dashboard' },
        { id: 'carbon-map', name: '碳排放地图', icon: 'icon-map' },
        { id: 'transportation', name: '交通对比', icon: 'icon-transport' },
        { id: 'sunburst', name: '贡献比例', icon: 'icon-trend' },
        { id: 'carbon-account', name: '碳账户', icon: 'icon-account' },
        { id: 'settings', name: '设置', icon: 'icon-settings' }
      ]
    }
  },
  methods: {
    handleTabClick(tabId) {
      this.$emit('tab-change', tabId)
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: linear-gradient(180deg, #1f2d3d 0%, #324a5f 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand i {
  font-size: 24px;
  color: #00c6ff;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.brand-collapsed {
  display: flex;
  justify-content: center;
}

.brand-collapsed i {
  font-size: 24px;
  color: #00c6ff;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  gap: 12px;
}

.nav-link i {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.collapse-btn i {
  font-size: 18px;
}

/* 图标字体样式 */
.icon-dashboard:before { content: "📊"; }
.icon-map:before { content: "🗺️"; }
.icon-transport:before { content: "🚗"; }
.icon-sunburst:before { content: "📈"; }
.icon-account:before { content: "👤"; }
.icon-settings:before { content: "⚙️"; }
.icon-earth:before { content: "🌎"; }
.icon-collapse:before { content: "◀"; }
.icon-expand:before { content: "▶"; }
.icon-menu:before { content: "☰"; }
.icon-user:before { content: "👤"; }

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 280px;
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
    width: 64px;
  }
  
  .nav-text {
    display: block;
  }
  
  .sidebar.collapsed .nav-text {
    display: none;
  }
}
</style>