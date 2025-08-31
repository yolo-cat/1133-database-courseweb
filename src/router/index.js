import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '@/stores/auth';
import TeacherList from "@/views/TeacherList.vue";
import TeacherForm from "@/views/TeacherForm.vue";
import StudentList from '@/views/StudentList.vue'
import StudentForm from '@/views/StudentForm.vue'
import CourseList from '@/views/CourseList.vue'
import CourseForm from '@/views/CourseForm.vue'
import EnrollmentList from '@/views/EnrollmentList.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import ManageCourse from '@/views/ManageCourse.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import StudentCourseCatalog from '@/views/StudentCourseCatalog.vue'
import UserSelector from '@/views/UserSelector.vue'
import StudentProfile from '@/views/StudentProfile.vue'
import TeacherProfile from '@/views/TeacherProfile.vue'
import UserJump from '@/views/UserJump.vue'

const routes = [
    { path: '/', name: 'user-selector', component: UserSelector },
    { path: '/user-jump', name: 'user-jump', component: UserJump },

    // Admin Routes
    { path: '/teachers', name: 'teachers', component: TeacherList, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/teachers/new', name: 'teachers-new', component: TeacherForm, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/teachers/:id/edit', name: 'teachers-edit', component: TeacherForm, props: true, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/students', name: 'students', component: StudentList, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/students/new', name: 'students-new', component: StudentForm, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/students/:id/edit', name: 'students-edit', component: StudentForm, props: true, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/courses', name: 'courses', component: CourseList, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/courses/new', name: 'courses-new', component: CourseForm, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/courses/:id/edit', name: 'courses-edit', component: CourseForm, props: true, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/enrollments', name: 'enrollments', component: EnrollmentList, meta: { requiresAuth: true, role: 'ADMIN' } },

    // Role: Teacher
    { path: '/teacher/dashboard', name: 'teacher-dashboard', component: TeacherDashboard, meta: { requiresAuth: true, role: 'TEACHER' } },
    { path: '/teacher/course/:id/manage', name: 'teacher-manage-course', component: ManageCourse, props: true, meta: { requiresAuth: true, role: 'TEACHER' } },
    { path: '/teacher/profile', name: 'teacher-profile', component: TeacherProfile, meta: { requiresAuth: true, role: 'TEACHER' } },

    // Role: Student
    { path: '/student/dashboard', name: 'student-dashboard', component: StudentDashboard, meta: { requiresAuth: true, role: 'STUDENT' } },
    { path: '/student/courses', name: 'student-course-catalog', component: StudentCourseCatalog, meta: { requiresAuth: true, role: 'STUDENT' } },
    { path: '/student/profile', name: 'student-profile', component: StudentProfile, meta: { requiresAuth: true, role: 'STUDENT' } },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = authStore.isAuthenticated.value;
    const requiredRole = to.meta.role;
    const userRole = authStore.userRole.value;

    if (to.meta.requiresAuth) {
        if (!isAuthenticated) {
            next({ name: 'user-selector' });
        } else if (requiredRole && requiredRole !== userRole) {
            alert(`You do not have access to this page. Required role: ${requiredRole}`);
            next(from.path);
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
