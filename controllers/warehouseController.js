import mongoose from 'mongoose';
import Warehouse from '../models/Warehouse.js';
import Inventory from '../models/Inventory.js';

export const createWarehouse = async (req, res, next) => {
  try {
    const { name, location, managerId, phone, address, status } = req.body;

    if (!name || !location) {
      return res.status(400).json({ success: false, message: 'Warehouse name and location are required' });
    }

    const warehouse = await Warehouse.create({
      name,
      location,
      managerId,
      phone,
      address,
      status: status || 'active',
    });

    res.status(201).json({ success: true, message: 'Warehouse created successfully', data: warehouse });
  } catch (error) {
    next(error);
  }
};

export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find().populate('managerId', 'name email role').sort({ createdAt: -1 });
    res.json({ success: true, message: 'Warehouses fetched successfully', data: warehouses });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid warehouse ID' });
    }

    const warehouse = await Warehouse.findById(id).populate('managerId', 'name email role');

    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    res.json({ success: true, message: 'Warehouse fetched successfully', data: warehouse });
  } catch (error) {
    next(error);
  }
};

export const updateWarehouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid warehouse ID' });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    res.json({ success: true, message: 'Warehouse updated successfully', data: warehouse });
  } catch (error) {
    next(error);
  }
};

export const deleteWarehouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid warehouse ID' });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });

    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    res.json({ success: true, message: 'Warehouse deleted successfully', data: warehouse });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid warehouse ID' });
    }

    const inventory = await Inventory.find({ warehouseId: id })
      .populate('productId', 'name sku minimumStock price')
      .populate('warehouseId', 'name location');

    res.json({ success: true, message: 'Warehouse inventory fetched successfully', data: inventory });
  } catch (error) {
    next(error);
  }
};

export default {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseInventory,
};
