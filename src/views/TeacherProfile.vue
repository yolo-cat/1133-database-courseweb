<template>
  <div class="container">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">我的個人資料</h1>
    <form v-if="form" @submit.prevent="submit">
      <label>姓名</label>
      <input v-model.trim="form.name" required maxlength="100" />

      <label>電子郵件</label>
      <input v-model.trim="form.email" type="email" required maxlength="150" />

      <label>年齡</label>
      <input v-model.trim="form.age" type="number" required />

      <div class="actions">
        <button class="btn" type="submit">更新資料</button>
        <router-link class="btn" to="/teacher/dashboard">返回儀表板</router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
    <p v-else-if="error" class="error">{{ error }}</p>
    <p v-else>正在載入資料...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTeacher, updateTeacher } from '@/api/teachers';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

const teacherId = authStore.userId.value;
const form = ref(null);
const error = ref('');
const successMessage = ref('');
const theme = themeStore.theme;
function toggleTheme() {
  themeStore.toggleTheme();
}

onMounted(async () => {
  if (teacherId) {
    try {
      const { data } = await getTeacher(teacherId);
      form.value = { 
        name: data.name, 
        email: data.email, 
        age: data.age 
      };
    } catch (e) {
      error.value = e?.response?.data?.message || '無法載入教師資料。';
    }
  }
});

async function submit() {
  error.value = '';
  successMessage.value = '';
  try {
    await updateTeacher(teacherId, form.value);
    successMessage.value = '個人資料已成功更新！';
  } catch (e) {
    if (e?.response?.data?.fields) {
      const msgs = Object.entries(e.response.data.fields).map(([k, v]) => `${k}: ${v}`);
      error.value = msgs.join(' | ');
    } else {
      error.value = e?.response?.data?.message || '更新失敗。';
    }
  }
}
</script>

<style scoped>
.container {
  background: inherit;
  color: inherit;
  padding: 32px 0;
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

.title {
  margin-bottom: 12px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: 600;
}

input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  padding: 6px 10px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}

.error {
  color: #c33;
}

.success {
  color: #28a745;
}
</style>
