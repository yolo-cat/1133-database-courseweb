<template>
  <div class="container nb-brutal">
    <div class="theme-btn-box">
      <button @click="toggleTheme" class="theme-btn nb-brutal">
        {{ theme === 'light' ? '夜間模式' : '白天模式' }}
      </button>
    </div>
    <h1 class="title">選課紀錄列表</h1>

    <table class="table">
      <thead>
      <tr>
        <th>學生</th>
        <th>課程</th>
        <th>選課日期</th>
        <th>成績</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="enrollment in enrollments" :key="`${enrollment.id.studentId}-${enrollment.id.courseId}`">
        <td>{{ enrollment.student?.firstName }} {{ enrollment.student?.lastName }}</td>
        <td>{{ enrollment.course?.courseName }}</td>
        <td>{{ enrollment.enrollmentDate }}</td>
        <td>{{ enrollment.grade }}</td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchEnrollments } from '@/api/enrollments';
import { themeStore } from '@/stores/theme';

const enrollments = ref([]);
const error = ref('');
const theme = themeStore.theme;
function toggleTheme() {
  themeStore.toggleTheme();
}

async function load() {
  error.value = '';
  try {
    const { data } = await fetchEnrollments();
    enrollments.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

onMounted(load);
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
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.error {
  color: #c33;
}
</style>
