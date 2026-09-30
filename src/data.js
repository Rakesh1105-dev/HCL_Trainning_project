export const categories = ['Electronics', 'Grocery', 'Clothing', 'Home Appliances', 'Stationery']

export const products = [
  { id: 1, name: 'Dell Latitude 5440', sku: 'EL-DLL-5440', category: 'Electronics', price: 899, cost: 680, min: 12, status: 'Active', stock: 42, color: '#e7f0ff' },
  { id: 2, name: 'Samsung 27” Monitor', sku: 'EL-SAM-M27', category: 'Electronics', price: 319, cost: 224, min: 10, status: 'Active', stock: 8, color: '#e9e3ff' },
  { id: 3, name: 'Logitech MX Keys', sku: 'EL-LOG-MXK', category: 'Electronics', price: 109, cost: 72, min: 20, status: 'Active', stock: 0, color: '#dff7f1' },
  { id: 4, name: 'Sony WH-1000XM5', sku: 'EL-SNY-XM5', category: 'Electronics', price: 349, cost: 265, min: 8, status: 'Active', stock: 19, color: '#fff0d9' },
  { id: 5, name: 'Organic Basmati Rice 5kg', sku: 'GR-RIC-005', category: 'Grocery', price: 18, cost: 12, min: 30, status: 'Active', stock: 76, color: '#f6e9d8' },
  { id: 6, name: 'Cold Pressed Olive Oil', sku: 'GR-OIL-750', category: 'Grocery', price: 14, cost: 9, min: 18, status: 'Active', stock: 11, color: '#ecf4d8' },
  { id: 7, name: 'Classic Oxford Shirt', sku: 'CL-OXF-NAV', category: 'Clothing', price: 48, cost: 24, min: 15, status: 'Active', stock: 33, color: '#dceaf5' },
  { id: 8, name: 'Linen Relaxed Trousers', sku: 'CL-LIN-SND', category: 'Clothing', price: 64, cost: 31, min: 10, status: 'Active', stock: 5, color: '#f3e9dc' },
  { id: 9, name: 'Philips Air Fryer XL', sku: 'HA-PHL-AFR', category: 'Home Appliances', price: 129, cost: 88, min: 6, status: 'Active', stock: 14, color: '#e2edf2' },
  { id: 10, name: 'Leuchtturm Weekly Planner', sku: 'ST-LCH-WPL', category: 'Stationery', price: 24, cost: 13, min: 20, status: 'Active', stock: 62, color: '#fae2e2' },
  { id: 11, name: 'Anker USB-C Hub', sku: 'EL-ANK-HUB', category: 'Electronics', price: 39, cost: 22, min: 15, status: 'Active', stock: 27, color: '#e1ecff' },
  { id: 12, name: 'Cotton Everyday Tee', sku: 'CL-COT-TEE', category: 'Clothing', price: 22, cost: 10, min: 25, status: 'Active', stock: 18, color: '#f7e3ef' },
]

export const warehouses = [
  { id: 1, name: 'Delhi Central', location: 'Okhla Phase II, Delhi', manager: 'Rohan Mehta', phone: '+91 98765 11220', products: 184, stock: 4820, status: 'Operational' },
  { id: 2, name: 'Noida North', location: 'Sector 62, Noida', manager: 'Priya Shah', phone: '+91 98765 22110', products: 139, stock: 3210, status: 'Operational' },
  { id: 3, name: 'Gurugram Hub', location: 'Udyog Vihar, Gurugram', manager: 'Kabir Singh', phone: '+91 98765 33001', products: 97, stock: 1880, status: 'Operational' },
]

export const suppliers = [
  { id: 1, name: 'TechSource India', contact: 'Neeraj Kapoor', email: 'orders@techsource.in', phone: '+91 11 4422 8100', supplied: 42, orders: 18, status: 'Active' },
  { id: 2, name: 'GreenBasket Foods', contact: 'Meera Joshi', email: 'hello@greenbasket.in', phone: '+91 80 2511 0921', supplied: 28, orders: 14, status: 'Active' },
  { id: 3, name: 'Urban Loom Co.', contact: 'Arjun Malhotra', email: 'trade@urbanloom.co', phone: '+91 22 4300 8812', supplied: 36, orders: 11, status: 'Active' },
  { id: 4, name: 'Apex Homeware', contact: 'Sana Khan', email: 'sales@apexhomeware.in', phone: '+91 20 4102 0192', supplied: 19, orders: 8, status: 'Paused' },
  { id: 5, name: 'Paper & Co.', contact: 'Vikram Bedi', email: 'studio@paperco.in', phone: '+91 40 3811 7702', supplied: 24, orders: 12, status: 'Active' },
]

export const orders = [
  { id: 'ORD-10482', customer: 'Nisha Verma', phone: '+91 98100 72118', warehouse: 'Delhi Central', items: 3, total: 1248, date: '24 Sep 2026', status: 'Processing' },
  { id: 'ORD-10481', customer: 'Arun Iyer', phone: '+91 98200 11292', warehouse: 'Noida North', items: 2, total: 387, date: '24 Sep 2026', status: 'Packed' },
  { id: 'ORD-10480', customer: 'Sana Thomas', phone: '+91 98990 80128', warehouse: 'Delhi Central', items: 1, total: 349, date: '23 Sep 2026', status: 'Shipped' },
  { id: 'ORD-10479', customer: 'Dev Patel', phone: '+91 99100 66582', warehouse: 'Gurugram Hub', items: 5, total: 822, date: '23 Sep 2026', status: 'Delivered' },
  { id: 'ORD-10478', customer: 'Aditi Rao', phone: '+91 98111 90220', warehouse: 'Noida North', items: 2, total: 86, date: '22 Sep 2026', status: 'Pending' },
  { id: 'ORD-10477', customer: 'Kunal Sethi', phone: '+91 98711 00872', warehouse: 'Delhi Central', items: 4, total: 1090, date: '21 Sep 2026', status: 'Confirmed' },
]

export const purchases = [
  { id: 'PO-2088', supplier: 'TechSource India', warehouse: 'Delhi Central', items: 4, total: 8420, date: '24 Sep 2026', status: 'Ordered' },
  { id: 'PO-2087', supplier: 'GreenBasket Foods', warehouse: 'Noida North', items: 6, total: 2840, date: '22 Sep 2026', status: 'Partially Received' },
  { id: 'PO-2086', supplier: 'Urban Loom Co.', warehouse: 'Gurugram Hub', items: 3, total: 4560, date: '19 Sep 2026', status: 'Received' },
  { id: 'PO-2085', supplier: 'Paper & Co.', warehouse: 'Delhi Central', items: 5, total: 1290, date: '16 Sep 2026', status: 'Received' },
]
