import reportService from '../services/reportService.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await reportService.getDashboardStats();
    res.json({ success: true, message: 'Dashboard statistics fetched successfully', data: stats });
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const records = await reportService.getInventoryReport(req.query);
    res.json({ success: true, message: 'Inventory report fetched successfully', data: records });
  } catch (error) {
    next(error);
  }
};

export const getOrderReport = async (req, res, next) => {
  try {
    const records = await reportService.getOrderReport(req.query);
    res.json({ success: true, message: 'Order report fetched successfully', data: records });
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (req, res, next) => {
  try {
    const records = await reportService.getSalesReport(req.query);
    res.json({ success: true, message: 'Sales report fetched successfully', data: records });
  } catch (error) {
    next(error);
  }
};

export const getSupplierReport = async (req, res, next) => {
  try {
    const records = await reportService.getSupplierReport(req.query);
    res.json({ success: true, message: 'Supplier report fetched successfully', data: records });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseReport = async (req, res, next) => {
  try {
    const records = await reportService.getWarehouseReport(req.query);
    res.json({ success: true, message: 'Warehouse report fetched successfully', data: records });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getInventoryReport,
  getOrderReport,
  getSalesReport,
  getSupplierReport,
  getWarehouseReport,
};
