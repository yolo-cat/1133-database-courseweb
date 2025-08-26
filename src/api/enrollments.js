import http from './http'

export function fetchEnrollments() {
    return http.get('/enrollments')
}

export function getEnrollment(id) {
    // Note: The backend controller expects the ID in the request body for GET.
    // This is unconventional. Axios get() can have a data property.
    return http.get('/enrollments/get', { data: id })
}

export function createEnrollment(data) {
    return http.post('/enrollments', data)
}

export function updateEnrollment(data) {
    // The backend controller expects the full enrollment object for update.
    return http.put('/enrollments', data)
}

export function deleteEnrollment(id) {
    // Note: The backend controller expects the ID in the request body for DELETE.
    return http.delete('/enrollments', { data: id })
}
