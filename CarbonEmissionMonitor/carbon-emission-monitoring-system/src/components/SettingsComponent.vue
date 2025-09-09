<template>
  <div class="settings-container">
    <h2>系统设置</h2>
    <p>应用程序设置</p>
    
    <div class="theme-switch">
      <span>主题切换:</span>
      <label class="switch">
        <input type="checkbox" v-model="isGreenTheme" @change="toggleTheme">
        <span class="slider round"></span>
      </label>
      <span class="theme-label">{{ isGreenTheme ? '绿色生态' : '低碳环保' }}</span>
    </div>
  </div>
</template>

<script>
import {inject, ref} from 'vue';

export default {
  name: 'SettingsComponent',
  setup() {
    const theme = inject('theme'); // 注入全局主题响应式对象
    
    // 从localStorage直接读取主题状态，确保一致性
    const savedTheme = localStorage.getItem('appTheme');
    const isGreenTheme = ref(savedTheme ? savedTheme === 'green' : true);
    
    // 切换主题
    const toggleTheme = () => {
    const themeName = isGreenTheme.value ? 'green' : 'lowCarbon';
    theme.value = themeName; // 直接修改全局主题状态
    localStorage.setItem('appTheme', themeName);
    };
    
    return {
      isGreenTheme,
      toggleTheme
    };
  }
};
</script>

<style scoped>
.settings-container {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 8px;
}

p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.theme-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #eaeaea;
}

.theme-label {
  font-weight: 500;
  color: #2c3e50;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #42a5f5; /* 低碳主题蓝色 */
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #4caf50; /* 绿色主题颜色 */
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>