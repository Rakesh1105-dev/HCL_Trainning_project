export const ROLE_ACCESS = {
  ADMIN: ['dashboard', 'products', 'warehouses', 'inventory', 'suppliers', 'orders', 'purchases', 'reports', 'users'],
  INVENTORY_MANAGER: ['dashboard', 'products', 'warehouses', 'inventory', 'suppliers', 'purchases'],
  WAREHOUSE_STAFF: ['dashboard', 'products', 'warehouses', 'inventory', 'orders', 'purchases'],
  ORDER_MANAGER: ['dashboard', 'products', 'warehouses', 'inventory', 'orders'],
}

export const hasRoleAccess = (role, area) => ROLE_ACCESS[role]?.includes(area) || false
export const canManage = (role, area) => {
  if (role === 'ADMIN') return true
  if (role === 'INVENTORY_MANAGER' && ['products', 'categories', 'inventory', 'suppliers', 'purchases'].includes(area)) return true
  if (role === 'WAREHOUSE_STAFF' && area === 'inventory') return true
  if (role === 'ORDER_MANAGER' && area === 'orders') return true
  return false
}
