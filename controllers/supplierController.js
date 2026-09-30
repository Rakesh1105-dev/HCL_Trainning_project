import mongoose from 'mongoose';
import Supplier from '../models/Supplier.js';
import PurchaseOrder from '../models/PurchaseOrder.js';

export const createSupplier = async (req, res, next) => {
  try {
    const { name, company, email, phone, address, status } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Supplier name and phone are required' });
    }

    const supplier = await Supplier.create({
      name,
      company,
      email,
      phone,
      address,
      status: status || 'active',
    });

    res.status(201).json({ success: true, message: 'Supplier created successfully', data: supplier });
  } catch (error) {
    next(error);
  }
};

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    const suppliersWithHistory = await Promise.all(
      suppliers.map(async (supplier) => {
        const purchaseHistory = await PurchaseOrder.find({ supplierId: supplier._id }).populate('warehouseId', 'name location');
        return {
          ...supplier.toObject(),
          purchaseHistory,
        };
      })
    );

    res.json({ success: true, message: 'Suppliers fetched successfully', data: suppliersWithHistory });
  } catch (error) {
    next(error);
  }
};

export const getSupplierById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid supplier ID' });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const purchaseHistory = await PurchaseOrder.find({ supplierId: supplier._id }).populate('warehouseId', 'name location');

    res.json({
      success: true,
      message: 'Supplier fetched successfully',
      data: {
        ...supplier.toObject(),
        purchaseHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid supplier ID' });
    }

    const supplier = await Supplier.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.json({ success: true, message: 'Supplier updated successfully', data: supplier });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid supplier ID' });
    }

    const supplier = await Supplier.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.json({ success: true, message: 'Supplier deleted successfully', data: supplier });
  } catch (error) {
    next(error);
  }
};

export default {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
