import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Warehouse name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Warehouse location is required'],
      trim: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;
