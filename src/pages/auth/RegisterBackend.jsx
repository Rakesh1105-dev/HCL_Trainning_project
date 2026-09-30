import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterBackend() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) return setError('Please complete all required fields.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    const result = await register(form)
    if (result.success) navigate('/dashboard')
    else setError(result.message)
  }

  return <div className="auth-page"><div className="auth-aside"><div className="brand auth-brand"><span className="brand-mark">N</span><span>Northstar <small>Retail OS</small></span></div><div className="auth-quote"><span className="eyebrow">YOUR OPERATIONS, ELEVATED</span><h1>Bring your team into focus.</h1><p>Set up your workspace and start making smarter inventory decisions.</p></div></div><main className="auth-main"><form className="auth-card register-card" onSubmit={submit}><Link className="back-link" to="/login"><ArrowLeft size={16} /> Back to sign in</Link><span className="eyebrow">GET STARTED</span><h2>Create your workspace</h2><p className="muted">Create an account to access your assigned workspace.</p>{error && <div className="form-error">{error}</div>}<div className="form-grid"><label>Full name<input name="name" value={form.name} onChange={update} placeholder="Ava Morgan" /></label><label>Phone<input name="phone" value={form.phone} onChange={update} placeholder="+91 98765 00000" /></label></div><label>Email address<input name="email" value={form.email} onChange={update} type="email" placeholder="you@company.com" /></label><div className="form-grid"><label>Password<input name="password" value={form.password} onChange={update} type="password" placeholder="Enter a password" /></label><label>Confirm password<input name="confirm" value={form.confirm} onChange={update} type="password" placeholder="Repeat your password" /></label></div><button className="primary-btn full">Create account</button><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></form></main></div>
}
