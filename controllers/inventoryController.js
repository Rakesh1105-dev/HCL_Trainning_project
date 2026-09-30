import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import StockTransaction from '../models/StockTransaction.js';

const buildInventorySummary = (inventoryDoc) => ({
  ...inventoryDoc.toObject(),
  availableQuantity: inventoryDoc.quantity,
  stockStatus: inventoryDoc.quantity <= 0 ? 'OUT_OF_STOCK' : inventoryDoc.quantity <= (inventoryDoc.productId?.minimumStock || 0) ? 'LOW_STOCK' : 'IN_STOCK',
});

export const getInventoryList = async (req, res, next) => {
  try {
    const inventory = await Inventory.find()
      .populate('productId', 'name sku minimumStock price')
      .populate('warehouseId', 'name location');

    const withSummary = inventory.map((item) => buildInventorySummary(item));

    res.json({ success: true, message: 'Inventory fetched successfully', data: withSummary });
  } catch (error) {
    next(error);
  }
};

export const getInventoryById = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('productId', 'name sku minimumStock price')
      .populate('warehouseId', 'name location');

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory not found' });
    }

    res.json({ success: true, message: 'Inventory item fetched successfully', data: buildInventorySummary(inventory) });
  } catch (error) {
    next(error);
  }
};

export const adjustInventory = async (req, res, next) => {
  try {
    const { productId, warehouseId, quantity, type, reason } = req.body;

    if (!productId || !warehouseId || !quantity || !type) {
      return res.status(400).json({ success: false, message: 'Product, warehouse, quantity and type are required' });
    }

    const validTypes = ['STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid inventory adjustment type' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    let inventory = await Inventory.findOne({ productId, warehouseId });
    if (!inventory) {
      inventory = await Inventory.create({ productId, warehouseId, quantity: 0, reservedQuantity: 0 });
    }

    const quantityValue = Number(quantity);
    let nextQuantity = inventory.quantity;

    if (type === 'STOCK_IN') {
      nextQuantity += quantityValue;
    } else if (type === 'STOCK_OUT') {
      nextQuantity -= quantityValue;
    } else if (type === 'ADJUSTMENT') {
      nextQuantity = quantityValue;
    }

    if (nextQuantity < 0) {
      return res.status(400).json({ success: false, message: 'Inventory quantity cannot be negative' });
    }

    inventory.quantity = nextQuantity;
    inventory.lastUpdated = new Date();
    await inventory.save();

    await StockTransaction.create({
      productId,
      warehouseId,
      type,
      quantity: quantityValue,
      referenceId: null,
      performedBy: req.user?.userId || null,
      reason: reason || 'Inventory adjustment',
    });

    res.json({ success: true, message: 'Inventory adjusted successfully', data: inventory });
  } catch (error) {
    next(error);
  }
};

export const transferInventory = async (req, res, next) => {
  try {
    const { productId, fromWarehouseId, toWarehouseId, quantity } = req.body;

    if (!productId || !fromWarehouseId || !toWarehouseId || !quantity) {
      return res.status(400).json({ success: false, message: 'Product, source warehouse, destination warehouse and quantity are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(fromWarehouseId) || !mongoose.Types.ObjectId.isValid(toWarehouseId)) {
      return res.status(400).json({ success: false, message: 'Invalid warehouse ID' });
    }

    if (fromWarehouseId.toString() === toWarehouseId.toString()) {
      return res.status(400).json({ success: false, message: 'Source and destination warehouses must be different' });
    }

    const transferQty = Number(quantity);
    if (!Number.isFinite(transferQty) || transferQty <= 0) {
      return res.status(400).json({ success: false, message: 'Transfer quantity must be positive' });
    }

    const [product, sourceWarehouse, destinationWarehouse] = await Promise.all([
      Product.findById(productId),
      Warehouse.findById(fromWarehouseId),
      Warehouse.findById(toWarehouseId),
    ]);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!sourceWarehouse) {
      return res.status(404).json({ success: false, message: 'Source warehouse not found' });
    }

    if (!destinationWarehouse) {
      return res.status(404).json({ success: false, message: 'Destination warehouse not found' });
    }

    const session = await mongoose.startSession();

    try {
      let transferResult;

      await session.withTransaction(async () => {
        const sourceInventory = await Inventory.findOne({ productId, warehouseId: fromWarehouseId }).session(session);
        if (!sourceInventory || sourceInventory.quantity < transferQty) {
          throw new Error('Insufficient stock in source warehouse');
        }

        const destinationInventory = await Inventory.findOne({ productId, warehouseId: toWarehouseId }).session(session);

        sourceInventory.quantity -= transferQty;
        sourceInventory.lastUpdated = new Date();
        await sourceInventory.save({ session });

        if (destinationInventory) {
          destinationInventory.quantity += transferQty;
          destinationInventory.lastUpdated = new Date();
          await destinationInventory.save({ session });
        } else {
          await Inventory.create(
            [
              {
                productId,
                warehouseId: toWarehouseId,
                quantity: transferQty,
                reservedQuantity: 0,
                lastUpdated: new Date(),
              },
            ],
            { session }
          );
        }

        await StockTransaction.create(
          [
            {
              productId,
              warehouseId: fromWarehouseId,
              type: 'TRANSFER_OUT',
              quantity: transferQty,
              referenceId: null,
              performedBy: req.user?.userId || null,
              reason: 'Stock transfer out',
            },
          ],
          { session }
        );

        await StockTransaction.create(
          [
            {
              productId,
              warehouseId: toWarehouseId,
              type: 'TRANSFER_IN',
              quantity: transferQty,
              referenceId: null,
              performedBy: req.user?.userId || null,
              reason: 'Stock transfer in',
            },
          ],
          { session }
        );

        transferResult = { success: true, message: 'Inventory transferred successfully' };
      });

      return res.json(transferResult);
    } finally {
      await session.endSession();
    }
  } catch (error) {
    next(error);
  }
};

export const getLowStockInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find().populate('productId', 'name sku minimumStock').populate('warehouseId', 'name location');
    const lowStock = inventory.filter((item) => {
      const product = item.productId;
      if (!product) return false;
      return item.quantity <= Number(product.minimumStock || 0);
    });

    res.json({ success: true, message: 'Low stock inventory fetched successfully', data: lowStock });
  } catch (error) {
    next(error);
  }
};

export const getStockTransactions = async (req, res, next) => {
  try {
    const transactions = await StockTransaction.find()
      .populate('productId', 'name sku')
      .populate('warehouseId', 'name location')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, message: 'Stock transactions fetched successfully', data: transactions });
  } catch (error) {
    next(error);
  }
};

export default {
  getInventoryList,
  getInventoryById,
  adjustInventory,
  transferInventory,
  getLowStockInventory,
  getStockTransactions,
};
