<template>
  <div class="container">
    <h1 class="title">課程列表</h1>

    <div class="toolbar">
      <router-link class="btn" to="/courses/new">+ 新增課程</router-link>
    </div>

    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
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
          <router-link :to="`/courses/${course.courseId}/edit`" class="btn">編輯</router-link>
          <button class="btn danger" @click="remove(course.courseId)">刪除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCourses, deleteCourse } from '@/api/courses';

const courses = ref([]);
const error = ref('');

async function load() {
  error.value = '';
  try {
    const { data } = await fetchCourses();
    courses.value = data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

async function remove(id) {
  if (!confirm('確定要刪除這門課程嗎?')) return;
  try {
    await deleteCourse(id);
    await load();
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  }
}

onMounted(load);
</script>

<style scoped>
/* Styles are copied from StudentList.vue and should be sufficient */
.container {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 12px;
}
.title {
  margin-bottom: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
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
  margin-right: 6px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}
.btn.danger {
  border-color: #c33;
}
.error {
  color: #c33;
}
</style>
