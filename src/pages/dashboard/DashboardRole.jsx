import { useAuth } from '../../context/AuthContext'
import { useDemo } from '../../context/DemoContext'
import { AlertTriangle, Boxes, Building2, ClipboardList, Package, ShoppingCart, Truck } from 'lucide-react'

const statIcons = {
  Products: Package,
  'Inventory units': Boxes,
  'Available units': Boxes,
  Orders: ShoppingCart,
  'Pending orders': ShoppingCart,
  Suppliers: Truck,
  Warehouses: Building2,
  'Low-stock products': AlertTriangle,
  'Low-stock items': AlertTriangle,
  'Purchase orders': ClipboardList,
  'Incoming purchases': ClipboardList,
}

const Stat = ({ label, value }) => {
  const Icon = statIcons[label] || Package
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={16} aria-hidden="true" /></span></div><strong>{value}</strong></div>
}

export default function DashboardRole() {
  const { user } = useAuth()
  const { products, orders, purchases, warehouses, suppliers } = useDemo()
  const lowStock = products.filter((product) => product.stock <= product.min)
  const role = user?.role

  const stats = role === 'ADMIN'
    ? [['Products', products.length], ['Inventory units', products.reduce((total, product) => total + product.stock, 0)], ['Orders', orders.length], ['Suppliers', suppliers.length], ['Warehouses', warehouses.length]]
    : role === 'INVENTORY_MANAGER'
      ? [['Products', products.length], ['Inventory units', products.reduce((total, product) => total + product.stock, 0)], ['Low-stock products', lowStock.length], ['Suppliers', suppliers.length], ['Purchase orders', purchases.length]]
      : role === 'WAREHOUSE_STAFF'
        ? [['Warehouses', warehouses.length], ['Inventory units', products.reduce((total, product) => total + product.stock, 0)], ['Low-stock items', lowStock.length], ['Orders', orders.length], ['Incoming purchases', purchases.filter((purchase) => purchase.status !== 'Received').length]]
        : [['Orders', orders.length], ['Pending orders', orders.filter((order) => order.status === 'Pending').length], ['Products', products.length], ['Available units', products.reduce((total, product) => total + product.stock, 0)], ['Warehouses', warehouses.length]]

  return <><div className="page-header"><div><span className="eyebrow">OPERATIONS / DASHBOARD</span><h1>Overview</h1><p>Information available for your role: {role}.</p></div></div><div className="stats-grid">{stats.map(([label, value]) => <Stat key={label} label={label} value={value} />)}</div><div className="dashboard-grid"><section className="panel detail-panel"><div className="panel-heading"><div><h3>Low-stock monitoring</h3><p>{lowStock.length} products are at or below their minimum threshold.</p></div></div>{lowStock.length ? lowStock.slice(0, 8).map((product) => <div className="detail-list" key={product.id}><div><span>{product.name}</span><strong>{product.stock} / minimum {product.min}</strong></div></div>) : <div className="empty-state"><span className="empty-state-icon"><Boxes size={19} /></span><strong>Stock levels look healthy</strong><p>No products are currently at or below their minimum threshold.</p></div>}</section></div></>
}
