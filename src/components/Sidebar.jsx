import { NavLink } from 'react-router-dom'
import { BarChart3, Boxes, Building2, ClipboardList, LayoutDashboard, Package, ShoppingCart, Truck, Users, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { hasRoleAccess } from '../permissions'

const items = [
  { to: '/dashboard', label: 'Overview', area: 'dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', area: 'products', icon: Package },
  { to: '/warehouses', label: 'Warehouses', area: 'warehouses', icon: Building2 },
  { to: '/inventory', label: 'Inventory', area: 'inventory', icon: Boxes },
  { to: '/suppliers', label: 'Suppliers', area: 'suppliers', icon: Truck },
  { to: '/orders', label: 'Orders', area: 'orders', icon: ShoppingCart },
  { to: '/purchases', label: 'Purchases', area: 'purchases', icon: ClipboardList },
  { to: '/reports', label: 'Reports', area: 'reports', icon: BarChart3 },
  { to: '/users', label: 'Users', area: 'users', icon: Users },
]
export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="brand"><span className="brand-mark">N</span><span>Northstar <small>Retail OS</small></span><button className="icon-btn mobile-only" onClick={onClose}><X size={18} /></button></div><div className="workspace"><span className="workspace-dot" /> Operations workspace <span className="chevron">⌄</span></div><nav>{items.filter(({ area }) => hasRoleAccess(user?.role, area)).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={18} /><span>{label}</span>{label === 'Orders' && <b className="nav-count">6</b>}</NavLink>)}</nav><div className="sidebar-footer"><div className="help-badge">?</div><div><strong>Need a hand?</strong><small>Visit the help center</small></div></div></aside>
}
