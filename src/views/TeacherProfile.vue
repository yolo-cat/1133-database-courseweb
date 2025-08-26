<template>
  <div class="container">
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

const teacherId = authStore.userId.value;
const form = ref(null);
const error = ref('');
const successMessage = ref('');

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
/* Reusing styles from StudentProfile.vue */
.container {
  max-width: 640px;
  margin: 24px auto;
  padding: 0 12px;
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
