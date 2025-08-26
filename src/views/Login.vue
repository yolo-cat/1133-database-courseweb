<template>
  <div class="container">
    <h1 class="title">開發者登入</h1>
    <p>請點擊一個使用者以模擬登入</p>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="users.length > 0" class="user-list">
      <div v-for="user in users" :key="user.username" class="user-card" @click="handleLoginAs(user.username)">
        <div class="user-name">{{ user.displayName }}</div>
        <div class="user-role">{{ user.role }}</div>
        <div class="user-username">({{ user.username }})</div>
      </div>
    </div>
    <p v-else-if="!error">正在載入使用者列表...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsers, loginAs } from '@/api/users';
import { authStore } from '@/stores/auth';

const router = useRouter();
const users = ref([]);
const error = ref('');

async function loadUsers() {
  try {
    const { data } = await fetchAllUsers();
    users.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || '無法載入使用者列表。';
  }
}

async function handleLoginAs(username) {
  error.value = '';
  try {
    const { data } = await loginAs(username);
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
  max-width: 800px;
  margin: 24px auto;
  padding: 0 12px;
  text-align: center;
}
.title {
  margin-bottom: 12px;
}
.user-list {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
.user-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 200px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
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
  margin-top: 1rem;
}
</style>