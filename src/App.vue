<template>
  <div id="app" :class="themeClass">

    <header v-if="isAuthenticated">
      <nav class="nb-brutal">
        <div class="nav-left">
          <div v-if="isAdmin" class="nav-section">
            <strong>Admin:</strong>
            <router-link to="/students">Students</router-link> |
            <router-link to="/teachers">Teachers</router-link> |
            <router-link to="/courses">Courses</router-link> |
            <router-link to="/enrollments">Enrollments</router-link> |
<!--            <router-link to="/user-jump">用戶名稱跳轉</router-link>-->
          </div>
          <div v-if="isTeacher" class="nav-section">
            <strong>Teacher:</strong>
            <router-link to="/teacher/dashboard">Dashboard</router-link> |
            <router-link to="/teacher/profile">My Profile</router-link> |
<!--            <router-link to="/user-jump">用戶名稱跳轉</router-link>-->
          </div>
          <div v-if="isStudent" class="nav-section">
            <strong>Student:</strong>
            <router-link to="/student/dashboard">Dashboard</router-link> |
            <router-link to="/student/courses">Course Catalog</router-link> |
            <router-link to="/student/profile">My Profile</router-link> |
<!--            <router-link to="/user-jump">用戶名稱跳轉</router-link>-->
          </div>
          <span class="nav-actions">
            Welcome, {{ userName }} ({{ userRole }})
            <button @click="handleLogout" class="logout-btn nb-brutal">Logout</button>
          </span>
        </div>
      </nav>
    </header>
    <main>
      <router-view />
      <!-- 移除 Sidebar 與漢堡選單 -->
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth';
import { themeStore } from '@/stores/theme';

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

const theme = themeStore.theme;
const themeClass = themeStore.themeClass;
function toggleTheme() {
  themeStore.toggleTheme();
}

const sidebarOpen = ref(false);
const showHamburger = ref(false);
function openSidebar() { sidebarOpen.value = true; }
function closeSidebar() { sidebarOpen.value = false; }

function handleResize() {
  showHamburger.value = window.innerWidth < 800;
  if (window.innerWidth >= 800) sidebarOpen.value = true;
  else sidebarOpen.value = false;
}
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  align-items: stretch;
  justify-content: flex-start;
}

header, main {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

header {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem;
  position: relative;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  font-size: 1.1rem;
  background: var(--color-nav-bg);
  color: var(--color-text);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 0.5rem 1rem;
}

.nav-left {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

nav a {
  text-decoration: none;
  color: var(--color-nav-link);
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

nav a.router-link-exact-active {
  color: var(--color-nav-link-active);
  background: rgba(0,0,0,0.07);
  font-weight: bold;
}

nav a:focus, nav a:hover {
  background: rgba(0,0,0,0.10);
  color: var(--color-nav-link-active);
  outline: none;
}

.logout-btn {
    padding: 6px 10px;
    border: 1px solid #999;
    background: #f7f7f7;
    cursor: pointer;
}

.theme-btn {
  margin-left: 12px;
  padding: 6px 16px;
  font-weight: bold;
}

.nb-sidebar ul {
  list-style: none;
  padding: 0;
}

.nb-sidebar li {
  margin: 16px 0;
}

main {
  flex-grow: 1;
  padding: 1rem;
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .nav-left, .nav-right {
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .nav-right {
    justify-content: center;
  }
}
</style>
