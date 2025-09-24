<template>
  <div class="user-component">
    <div v-if="visible">
    <!-- 遮罩层 -->
    <div class="modal-mask" @click="handleClose"></div>
    
    <!-- 弹窗内容 -->
    <div class="user-modal">
      <div class="modal-header">
        <h2>{{ isLogin ? '用户登录' : '用户注册' }}</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div class="modal-body">
        <!-- 登录/注册表单 -->
        <form @submit.prevent="handleSubmit" class="user-form">
          <div class="form-group" v-if="!isLogin">
            <label for="age">年龄</label>
            <input 
              id="age"
              type="number" 
              v-model="formData.age"
              placeholder="请输入年龄"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              id="username"
              type="text" 
              v-model="formData.name"
              :placeholder="isLogin ? '请输入用户名' : '请输入用户名'"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              id="password"
              type="password" 
              v-model="formData.password"
              placeholder="请输入密码"
              required
            >
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
          </button>
        </form>
        
        <!-- 切换登录/注册 -->
        <div class="switch-mode">
          <span>{{ isLogin ? '没有账号？' : '已有账号？' }}</span>
          <button type="button" class="switch-btn" @click="isLogin = !isLogin">
            {{ isLogin ? '立即注册' : '立即登录' }}
          </button>
        </div>
        
        <!-- 消息提示 -->
        <div v-if="message.text" :class="['message', message.type]">
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>

  <!-- 登出确认弹窗 -->
  <div class="logout-modal" v-if="showLogoutConfirm">
    <div class="modal-mask" @click="showLogoutConfirm = false"></div>
    <div class="logout-confirm">
      <div class="confirm-header">
        <h3>确认登出</h3>
        <button class="close-btn" @click="showLogoutConfirm = false">×</button>
      </div>
      <div class="confirm-body">
        <p>确定要退出登录吗？</p>
        <div class="confirm-buttons">
          <button class="cancel-btn" @click="showLogoutConfirm = false">取消</button>
          <button class="logout-btn" @click="handleLogout">确认登出</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, watch, inject, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'UserComponent',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const eventBus = inject('eventBus');
    const isLogin = ref(true);
    const loading = ref(false);
    const showLogoutConfirm = ref(false);
    
    // 登录状态
    const loginState = ref({
      isLoggedIn: false,
      username: '',
      token: ''
    });
    
    const formData = ref({
      name: '',
      password: '',
      age: ''
    });
    
    const message = ref({
      text: '',
      type: 'success'
    });

    // 用户数据
    const userData = ref({
      name: '',
      carbonRank: null,
      carbonCalendar: []
    });

    // 排名列表数据
    const rankList = ref([]);

    // 检查登录状态
    const checkLoginStatus = () => {
      const storedLoginState = localStorage.getItem('loginState');
      if (storedLoginState) {
        try {
          loginState.value = JSON.parse(storedLoginState);
        } catch (e) {
          console.error('解析登录状态失败:', e);
          clearLoginState();
        }
      }
    };

    // 保存登录状态
    const saveLoginState = (username, token = '') => {
      loginState.value = {
        isLoggedIn: true,
        username,
        token
      };
      localStorage.setItem('loginState', JSON.stringify(loginState.value));
    };

    // 清除登录状态
    const clearLoginState = () => {
      loginState.value = {
        isLoggedIn: false,
        username: '',
        token: ''
      };
      localStorage.removeItem('loginState');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rankList');
    };

    // 处理头像点击
    const handleAvatarClick = () => {
      if (loginState.value.isLoggedIn) {
        showLogoutConfirm.value = true;
      } else {
        emit('open-login');
      }
    };

    const handleClose = () => {
      emit('close');
    };
    
    const clearMessage = () => {
      message.value.text = '';
    };
    
    const showMessage = (text, type = 'success') => {
      message.value.text = text;
      message.value.type = type;
      setTimeout(() => {
        clearMessage();
      }, 3000);
    };
    
    // API基础URL
    const API_BASE = 'http://localhost:9090';
    
    // 用户登录API
    const loginUser = async (username, password) => {
      try {
        const response = await axios.get(`${API_BASE}/user/login`, {
          params: { name: username, password }
        });
        return { success: true, data: response.data };
      } catch (error) {
        console.error('登录失败:', error);
        return { success: false, error };
      }
    };
    
    // 用户注册API
    const registerUser = async (userData) => {
      try {
        const response = await axios.post(`${API_BASE}/user/register`, 
          new URLSearchParams({
            user: userData.name,
            password: userData.password,
            age: userData.age
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        return { success: true, data: response.data };
      } catch (error) {
        console.error('注册失败:', error);
        return { success: false, error };
      }
    };
    
    // 获取用户数据API
    const fetchUserData = async (username) => {
      try {
        const response = await axios.get(`${API_BASE}/user/list`, {
          params: { user: username }
        });
        
        if (response.data && response.data.length > 0) {
          const apiData = response.data[0];
          return {
            success: true,
            data: {
              name: apiData.name || username,
              carbonRank: apiData.carbonRank || 0,
              carbonCalendar: apiData.carbonCalendar || []
            }
          };
        } else {
          return { success: false, error: new Error('用户数据不存在') };
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
        return { success: false, error };
      }
    };
    
    // 获取排名列表API
    const fetchRankList = async () => {
      try {
        const response = await axios.get(`${API_BASE}/rank/list`);
        
        if (response.data && response.data.length > 0) {
          return { success: true, data: response.data };
        } else {
          return { success: false, error: new Error('排名数据不存在') };
        }
      } catch (error) {
        console.error('获取排名列表失败:', error);
        return { success: false, error };
      }
    };
    
    // 发送用户数据到API
    const sendUserData = async (userData) => {
      try {
        const response = await axios.post(`${API_BASE}/user/update`, userData);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('发送用户数据失败:', error);
        return { success: false, error };
      }
    };
    
    // 发送排名数据到API
    const sendRankData = async (rankData) => {
      try {
        const response = await axios.post(`${API_BASE}/rank/update`, rankData);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('发送排名数据失败:', error);
        return { success: false, error };
      }
    };

    // 处理表单提交
    const handleSubmit = async () => {
      loading.value = true;
      clearMessage();
      
      try {
        let apiResult;
        
        if (isLogin.value) {
          // 登录逻辑
          apiResult = await loginUser(formData.value.name, formData.value.password);
        } else {
          // 注册逻辑
          apiResult = await registerUser(formData.value);
        }
        
        let userDataResult;
        let rankListResult;
        
        if (apiResult.success) {
          // API请求成功，获取真实数据
          userDataResult = await fetchUserData(formData.value.name);
          rankListResult = await fetchRankList();
          
          if (userDataResult.success && rankListResult.success) {
            // 保存登录状态
            saveLoginState(formData.value.name);
          } else {
            throw new Error('数据获取失败');
          }
        } else {
          // API请求失败，不显示数据
          throw new Error('API请求失败');
        }
        
        if (userDataResult.success && rankListResult.success) {
          userData.value = userDataResult.data;
          rankList.value = rankListResult.data;
          
          // 保存到localStorage
          localStorage.setItem('currentUser', JSON.stringify(userData.value));
          localStorage.setItem('rankList', JSON.stringify(rankList.value));
          
          // 发送用户数据到CarbonAccount组件
          if (eventBus) {
            eventBus.emit('userDataUpdated', {
              userData: userData.value,
              rankList: rankList.value,
              isLoggedIn: true
            });
          }
          
          showMessage(isLogin.value ? '登录成功！' : '注册成功！');
          
          // 延迟关闭弹窗
          setTimeout(() => {
            emit('login-success', userData.value);
            handleClose();
          }, 1000);
        } else {
          throw new Error('数据获取失败');
        }
        
      } catch (error) {
        console.error('处理失败:', error);
        // 登录/注册失败时，清除可能存在的登录状态
        clearLoginState();
        
        // 发送空数据到CarbonAccount组件
        if (eventBus) {
          eventBus.emit('userDataUpdated', {
            userData: { name: '', carbonRank: null, carbonCalendar: [] },
            rankList: [],
            isLoggedIn: false
          });
        }
        
        showMessage(isLogin.value ? '登录失败，请重试' : '注册失败，请重试', 'error');
      } finally {
        loading.value = false;
      }
    };

    // 处理登出
    const handleLogout = () => {
      clearLoginState();
      showLogoutConfirm.value = false;
      
      // 发送空数据到CarbonAccount组件
      if (eventBus) {
        eventBus.emit('userDataUpdated', {
          userData: { name: '', carbonRank: null, carbonCalendar: [] },
          rankList: [],
          isLoggedIn: false
        });
      }
      
      showMessage('已成功登出', 'success');
      emit('logout');
    };

    // 监听CarbonAccount组件发送的碳数据更新
    if (eventBus) {
      eventBus.on('carbonDataUpdated', async (carbonData) => {
        // 只有在登录状态下才处理数据更新
        if (!loginState.value.isLoggedIn) {
          return;
        }
        
        console.log('收到碳数据更新:', carbonData);
        
        // 更新用户数据
        if (carbonData.carbonRank !== undefined) {
          userData.value.carbonRank = carbonData.carbonRank;
        }
        if (carbonData.carbonCalendar) {
          userData.value.carbonCalendar = carbonData.carbonCalendar;
        }
        
        // 更新排名列表
        if (carbonData.rankList) {
          rankList.value = carbonData.rankList;
        }
        
        // 保存到localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData.value));
        localStorage.setItem('rankList', JSON.stringify(rankList.value));
        
        // 发送更新后的数据到API
        const userResult = await sendUserData(userData.value);
        const rankResult = await sendRankData(rankList.value);
        
        if (userResult.success && rankResult.success) {
          console.log('数据同步到API成功');
        } else {
          console.log('数据同步到API失败，已保存到本地');
        }
      });
    }

    // 监听visible变化，重置表单
    watch(() => props.visible, (newVal) => {
      if (newVal) {
        formData.value = { name: '', password: '', age: '' };
        loading.value = false;
        clearMessage();
      }
    });

    // 组件挂载时检查登录状态
    onMounted(() => {
      checkLoginStatus();
    });

    return {
      isLogin,
      loading,
      formData,
      message,
      showLogoutConfirm,
      loginState,
      handleClose,
      handleSubmit,
      handleAvatarClick,
      handleLogout
    };
  }
};
</script>

<style scoped>
.user-component {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.user-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.user-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.switch-mode {
  text-align: center;
  color: #666;
}

.switch-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
}

.message {
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  text-align: center;
}

.message.success {
  background: #f0f9ff;
  color: #0369a1;
}

.message.error {
  background: #fef2f2;
  color: #dc2626;
}

/* 登出确认弹窗样式 */
.logout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
}

.logout-confirm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: #f8f9fa;
}

.confirm-header h3 {
  margin: 0;
  color: #333;
}

.confirm-body {
  padding: 24px;
  text-align: center;
}

.confirm-body p {
  margin: 0 0 20px 0;
  color: #666;
}

.confirm-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cancel-btn, .logout-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.logout-btn {
  background: #dc3545;
  color: white;
}

.logout-btn:hover {
  background: #c82333;
}
</style>