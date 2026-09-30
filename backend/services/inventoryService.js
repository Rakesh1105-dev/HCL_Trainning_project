import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

export const getAvailableInventory = async (productId, warehouseId) => {
  const inventory = await Inventory.findOne({ productId, warehouseId }).lean();
  return inventory || { quantity: 0, reservedQuantity: 0 };
};

export const updateInventoryQuantity = async ({ productId, warehouseId, quantity, type, reason, performedBy, referenceId }) => {
  const inventory = await Inventory.findOne({ productId, warehouseId });

  if (!inventory) {
    const createdInventory = await Inventory.create({
      productId,
      warehouseId,
      quantity: 0,
      reservedQuantity: 0,
      lastUpdated: new Date(),
    });

    const result = { ...createdInventory.toObject(), quantity: 0 };
    return result;
  }

  let nextQuantity = inventory.quantity;

  if (type === 'STOCK_IN') {
    nextQuantity += Number(quantity);
  } else if (type === 'STOCK_OUT') {
    nextQuantity -= Number(quantity);
  } else if (type === 'ADJUSTMENT') {
    nextQuantity = Number(quantity);
  }

  if (nextQuantity < 0) {
    throw new Error('Inventory quantity cannot be negative');
  }

  inventory.quantity = nextQuantity;
  inventory.lastUpdated = new Date();
  await inventory.save();

  return inventory;
};

export const ensureProductExists = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export default {
  getAvailableInventory,
  updateInventoryQuantity,
  ensureProductExists,
};
