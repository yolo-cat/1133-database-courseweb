<template>
  <div class="container">
    <h1 class="title">教師儀表板</h1>
    <h2>我的課程</h2>

    <table class="table">
      <thead>
      <tr>
        <th>課程ID</th>
        <th>課程名稱</th>
        <th>描述</th>
        <th>學分</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="course in courses" :key="course.courseId">
        <td>{{ course.courseId }}</td>
        <td>{{ course.courseName }}</td>
        <td>{{ course.courseDescription }}</td>
        <td>{{ course.credits }}</td>
        <td>
          <router-link :to="`/teacher/course/${course.courseId}/manage`" class="btn">管理學生與成績</router-link>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCoursesByTeacher } from '@/api/teachers';
import { authStore } from '@/stores/auth';

// Hardcoded teacher ID for now. This would come from login state.
const teacherId = authStore.userId.value;

const courses = ref([]);
const error = ref('');

async function load() {
  error.value = '';
  try {
    const { data } = await fetchCoursesByTeacher(teacherId);
    courses.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

onMounted(load);
</script>

<style scoped>
/* Reusing styles */
.container {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 12px;
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
.btn {
  padding: 6px 10px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
}
.error {
  color: #c33;
}
</style>
