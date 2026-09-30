import { useEffect, useState } from 'react'
import { Plus, UserX } from 'lucide-react'
import { api } from '../../services/api'

const roles = ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF', 'ORDER_MANAGER']

export default function UserList() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'INVENTORY_MANAGER' })
  const [error, setError] = useState('')

  const loadUsers = async () => {
    const response = await api.getUsers()
    setUsers(response.data.data || [])
  }

  useEffect(() => { loadUsers().catch((requestError) => setError(requestError?.response?.data?.message || 'Could not load users')) }, [])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.createUser(form)
      setForm({ name: '', email: '', password: '', phone: '', role: 'INVENTORY_MANAGER' })
      await loadUsers()
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Could not create user')
    }
  }

  const deactivate = async (id) => {
    try {
      await api.deactivateUser(id)
      await loadUsers()
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Could not deactivate user')
    }
  }

  return <>
    <div className="page-header"><div><span className="eyebrow">ADMINISTRATION / USERS</span><h1>Users</h1><p>Manage accounts, roles, and access status.</p></div></div>
    {error && <div className="form-error">{error}</div>}
    <section className="panel form-panel"><form onSubmit={submit}><div className="form-content"><label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>{roles.map((role) => <option key={role}>{role}</option>)}</select></label></div><button className="primary-btn"><Plus size={16} /> Create user</button></form></section>
    <section className="panel table-panel"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.status}</td><td>{user.status === 'active' && <button className="text-button" onClick={() => deactivate(user.id)}><UserX size={15} /> Deactivate</button>}</td></tr>)}</tbody></table></section>
  </>
}
