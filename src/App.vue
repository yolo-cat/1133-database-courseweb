<template>
  <div id="app">
    <header v-if="isAuthenticated">
      <nav>
        <div class="nav-left">
          <div v-if="isAdmin" class="nav-section">
            <strong>Admin:</strong>
            <router-link to="/students">Students</router-link> |
            <router-link to="/teachers">Teachers</router-link> |
            <router-link to="/courses">Courses</router-link> |
            <router-link to="/enrollments">Enrollments</router-link>
          </div>
          <div v-if="isTeacher" class="nav-section">
            <strong>Teacher:</strong>
            <router-link to="/teacher/dashboard">Dashboard</router-link> |
            <router-link to="/teacher/profile">My Profile</router-link>
          </div>
          <div v-if="isStudent" class="nav-section">
            <strong>Student:</strong>
            <router-link to="/student/dashboard">Dashboard</router-link> |
            <router-link to="/student/courses">Course Catalog</router-link> |
            <router-link to="/student/profile">My Profile</router-link>
          </div>
        </div>
        <div class="nav-right">
          <span>Welcome, {{ userName }} ({{ userRole }})</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth';

const router = useRouter();

const isAuthenticated = authStore.isAuthenticated;
const userRole = authStore.userRole;
const userName = authStore.userName;

const isAdmin = computed(() => userRole.value === 'ADMIN');
const isTeacher = computed(() => userRole.value === 'TEACHER');
const isStudent = computed(() => userRole.value === 'STUDENT');

function handleLogout() {
  authStore.logout();
  router.push({ name: 'user-selector' });
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  font-size: 1.1rem;
}

.nav-left {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #007bff;
}

nav a.router-link-exact-active {
  color: #0056b3;
  font-weight: bold;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
    padding: 6px 10px;
    border: 1px solid #999;
    background: #f7f7f7;
    cursor: pointer;
}

main {
  flex-grow: 1;
  padding: 1rem;
}
</style>
