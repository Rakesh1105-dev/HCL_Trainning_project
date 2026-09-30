import mongoose from 'mongoose';

const stockTransactionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    type: {
      type: String,
      enum: ['STOCK_IN', 'STOCK_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const StockTransaction = mongoose.model('StockTransaction', stockTransactionSchema);

export default StockTransaction;
