import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Retail Inventory Management System API is running',
    data: {
      version: '1.0.0',
      endpoints: [
        '/api/auth',
        '/api/products',
        '/api/warehouses',
        '/api/inventory',
        '/api/suppliers',
        '/api/orders',
        '/api/purchases',
        '/api/reports',
      ],
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
