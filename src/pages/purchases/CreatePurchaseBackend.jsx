import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'

export default function CreatePurchaseBackend() {
  const navigate = useNavigate()
  const { products, suppliers, warehouses, createPurchase } = useDemo()
  const [supplierId, setSupplierId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [costPrice, setCostPrice] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await createPurchase({
        supplierId,
        warehouseId,
        items: [{ productId, quantity: Number(quantity), costPrice: Number(costPrice) }],
      })
      setSaved(true)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Could not create purchase order')
    }
  }

  return <>
    <div className="page-header"><div><span className="eyebrow">PROCUREMENT / PURCHASE ORDERS</span><h1>Create purchase order</h1><p>Build a replenishment order for one of your suppliers.</p></div><Link className="secondary-btn" to="/purchases">Cancel</Link></div>
    <form className="panel form-panel" onSubmit={submit}>
      <div className="form-section"><div><h3>Order details</h3><p>Select the supplier and destination.</p></div><div className="form-content">
        <label>Supplier<select required value={supplierId} onChange={(event) => setSupplierId(event.target.value)}><option value="">Select supplier</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label>
        <label>Warehouse<select required value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)}><option value="">Select warehouse</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select></label>
      </div></div>
      <div className="form-section"><div><h3>Products</h3><p>Add a product and quantity to this order.</p></div><div className="form-content">
        <label>Product<select required value={productId} onChange={(event) => { setProductId(event.target.value); const product = products.find((item) => item.id === event.target.value); setCostPrice(product?.cost || '') }}><option value="">Select product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
        <label>Quantity<input required min="1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
        <label>Cost price<input required min="0" step="0.01" type="number" value={costPrice} onChange={(event) => setCostPrice(event.target.value)} /></label>
      </div></div>
      <div className="form-footer"><span>{error ? <span className="form-error">{error}</span> : saved && <span className="success-message"><Check size={15} /> Purchase order created</span>}</span><button className="primary-btn" disabled={saved}>Create purchase order <ArrowUpRight size={16} /></button></div>
    </form>
  </>
}
