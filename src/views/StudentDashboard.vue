<template>
  <div class="container">
    <h1 class="title">學生儀表板</h1>
    <h2>我選修的課程</h2>

    <table class="table">
      <thead>
      <tr>
        <th>課程ID</th>
        <th>課程名稱</th>
        <th>授課教師</th>
        <th>學分</th>
        <th>成績</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="enrollment in enrollments" :key="enrollment.id.courseId">
        <td>{{ enrollment.course?.courseId }}</td>
        <td>{{ enrollment.course?.courseName }}</td>
        <td>{{ enrollment.course?.teacher?.name }}</td>
        <td>{{ enrollment.course?.credits }}</td>
        <td>{{ enrollment.grade }}</td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchEnrollmentsByStudent } from '@/api/students';
import { authStore } from '@/stores/auth';

// Hardcoded student ID for now. This would come from login state.
const studentId = authStore.userId.value;

const enrollments = ref([]);
const error = ref('');

async function load() {
  error.value = '';
  try {
    const { data } = await fetchEnrollmentsByStudent(studentId);
    enrollments.value = data;
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
.error {
  color: #c33;
}
</style>
