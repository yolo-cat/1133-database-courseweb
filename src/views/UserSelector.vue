<template>
  <div class="container">
    <h1 class="title">選擇身份登入</h1>
    <p>請點擊一個帳號以登入系統</p>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="login-section">
      <h2>老師登入區</h2>
      <div v-if="teachers.length > 0" class="user-list">
        <div v-for="user in teachers" :key="user.id" class="user-card" @click="handleLogin(user)">
          <div class="user-name">{{ user.displayName }}</div>
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
          <div class="user-name">{{ user.displayName }}</div>
          <div class="user-role">{{ user.role }}</div>
          <div class="user-username">({{ user.username }})</div>
        </div>
      </div>
      <p v-else>沒有學生資料</p>
    </div>

    <p v-if="loading && !error">正在載入使用者列表...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsers, loginAsId } from '@/api/users';
import { authStore } from '@/stores/auth';

const router = useRouter();
const allUsers = ref([]);
const error = ref('');
const loading = ref(true);

const teachers = computed(() => allUsers.value.filter(u => u.role === 'TEACHER' || u.role === 'ADMIN'));
const students = computed(() => allUsers.value.filter(u => u.role === 'STUDENT'));

async function loadUsers() {
  loading.value = true;
  try {
    const { data } = await fetchAllUsers();
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

onMounted(loadUsers);
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 12px;
}
.title {
  text-align: center;
  margin-bottom: 12px;
}
.login-section {
  margin-top: 32px;
}
.login-section h2 {
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 16px;
}
.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.user-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 220px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;
}
.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.user-name {
  font-size: 1.2rem;
  font-weight: 600;
}
.user-role {
  font-style: italic;
  color: #555;
  margin: 8px 0;
}
.user-username {
  font-family: monospace;
  color: #777;
}
.error {
  color: #c33;
  text-align: center;
  margin-top: 1rem;
}
</style>