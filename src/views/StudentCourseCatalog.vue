<template>
  <div class="container">
    <h1 class="title">課程目錄</h1>
    <h2>所有可選課程</h2>

    <table class="table">
      <thead>
      <tr>
        <th>課程ID</th>
        <th>課程名稱</th>
        <th>描述</th>
        <th>學分</th>
        <th>授課教師</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="course in courses" :key="course.courseId">
        <td>{{ course.courseId }}</td>
        <td>{{ course.courseName }}</td>
        <td>{{ course.courseDescription }}</td>
        <td>{{ course.credits }}</td>
        <td>{{ course.teacher?.name }}</td>
        <td>
          <button class="btn" @click="enroll(course.courseId)">選課</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCourses } from '@/api/courses';
import { createEnrollment } from '@/api/enrollments';
import { authStore } from '@/stores/auth';

// Hardcoded student ID for now. This would come from login state.
const studentId = authStore.userId.value;

const courses = ref([]);
const error = ref('');
const successMessage = ref('');

async function load() {
  error.value = '';
  try {
    const { data } = await fetchCourses();
    courses.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function enroll(courseId) {
  error.value = '';
  successMessage.value = '';

  if (!confirm(`確定要選修這門課 (ID: ${courseId}) 嗎?`)) return;

  const enrollmentData = {
    id: {
      studentId: studentId,
      courseId: courseId
    },
    // The backend will handle setting the student and course objects
    enrollmentDate: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  };

  try {
    await createEnrollment(enrollmentData);
    successMessage.value = `成功選修課程 (ID: ${courseId})!`;
  } catch (e) {
    error.value = e?.response?.data?.message || '選課失敗，您可能已經選修過此課程。';
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
.success {
  color: #28a745;
}
</style>
