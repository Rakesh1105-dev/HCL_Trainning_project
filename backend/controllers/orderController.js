import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import Inventory from '../models/Inventory.js';
import StockTransaction from '../models/StockTransaction.js';

const calculateOrderTotals = async (items) => {
  const validatedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Order item quantity must be a positive integer');
    }

    const unitPrice = Number(product.price);
    const subtotal = unitPrice * quantity;

    validatedItems.push({
      productId: product._id,
      quantity,
      price: unitPrice,
      subtotal,
    });

    totalAmount += subtotal;
  }

  return { items: validatedItems, totalAmount };
};

export const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, warehouseId, items } = req.body;

    if (!customerName || !customerPhone || !warehouseId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer details, warehouse and items are required' });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    const { items: calculatedItems, totalAmount } = await calculateOrderTotals(items);

    for (const item of calculatedItems) {
      const inventory = await Inventory.findOne({ productId: item.productId, warehouseId });
      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      warehouseId,
      items: calculatedItems,
      totalAmount,
      status: 'CONFIRMED',
      createdBy: req.user.userId,
    });

    for (const item of calculatedItems) {
      const inventory = await Inventory.findOne({ productId: item.productId, warehouseId });
      inventory.quantity -= item.quantity;
      inventory.lastUpdated = new Date();
      await inventory.save();

      await StockTransaction.create({
        productId: item.productId,
        warehouseId,
        type: 'STOCK_OUT',
        quantity: item.quantity,
        referenceId: order._id,
        performedBy: req.user.userId,
        reason: 'Customer order',
      });
    }

    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('warehouseId', 'name location')
      .populate('createdBy', 'name email')
      .populate('items.productId', 'name sku price')
      .sort({ createdAt: -1 });

    res.json({ success: true, message: 'Orders fetched successfully', data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('warehouseId', 'name location')
      .populate('createdBy', 'name email')
      .populate('items.productId', 'name sku price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order fetched successfully', data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    for (const item of order.items) {
      const inventory = await Inventory.findOne({ productId: item.productId, warehouseId: order.warehouseId });
      if (inventory) {
        inventory.quantity += item.quantity;
        inventory.lastUpdated = new Date();
        await inventory.save();
      }

      await StockTransaction.create({
        productId: item.productId,
        warehouseId: order.warehouseId,
        type: 'STOCK_IN',
        quantity: item.quantity,
        referenceId: order._id,
        performedBy: req.user.userId,
        reason: 'Order cancellation refund',
      });
    }

    order.status = 'CANCELLED';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
