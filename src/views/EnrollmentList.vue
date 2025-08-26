<template>
  <div class="container">
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

const enrollments = ref([]);
const error = ref('');

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
/* Reusing styles from other list views */
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
