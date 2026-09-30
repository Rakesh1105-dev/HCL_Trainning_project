import mongoose from 'mongoose';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Supplier from '../models/Supplier.js';
import Warehouse from '../models/Warehouse.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import StockTransaction from '../models/StockTransaction.js';

const calculatePurchaseTotals = async (items) => {
  const validatedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Purchase item quantity must be a positive integer');
    }

    const costPrice = Number(item.costPrice || product.costPrice || 0);
    const subtotal = costPrice * quantity;

    validatedItems.push({
      productId: product._id,
      quantity,
      costPrice,
      subtotal,
    });

    totalAmount += subtotal;
  }

  return { items: validatedItems, totalAmount };
};

export const createPurchase = async (req, res, next) => {
  try {
    const { supplierId, warehouseId, items, status } = req.body;

    if (!supplierId || !warehouseId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Supplier, warehouse and items are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(supplierId) || !mongoose.Types.ObjectId.isValid(warehouseId)) {
      return res.status(400).json({ success: false, message: 'Invalid supplier or warehouse ID' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    const { items: calculatedItems, totalAmount } = await calculatePurchaseTotals(items);

    const purchaseOrder = await PurchaseOrder.create({
      supplierId,
      warehouseId,
      items: calculatedItems,
      totalAmount,
      status: status || 'ORDERED',
      orderedBy: req.user.userId,
    });

    res.status(201).json({ success: true, message: 'Purchase order created successfully', data: purchaseOrder });
  } catch (error) {
    next(error);
  }
};

export const getPurchases = async (req, res, next) => {
  try {
    const purchases = await PurchaseOrder.find()
      .populate('supplierId', 'name company')
      .populate('warehouseId', 'name location')
      .populate('orderedBy', 'name email')
      .populate('items.productId', 'name sku costPrice')
      .sort({ createdAt: -1 });

    res.json({ success: true, message: 'Purchase orders fetched successfully', data: purchases });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid purchase ID' });
    }

    const purchase = await PurchaseOrder.findById(id)
      .populate('supplierId', 'name company')
      .populate('warehouseId', 'name location')
      .populate('orderedBy', 'name email')
      .populate('items.productId', 'name sku costPrice');

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    res.json({ success: true, message: 'Purchase order fetched successfully', data: purchase });
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid purchase ID' });
    }

    const { status } = req.body;
    const validStatuses = ['DRAFT', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid purchase status' });
    }

    const purchase = await PurchaseOrder.findByIdAndUpdate(id, { status }, { new: true });
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    res.json({ success: true, message: 'Purchase order status updated successfully', data: purchase });
  } catch (error) {
    next(error);
  }
};

export const receivePurchase = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid purchase ID' });
    }

    const purchase = await PurchaseOrder.findById(id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    for (const item of purchase.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const inventory = await Inventory.findOne({ productId: item.productId, warehouseId: purchase.warehouseId });
      if (inventory) {
        inventory.quantity += item.quantity;
        inventory.lastUpdated = new Date();
        await inventory.save();
      } else {
        await Inventory.create({
          productId: item.productId,
          warehouseId: purchase.warehouseId,
          quantity: item.quantity,
          reservedQuantity: 0,
          lastUpdated: new Date(),
        });
      }

      await StockTransaction.create({
        productId: item.productId,
        warehouseId: purchase.warehouseId,
        type: 'STOCK_IN',
        quantity: item.quantity,
        referenceId: purchase._id,
        performedBy: req.user.userId,
        reason: 'Purchase received',
      });
    }

    purchase.status = 'RECEIVED';
    purchase.receivedAt = new Date();
    await purchase.save();

    res.json({ success: true, message: 'Purchase received successfully', data: purchase });
  } catch (error) {
    next(error);
  }
};

export default {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchaseStatus,
  receivePurchase,
};
