import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'
import { hasRoleAccess } from '../permissions'

const DemoContext = createContext(null)

const titleCase = (value = '') => value.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
const productColor = (id = '') => ['#e7f0ff', '#e9e3ff', '#dff7f1', '#fff0d9', '#f6e9d8'][String(id).charCodeAt(0) % 5]

export function DemoProvider({ children }) {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [purchases, setPurchases] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [suppliers, setSuppliers] = useState([])

  const loadData = useCallback(async () => {
    if (!user) return

    const [productResponse, warehouseResponse, inventoryResponse, supplierResponse, orderResponse, purchaseResponse] = await Promise.all([
      hasRoleAccess(user.role, 'products') ? api.getProducts() : Promise.resolve(null),
      hasRoleAccess(user.role, 'warehouses') ? api.getWarehouses() : Promise.resolve(null),
      hasRoleAccess(user.role, 'inventory') ? api.getInventory() : Promise.resolve(null),
      hasRoleAccess(user.role, 'suppliers') ? api.getSuppliers() : Promise.resolve(null),
      hasRoleAccess(user.role, 'orders') ? api.getOrders() : Promise.resolve(null),
      hasRoleAccess(user.role, 'purchases') ? api.getPurchases() : Promise.resolve(null),
    ])

    const inventory = inventoryResponse?.data?.data || []
    const stockByProduct = inventory.reduce((result, item) => {
      const id = item.productId?._id || item.productId
      result[id] = (result[id] || 0) + Number(item.quantity || 0)
      return result
    }, {})
    const productRecords = productResponse?.data?.data?.products || []

    setProducts(productRecords.map((product) => ({
      id: product._id,
      name: product.name,
      sku: product.sku,
      category: product.categoryId?.name || 'Uncategorized',
      categoryId: product.categoryId?._id || product.categoryId,
      description: product.description,
      price: product.price,
      cost: product.costPrice,
      min: product.minimumStock,
      stock: stockByProduct[product._id] || 0,
      status: titleCase(product.status),
      color: productColor(product._id),
    })))
    setWarehouses((warehouseResponse?.data?.data || []).map((warehouse) => ({
      id: warehouse._id,
      name: warehouse.name,
      location: warehouse.location,
      manager: warehouse.managerId?.name || 'Unassigned',
      phone: warehouse.phone || '',
      status: titleCase(warehouse.status),
      products: inventory.filter((item) => (item.warehouseId?._id || item.warehouseId) === warehouse._id).length,
      stock: inventory.filter((item) => (item.warehouseId?._id || item.warehouseId) === warehouse._id).reduce((total, item) => total + Number(item.quantity || 0), 0),
    })))
    setSuppliers((supplierResponse?.data?.data || []).map((supplier) => ({
      id: supplier._id,
      name: supplier.company || supplier.name,
      contact: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone,
      supplied: 0,
      orders: supplier.purchaseHistory?.length || 0,
      status: titleCase(supplier.status),
    })))
    setOrders((orderResponse?.data?.data || []).map((order) => ({
      id: order._id,
      customer: order.customerName,
      phone: order.customerPhone,
      warehouse: order.warehouseId?.name || '',
      warehouseId: order.warehouseId?._id || order.warehouseId,
      items: order.items?.length || 0,
      total: order.totalAmount,
      date: new Date(order.createdAt).toLocaleDateString(),
      status: titleCase(order.status),
    })))
    setPurchases((purchaseResponse?.data?.data || []).map((purchase) => ({
      id: purchase._id,
      supplier: purchase.supplierId?.company || purchase.supplierId?.name || '',
      warehouse: purchase.warehouseId?.name || '',
      items: purchase.items?.length || 0,
      total: purchase.totalAmount,
      date: new Date(purchase.createdAt).toLocaleDateString(),
      status: titleCase(purchase.status),
    })))
  }, [user])

  useEffect(() => {
    loadData().catch((error) => console.error('Could not load backend data:', error))
  }, [loadData])

  const findCategoryId = async (name) => {
    const response = await api.getCategories()
    const existing = (response.data.data || []).find((category) => category.name.toLowerCase() === name.toLowerCase())
    if (existing) return existing._id
    const created = await api.createCategory({ name })
    return created.data.data._id
  }

  const adjustStock = async (id, amount) => {
    const warehouseId = warehouses[0]?.id
    if (!warehouseId) throw new Error('Create a warehouse before adjusting stock')
    await api.adjustInventory({ productId: id, warehouseId, quantity: Math.abs(Number(amount)), type: Number(amount) >= 0 ? 'STOCK_IN' : 'STOCK_OUT' })
    await loadData()
  }

  const addProduct = async (item) => {
    const categoryId = await findCategoryId(item.category)
    const response = await api.createProduct({ name: item.name, sku: item.sku, description: item.description, categoryId, price: item.price, costPrice: item.cost, minimumStock: item.min, status: item.status.toLowerCase() })
    if (Number(item.stock) > 0 && warehouses[0]?.id) {
      await api.adjustInventory({ productId: response.data.data._id, warehouseId: warehouses[0].id, quantity: Number(item.stock), type: 'STOCK_IN' })
    }
    await loadData()
  }

  const updateProduct = async (item) => {
    const categoryId = item.categoryId || await findCategoryId(item.category)
    await api.updateProduct(item.id, { name: item.name, sku: item.sku, description: item.description, categoryId, price: item.price, costPrice: item.cost, minimumStock: item.min, status: item.status.toLowerCase() })
    await loadData()
  }

  const deleteProduct = async (id) => {
    await api.deleteProduct(id)
    await loadData()
  }

  const updateOrderStatus = async (id, status) => {
    await api.updateOrderStatus(id, status.toUpperCase())
    await loadData()
  }

  const receivePurchase = async (id) => {
    await api.receivePurchase(id)
    await loadData()
  }

  const createWarehouse = async (item) => {
    await api.createWarehouse(item)
    await loadData()
  }

  const createSupplier = async (item) => {
    await api.createSupplier(item)
    await loadData()
  }

  const createPurchase = async (item) => {
    await api.createPurchase(item)
    await loadData()
  }

  return <DemoContext.Provider value={{ products, orders, purchases, warehouses, suppliers, adjustStock, addProduct, updateProduct, deleteProduct, updateOrderStatus, receivePurchase, createWarehouse, createSupplier, createPurchase }}>{children}</DemoContext.Provider>
}
export const useDemo = () => useContext(DemoContext)
