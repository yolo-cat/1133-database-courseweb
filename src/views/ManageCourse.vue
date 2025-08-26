<template>
  <div class="container">
    <h1 class="title">管理課程</h1>
    <h2 v-if="course">{{ course.courseName }}</h2>
    <h3>學生列表與成績</h3>

    <table class="table">
      <thead>
      <tr>
        <th>學生ID</th>
        <th>學生姓名</th>
        <th>選課日期</th>
        <th>成績</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="enrollment in enrollments" :key="enrollment.id.studentId">
        <td>{{ enrollment.student?.studentId }}</td>
        <td>{{ enrollment.student?.firstName }} {{ enrollment.student?.lastName }}</td>
        <td>{{ enrollment.enrollmentDate }}</td>
        <td>
          <input v-model="enrollment.grade" class="grade-input" />
        </td>
        <td>
          <button class="btn" @click="updateGrade(enrollment)">更新成績</button>
        </td>
      </tr>
      </tbody>
    </table>
    <router-link class="btn" to="/teacher/dashboard">返回儀表板</router-link>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCourse } from '@/api/courses';
import { fetchEnrollmentsByCourse } from '@/api/courses';
import { updateEnrollment } from '@/api/enrollments';

const route = useRoute();
const courseId = route.params.id;

const course = ref(null);
const enrollments = ref([]);
const error = ref('');
const successMessage = ref('');

async function load() {
  error.value = '';
  try {
    const { data: courseData } = await getCourse(courseId);
    course.value = courseData;

    const { data: enrollmentData } = await fetchEnrollmentsByCourse(courseId);
    enrollments.value = enrollmentData;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function updateGrade(enrollment) {
  error.value = '';
  successMessage.value = '';
  try {
    await updateEnrollment(enrollment);
    successMessage.value = `已成功更新 ${enrollment.student.firstName} 的成績！`;
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
  margin-bottom: 1rem;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.grade-input {
  width: 100px;
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
