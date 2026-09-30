import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Supplier from '../models/Supplier.js';
import Warehouse from '../models/Warehouse.js';

export const getDashboardStats = async () => {
  const [
    totalProducts,
    totalInventory,
    totalOrders,
    totalSales,
    lowStockProductsResult,
    totalSuppliers,
    totalWarehouses,
    pendingOrders,
  ] = await Promise.all([
    Product.countDocuments({ status: { $ne: 'inactive' } }),
    Inventory.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Inventory.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $match: { $expr: { $lte: ['$quantity', '$product.minimumStock'] } } },
      { $count: 'count' },
    ]),
    Supplier.countDocuments({ status: { $ne: 'inactive' } }),
    Warehouse.countDocuments({ status: { $ne: 'inactive' } }),
    Order.countDocuments({ status: 'PENDING' }),
  ]);

  const inventoryTotal = totalInventory[0]?.total || 0;
  const salesTotal = totalSales[0]?.total || 0;
  const lowStockProducts = lowStockProductsResult[0]?.count || 0;

  return {
    totalProducts,
    totalInventory: inventoryTotal,
    totalOrders,
    totalSales: salesTotal,
    lowStockProducts,
    totalSuppliers,
    totalWarehouses,
    pendingOrders,
  };
};

export const getInventoryReport = async (filters = {}) => {
  const match = {};

  if (filters.warehouseId) match.warehouseId = new mongoose.Types.ObjectId(filters.warehouseId);
  if (filters.productId) match.productId = new mongoose.Types.ObjectId(filters.productId);

  if (filters.status) {
    match.quantity = filters.status === 'low' ? { $lte: 0 } : { $gt: 0 };
  }

  return Inventory.find(match)
    .populate('productId', 'name sku price minimumStock')
    .populate('warehouseId', 'name location');
};

export const getOrderReport = async (filters = {}) => {
  const match = {};

  if (filters.status) match.status = filters.status;
  if (filters.warehouseId) match.warehouseId = new mongoose.Types.ObjectId(filters.warehouseId);
  if (filters.startDate || filters.endDate) {
    match.createdAt = {};
    if (filters.startDate) match.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) match.createdAt.$lte = new Date(filters.endDate);
  }

  return Order.find(match)
    .populate('warehouseId', 'name location')
    .populate('createdBy', 'name email');
};

export const getSalesReport = async (filters = {}) => {
  const match = {};

  if (filters.warehouseId) match.warehouseId = new mongoose.Types.ObjectId(filters.warehouseId);
  if (filters.startDate || filters.endDate) {
    match.createdAt = {};
    if (filters.startDate) match.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) match.createdAt.$lte = new Date(filters.endDate);
  }

  return Order.aggregate([
    { $match: match },
    { $group: { _id: null, totalSales: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
  ]);
};

export const getSupplierReport = async (filters = {}) => {
  const match = {};
  if (filters.status) match.status = filters.status;
  return Supplier.find(match);
};

export const getWarehouseReport = async (filters = {}) => {
  const match = {};
  if (filters.status) match.status = filters.status;
  return Warehouse.find(match).populate('managerId', 'name email');
};

export default {
  getDashboardStats,
  getInventoryReport,
  getOrderReport,
  getSalesReport,
  getSupplierReport,
  getWarehouseReport,
};
