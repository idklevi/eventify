import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error('Access denied.')
    } else if (status === 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject({ message, status, errors: error.response?.data?.errors })
  }
)

export default api
