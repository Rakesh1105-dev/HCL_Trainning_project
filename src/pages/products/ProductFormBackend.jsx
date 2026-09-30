import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { categories } from '../../data'

export default function ProductFormBackend() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { products, addProduct, updateProduct } = useDemo()
  const existing = products.find((product) => product.id === id)
  const [form, setForm] = useState(() => existing || { name: '', sku: '', category: categories[0], price: '', cost: '', min: '', stock: '', status: 'Active', description: '' })
  const [error, setError] = useState('')

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (id) await updateProduct({ ...form, id })
      else await addProduct(form)
      navigate('/products')
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Could not save product')
    }
  }

  return <>
    <div className="page-header"><div><span className="eyebrow">CATALOG / PRODUCTS</span><h1>{id ? 'Edit product' : 'Add product'}</h1><p>{id ? 'Update the details and stock thresholds for this product.' : 'Add a new item to your retail catalog.'}</p></div><Link className="secondary-btn" to="/products">Cancel</Link></div>
    <form className="panel form-panel" onSubmit={submit}>
      <div className="form-section"><div><h3>Product details</h3><p>Basic information customers and your team will use.</p></div><div className="form-content">
        <label>Product name<input required name="name" value={form.name} onChange={update} /></label>
        <label>SKU<input required name="sku" value={form.sku} onChange={update} /></label>
        <label className="span-2">Description<textarea name="description" value={form.description || ''} onChange={update} rows="3" /></label>
        <label>Category<select name="category" value={form.category} onChange={update}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Status<select name="status" value={form.status} onChange={update}><option>Active</option><option>Inactive</option></select></label>
      </div></div>
      <div className="form-section"><div><h3>Pricing & stock</h3><p>Set pricing and the alert threshold.</p></div><div className="form-content">
        <label>Selling price<input required min="0" step="0.01" type="number" name="price" value={form.price} onChange={update} /></label>
        <label>Cost price<input required min="0" step="0.01" type="number" name="cost" value={form.cost} onChange={update} /></label>
        <label>Minimum stock<input required min="0" type="number" name="min" value={form.min} onChange={update} /></label>
        {!id && <label>Initial stock<input min="0" type="number" name="stock" value={form.stock} onChange={update} /></label>}
      </div></div>
      <div className="form-footer"><span>{error && <span className="form-error">{error}</span>}</span><button className="primary-btn">Save product <ArrowUpRight size={16} /></button></div>
    </form>
  </>
}
