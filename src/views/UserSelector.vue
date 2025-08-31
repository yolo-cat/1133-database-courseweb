<template>
  <div class="container nb-brutal" :class="themeClass">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
<!--    <div class="role-selector-stack nb-brutal">-->
<!--      <h2 class="role-title">快速身份選擇</h2>-->
<!--      <div class="role-btn-group">-->
<!--        <button class="role-btn nb-brutal" @click="quickSelectRole('ADMIN')">管理員</button>-->
<!--        <button class="role-btn nb-brutal" @click="quickSelectRole('TEACHER')">教師</button>-->
<!--        <button class="role-btn nb-brutal" @click="quickSelectRole('STUDENT')">學生</button>-->
<!--      </div>-->
<!--      <p v-if="quickRole" class="selected-msg nb-brutal">已選擇身份：{{ roleLabel[quickRole] }}</p>-->
<!--    </div>-->
    <!-- stack在body上方，以下為原本內容 -->
    <div class="center-content">
      <h1 class="title">選擇身份登入</h1>
      <p>請點擊一個帳號以登入系統</p>
      <div v-if="error" class="error nb-brutal">{{ error }}</div>
      <div class="login-section">
        <h2>老師登入區</h2>
        <div v-if="teachers.length > 0" class="user-list">
          <div v-for="user in teachers" :key="user.id" class="user-card" @click="handleLogin(user)">
            <div class="user-name">{{ getLastFirst(user.displayName) }}</div>
            <div class="user-role">{{ user.role }}</div>
            <div class="user-username">({{ user.username }})</div>
          </div>
        </div>
        <p v-else>沒有老師資料</p>
      </div>
      <div class="login-section">
        <h2>學生登入區</h2>
        <div v-if="students.length > 0" class="user-list">
          <div v-for="user in students" :key="user.id" class="user-card" @click="handleLogin(user)">
            <div class="user-name">{{ getLastFirst(user.displayName) }}</div>
            <div class="user-role">{{ user.role }}</div>
            <div class="user-username">({{ user.username }})</div>
          </div>
        </div>
        <p v-else>沒有學生資料</p>
      </div>
      <p v-if="loading && !error">正在載入使用者列表...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsers, loginAsId } from '@/api/users';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

const router = useRouter();
const allUsers = ref([]);
const error = ref('');
const loading = ref(true);
const quickRole = ref(null);

const teachers = computed(() => allUsers.value.filter(u => u.role === 'TEACHER'));
const students = computed(() => allUsers.value.filter(u => u.role === 'STUDENT'));
const roleLabel = {
  ADMIN: '管理員',
  TEACHER: '教師',
  STUDENT: '學生'
};

const theme = themeStore.theme;
const themeClass = themeStore.themeClass;
function toggleTheme() {
  themeStore.toggleTheme();
}

async function loadUsers() {
  loading.value = true;
  try {
    const { data } = await fetchAllUsers();
    console.log('API users data:', data); // 調試用，觀察資料結構
    allUsers.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || '無法載入使用者列表。';
  } finally {
    loading.value = false;
  }
}

async function handleLogin(user) {
  error.value = '';
  try {
    const { data } = await loginAsId(user.id, user.role);
    authStore.setToken(data.jwt);
    
    const role = authStore.userRole.value;
    if (role === 'ADMIN') {
      router.push('/students');
    } else if (role === 'TEACHER') {
      router.push('/teacher/dashboard');
    } else if (role === 'STUDENT') {
      router.push('/student/dashboard');
    } else {
      router.push('/');
    }
  } catch (e) {
    error.value = e?.response?.data?.message || '模擬登入失敗。';
  }
}

// function quickSelectRole(role) {
//   quickRole.value = role;
//   if (role === 'ADMIN') {
//     // 管理員顯示全部
//     loadUsers();
//   } else if (role === 'TEACHER') {
//     // 只顯示教師名單
//     allUsers.value = teachers.value;
//   } else if (role === 'STUDENT') {
//     // 只顯示學生名單
//     allUsers.value = students.value;
//   } else {
//     allUsers.value = [];
//   }
// }

function getLastFirst(displayName) {
  if (!displayName) return '';
  const parts = displayName.trim().split(' ');
  if (parts.length === 2) {
    return `${parts[1]} ${parts[0]}`;
  }
  return displayName;
}

onMounted(loadUsers);
</script>

<style scoped>
.container {
  background: inherit;
  color: inherit;
  padding: 32px 0; /* 左右不留白 */
  border-radius: 12px;
  box-shadow: 4px 4px 0 #000;
  min-height: 80vh;
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.theme-btn-box {
  position: absolute;
  top: 16px;
  right: 16px;
  left: auto;
  z-index: 10;
  width: auto;
  max-width: none;
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 900px) {
  .theme-btn-box {
    position: static;
    width: 100%;
    justify-content: center;
    margin-bottom: 12px;
    top: auto;
    right: auto;
  }
  .container {
    padding-top: 56px;
  }
}
.role-selector-stack {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 40px auto;
  padding: 24px 0 16px 0;
  border: 3px solid #000;
  border-radius: 16px;
  background: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 6px 6px 0 #000, 0 4px 12px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.role-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: inherit;
  text-align: center;
}
.role-btn-group {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 8px;
}
.role-btn {
  min-width: 120px;
  padding: 16px 0;
  font-size: 1.1rem;
  font-weight: bold;
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.role-btn:hover {
  background: #fff;
  color: #181818;
}
.selected-msg {
  text-align: center;
  font-size: 1rem;
  margin-top: 12px;
  font-weight: bold;
}
.center-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: inherit;
  text-align: center;
}
.login-section {
  margin-top: 32px;
  width: 100%;
}
.login-section h2 {
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 16px;
  text-align: center;
}
.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center; /* 置中 */
}
.user-card {
  border: 3px solid var(--color-border);
  border-radius: 12px;
  padding: 20px 16px;
  width: 220px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.77,0,.175,1);
  text-align: center;
  background: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 6px 6px 0 #000, 0 4px 12px rgba(0,0,0,0.10);
  position: relative;
  font-family: 'IBM Plex Sans', 'Arial', sans-serif;
}
.user-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 12px 12px 0 #000, 0 8px 24px rgba(0,0,0,0.18);
  background: var(--color-background);
  border-color: var(--color-nav-link-active);
  z-index: 2;
}
.user-card:active {
  box-shadow: 2px 2px 0 #000;
  transform: scale(0.98);
}
.user-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.user-role {
  font-style: italic;
  color: var(--color-nav-link);
  margin: 8px 0;
  font-weight: 600;
}
.user-username {
  font-family: monospace;
  color: var(--color-nav-link-active);
  font-size: 0.95rem;
  background: var(--color-background-mute);
  border-radius: 6px;
  padding: 2px 8px;
  box-shadow: 2px 2px 0 #000;
  display: inline-block;
}
.error {
  color: #fff;
  background: #c00;
  padding: 8px 16px;
  margin-top: 24px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  text-align: center;
}
.theme-btn {
  padding: 8px 20px;
  font-weight: bold;
  background: inherit;
  color: inherit;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  cursor: pointer;
}
.theme-btn:hover {
  background: #fff;
  color: #181818;
}
</style>