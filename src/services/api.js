import axios from 'axios'

const TOKEN_KEY = 'retail_token'

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
    }
    return Promise.reject(error)
  }
)

export const api = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  me: () => apiClient.get('/auth/me'),
  getProducts: (params) => apiClient.get('/products', { params: { limit: 1000, ...params } }),
  createProduct: (data) => apiClient.post('/products', data),
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
  getCategories: () => apiClient.get('/products/categories'),
  createCategory: (data) => apiClient.post('/products/categories', data),
  getWarehouses: () => apiClient.get('/warehouses'),
  createWarehouse: (data) => apiClient.post('/warehouses', data),
  getInventory: () => apiClient.get('/inventory'),
  adjustInventory: (data) => apiClient.post('/inventory/adjust', data),
  transferInventory: (data) => apiClient.post('/inventory/transfer', data),
  getSuppliers: () => apiClient.get('/suppliers'),
  createSupplier: (data) => apiClient.post('/suppliers', data),
  getOrders: () => apiClient.get('/orders'),
  updateOrderStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }),
  getPurchases: () => apiClient.get('/purchases'),
  createPurchase: (data) => apiClient.post('/purchases', data),
  receivePurchase: (id) => apiClient.post(`/purchases/${id}/receive`),
  getReports: () => apiClient.get('/reports'),
  getUsers: () => apiClient.get('/users'),
  createUser: (data) => apiClient.post('/users', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deactivateUser: (id) => apiClient.delete(`/users/${id}`),
}
