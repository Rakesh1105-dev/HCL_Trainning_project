import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'
import { DemoProvider } from './context/DemoContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Products from './pages/products/ProductList'
import ProductForm from './pages/products/AddProduct'
import Warehouses from './pages/warehouses/WarehouseList'
import AddWarehouse from './pages/warehouses/AddWarehouse'
import Inventory from './pages/inventory/InventoryList'
import Suppliers from './pages/suppliers/SupplierList'
import AddSupplier from './pages/suppliers/AddSupplier'
import Orders from './pages/orders/OrderList'
import OrderDetails from './pages/orders/OrderDetails'
import Purchases from './pages/purchases/PurchaseList'
import CreatePurchase from './pages/purchases/CreatePurchase'
import Reports from './pages/reports/Reports'
import Users from './pages/users/UserList'
import { canManage, hasRoleAccess } from './permissions'

function ProtectedLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  if (!user) return <Navigate to="/login" replace />
  const area = Object.entries({ dashboard: '/dashboard', products: '/products', warehouses: '/warehouses', inventory: '/inventory', suppliers: '/suppliers', orders: '/orders', purchases: '/purchases', reports: '/reports', users: '/users' }).find(([, path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[0]
  const manageArea = location.pathname.startsWith('/products/add') || location.pathname.startsWith('/products/edit/') ? 'products' : location.pathname.startsWith('/warehouses/add') ? 'admin-warehouses' : location.pathname.startsWith('/suppliers/add') ? 'suppliers' : location.pathname.startsWith('/purchases/create') ? 'purchases' : location.pathname.startsWith('/inventory/transfer') || location.pathname.startsWith('/inventory/adjustment') ? 'inventory' : null
  if (area && !hasRoleAccess(user.role, area)) return <Navigate to="/dashboard" replace />
  if (manageArea && (manageArea === 'admin-warehouses' ? user.role !== 'ADMIN' : !canManage(user.role, manageArea))) return <Navigate to="/dashboard" replace />
  return <div className="app-shell"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="main-shell"><Navbar onMenu={() => setMenuOpen(true)} /><main className="content"><Outlet /></main></div>{menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}</div>
}

export default function App() {
  return <DemoProvider><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedLayout />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/products" element={<Products />} /><Route path="/products/add" element={<ProductForm />} /><Route path="/products/edit/:id" element={<ProductForm />} /><Route path="/warehouses" element={<Warehouses />} /><Route path="/warehouses/add" element={<AddWarehouse />} /><Route path="/inventory" element={<Inventory />} /><Route path="/inventory/transfer" element={<Inventory />} /><Route path="/inventory/adjustment" element={<Inventory />} /><Route path="/suppliers" element={<Suppliers />} /><Route path="/suppliers/add" element={<AddSupplier />} /><Route path="/orders" element={<Orders />} /><Route path="/orders/:id" element={<OrderDetails />} /><Route path="/purchases" element={<Purchases />} /><Route path="/purchases/create" element={<CreatePurchase />} /><Route path="/reports" element={<Reports />} /><Route path="/users" element={<Users />} /></Route><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></DemoProvider>
}
