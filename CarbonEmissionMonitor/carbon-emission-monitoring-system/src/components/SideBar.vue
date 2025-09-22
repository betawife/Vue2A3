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
        <!--侧边栏标签-->
        <li
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-item"
          :class="{ 
            // 当前路由匹配时高亮
            'active': $route.name === tab.routeName || (tab.children && isChildActive(tab.children)),
            'has-children': tab.children && tab.children.length > 0
          }"
          @mouseenter="handleMouseEnter(tab)"
          @mouseleave="handleMouseLeave"
          @click="handleTabClick(tab)"
        >
          <div class="nav-link">
            <i :class="tab.icon"></i>
            <span class="nav-text" v-if="!collapsed">{{ tab.name }}</span>
            <!-- 子菜单指示器 -->
            <i v-if="!collapsed && tab.children && tab.children.length > 0" 
               class="children-indicator">
              ▶
            </i>
          </div>
        </li>
      </ul>
    </nav>
    
    <!-- 弹出式子级侧边栏(激活时显示) -->
    <div v-if="showSubMenu && activeTabWithChildren" 
         class="sub-sidebar"
         :style="subMenuStyle"
         @mouseenter="handleSubMenuEnter"
         @mouseleave="handleSubMenuLeave">
      <div class="sub-sidebar-header">
        <h3>{{ activeTabWithChildren.name }}</h3>
      </div>
      <ul class="sub-nav-list">
        <li
          v-for="childTab in activeTabWithChildren.children"
          :key="childTab.id"
          class="sub-nav-item"
          :class="{ 'active': $route.name === childTab.routeName }"
          @click="handleSubTabClick(childTab)"
        >
          <div class="sub-nav-link">
            <i :class="childTab.icon"></i>
            <span class="sub-nav-text">{{ childTab.name }}</span>
          </div>
        </li>
      </ul>
    </div>
    
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
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSubMenu: false,
      activeTabWithChildren: null,
      subMenuTimer: null,
      //侧边栏标签数据
      tabs: [
        { 
          id: 'energy-carbon-charts', 
          name: '能源与碳排图表', 
          icon: 'icon-charts',
          routeName: 'EnergyCarbonCharts',
          children: [
            { 
              id: 'carbon-emission', 
              name: '碳排放图表', 
              icon: 'icon-emission',
              routeName: 'CarbonEmissionCharts'
            },
            { 
              id: 'energy-consumption', 
              name: '能源消耗图表', 
              icon: 'icon-energy',
              routeName: 'EnergyConsumptionCharts'
            }
          ]
        },
        { 
          id: 'dashboard', 
          name: '我的仪表盘', 
          icon: 'icon-dashboard',
          routeName: 'Dashboard'
        },
        { 
          id: 'carbon-account', 
          name: '碳账户', 
          icon: 'icon-account',
          routeName: 'CarbonAccount'
        },
        { 
          id: 'settings', 
          name: '设置', 
          icon: 'icon-settings',
          routeName: 'Settings'
        }
      ]
    }
  },
  computed: {
    // 计算弹出菜单的位置样式
    subMenuStyle() {
      if (!this.activeTabWithChildren) return {};
      
      // 根据当前激活的菜单位置计算弹出菜单的位置
      const baseTop = 80; // 侧边栏头部高度
      const itemHeight = 48; // 每个菜单项的高度
      const index = this.tabs.findIndex(tab => tab.id === this.activeTabWithChildren.id);
      
      return {
        top: `${baseTop + index * itemHeight}px`,
        left: '250px'
      };
    }
  },
  methods: {
    // 处理鼠标进入弹出菜单项
    handleMouseEnter(tab) {
      if (this.collapsed) return;
      
      if (tab.children && tab.children.length > 0) {
        // 清除之前的计时器
        if (this.subMenuTimer) {
          clearTimeout(this.subMenuTimer);
        }
        
        this.activeTabWithChildren = tab;
        this.showSubMenu = true;
      }
    },
    
    // 处理鼠标离开弹出菜单项
    handleMouseLeave() {
      // 设置延迟关闭，避免鼠标移动到弹出菜单时立即关闭
      this.subMenuTimer = setTimeout(() => {
        if (!this.isHoveringSubMenu) {
          this.showSubMenu = false;
          this.activeTabWithChildren = null;
        }
      }, 150);
    },
    
    // 处理鼠标进入弹出菜单
    handleSubMenuEnter() {
      this.isHoveringSubMenu = true;
      // 清除关闭计时器
      if (this.subMenuTimer) {
        clearTimeout(this.subMenuTimer);
      }
    },
    
    // 处理鼠标离开弹出菜单
    handleSubMenuLeave() {
      this.isHoveringSubMenu = false;
      this.subMenuTimer = setTimeout(() => {
        this.showSubMenu = false;
        this.activeTabWithChildren = null;
      }, 150);
    },
    
    // 处理侧边栏标签点击事件,进行路由跳转
    handleTabClick(tab) {
      // 如果有子菜单，不进行跳转，只展开子菜单
      if (tab.children && tab.children.length > 0) {
        // 如果当前路由已经是子菜单中的某个路由，则不跳转
        if (!this.isChildActive(tab.children)) {
          // 跳转到第一个子菜单项
          this.$router.push({ name: tab.children[0].routeName });
        }
        // 显示弹出菜单
        this.activeTabWithChildren = tab;
        this.showSubMenu = true;
      } else {
        // 关闭弹出菜单
        this.showSubMenu = false;
        this.activeTabWithChildren = null;
        
        // 仅在当前路由与目标路由不同时进行跳转
        if (this.$route.name !== tab.routeName) {
          this.$router.push({ name: tab.routeName }); // 使用命名路由进行跳转
        }
      }
    },
    
    // 处理弹出菜单的标签点击事件
    handleSubTabClick(childTab) {
      if (this.$route.name !== childTab.routeName) {
        this.$router.push({ name: childTab.routeName });
      }
      // 点击后关闭弹出菜单
      this.showSubMenu = false;
      this.activeTabWithChildren = null;
    },
    
    // 检查子菜单中是否有激活的项
    isChildActive(children) {
      return children.some(child => this.$route.name === child.routeName);
    }
  },
  
  beforeUnmount() {
    // 组件销毁前清除计时器
    if (this.subMenuTimer) {
      clearTimeout(this.subMenuTimer);
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
  overflow: visible;
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
  position: relative;
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
  position: relative;
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
  flex: 1;
}

.children-indicator {
  font-size: 10px;
  transition: transform 0.3s ease;
  margin-left: auto;
}

/* 弹出式子级侧边栏样式 */
.sub-sidebar {
  position: fixed;
  width: 180px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  animation: slideIn 0.2s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sub-sidebar-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.sub-sidebar-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.sub-nav-list {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.sub-nav-item {
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sub-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sub-nav-item.active {
  background: rgba(0, 198, 255, 0.3);
}

.sub-nav-link {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  gap: 10px;
  font-size: 13px;
}

.sub-nav-text {
  font-size: 13px;
  font-weight: 400;
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

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 图标字体样式 */
.icon-charts:before { content: "🗺️"; }
.icon-dashboard:before { content: "📊"; }
.icon-account:before { content: "👤"; }
.icon-settings:before { content: "⚙️"; }
.icon-earth:before { content: "🌎"; }
.icon-collapse:before { content: "◀"; }
.icon-expand:before { content: "▶"; }
.icon-menu:before { content: "☰"; }
.icon-user:before { content: "👤"; }
.icon-emission:before { content: "🌿"; }
.icon-energy:before { content: "⚡"; }

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
  
  /* 移动端禁用悬停效果 */
  .sub-sidebar {
    display: none;
  }
}
</style>