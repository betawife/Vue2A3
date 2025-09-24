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
            <i class="icon-menu">≡</i>
          </button>
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        
        <!-- 右侧用户头像 -->
        <div class="header-right">
          <div class="user-avatar" @click="handleAvatarClick">
            <img v-if="userInfo.avatar && isLoggedIn" :src="userInfo.avatar" alt="用户头像" class="avatar-img">
            <div v-else class="avatar-placeholder">
              {{ isLoggedIn && userInfo.name ? userInfo.name.charAt(0) : '未' }}
            </div>
            <span class="user-name" v-if="isLoggedIn && userInfo.name">{{ userInfo.name }}</span>
            <span class="user-name" v-else>未登录</span>
          </div>
        </div>
      </header>
      
      <!-- 内容展示区域 -->
      <div class="content-area">
        <div class="component-container">
          <router-view />
        </div>
      </div>
      
      <!-- 用户登录/注册弹窗 -->
      <UserComponent 
        v-if="showUserDialog"
        :visible="showUserDialog"
        @close="showUserDialog = false"
        @login-success="handleLoginSuccess"
        @logout="handleLogout"
        @open-login="showUserDialog = true"
      />
    </main>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue'
import UserComponent from '../components/UserComponent.vue'

export default {
  name: 'HomePage',
  components: {
    SideBar,
    UserComponent
  },
  data() {
    return {
      sidebarCollapsed: false,
      showUserDialog: false,
      isLoggedIn: false,
      userInfo: {
        name: '',
        avatar: '',
        carbonRank: null,
        carbonCalendar: []
      }
    }
  },
  computed: {
    currentPageTitle() {
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
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const storedLoginState = localStorage.getItem('loginState');
      if (storedLoginState) {
        try {
          const loginState = JSON.parse(storedLoginState);
          this.isLoggedIn = loginState.isLoggedIn;
          
          // 如果已登录，加载用户数据
          if (this.isLoggedIn) {
            this.loadUserDataFromLocalStorage();
          } else {
            this.clearUserData();
          }
        } catch (e) {
          console.error('解析登录状态失败:', e);
          this.clearLoginState();
        }
      } else {
        this.clearUserData();
      }
    },
    
    // 清除登录状态
    clearLoginState() {
      this.isLoggedIn = false;
      localStorage.removeItem('loginState');
      this.clearUserData();
    },
    
    // 清除用户数据
    clearUserData() {
      this.userInfo = {
        name: '',
        avatar: '',
        carbonRank: null,
        carbonCalendar: []
      };
    },
    
    // 处理头像点击
    handleAvatarClick() {
      if (this.isLoggedIn) {
        // 登录状态下，通过事件总线触发登出确认
        if (this.$eventBus) {
          this.$eventBus.emit('showLogoutConfirm');
        }
      } else {
        // 未登录状态下，显示登录弹窗
        this.showUserDialog = true;
      }
    },
    
    handleLoginSuccess(userData) {
      this.isLoggedIn = true;
      this.userInfo = { 
        ...this.userInfo, 
        ...userData,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
      };
      this.showUserDialog = false;
    },
    
    handleLogout() {
      this.isLoggedIn = false;
      this.clearUserData();
      this.showUserDialog = false;
    },
    
    // 从localStorage加载用户数据
    loadUserDataFromLocalStorage() {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          this.userInfo = {
            ...this.userInfo,
            ...userData,
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
          };
        } catch (e) {
          console.error('解析本地用户数据失败:', e);
          this.clearUserData();
        }
      }
    },
    
    // 处理事件总线消息
    setupEventBusListeners() {
      if (this.$eventBus) {
        // 监听用户数据更新
        this.$eventBus.on('userDataUpdated', (data) => {
          this.isLoggedIn = data.isLoggedIn || false;
          
          if (this.isLoggedIn && data.userData) {
            this.userInfo = {
              ...this.userInfo,
              ...data.userData,
              avatar: data.userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.userData.name}`
            };
          } else {
            this.clearUserData();
          }
        });
        
        // 监听打开登录弹窗事件
        this.$eventBus.on('openLogin', () => {
          this.showUserDialog = true;
        });
        
        // 监听登出确认显示事件（从CarbonAccount或其他组件触发）
        this.$eventBus.on('showLogoutConfirm', () => {
          // 这里可以添加全局登出确认逻辑，如果需要的话
          console.log('收到登出确认显示请求');
        });
      }
    },
    
    // 清理事件监听
    cleanupEventBusListeners() {
      if (this.$eventBus) {
        this.$eventBus.off('userDataUpdated');
        this.$eventBus.off('openLogin');
        this.$eventBus.off('showLogoutConfirm');
      }
    }
  },
  mounted() {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 设置事件总线监听
    this.setupEventBusListeners();
  },
  
  beforeUnmount() {
    // 清理事件监听
    this.cleanupEventBusListeners();
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

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.user-avatar:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.user-avatar.logged-in {
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border: 1px solid #bae7ff;
}

.user-avatar.logged-in:hover {
  background: linear-gradient(135deg, #e6f7ff 0%, #d0f0ff 100%);
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.user-avatar.logged-in .avatar-placeholder {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.user-avatar.logged-in .user-name {
  color: #1890ff;
  font-weight: 600;
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

/* 登录状态指示器 */
.login-status {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #52c41a;
  border: 2px solid white;
}

.user-avatar:not(.logged-in) .login-status {
  background-color: #f5222d;
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
  
  .user-name {
    display: none;
  }
  
  .user-avatar {
    padding: 4px;
  }
  
  .login-status {
    top: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
  }
}
</style>