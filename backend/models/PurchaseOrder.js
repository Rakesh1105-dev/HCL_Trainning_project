import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Warehouse is required'],
    },
    items: {
      type: [purchaseItemSchema],
      required: [true, 'Purchase items are required'],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'At least one item is required',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'],
      default: 'DRAFT',
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
