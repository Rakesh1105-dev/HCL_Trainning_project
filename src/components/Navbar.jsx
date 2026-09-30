import { Bell, Menu, Search, ChevronDown, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth(); const [open, setOpen] = useState(false)
  return <header className="navbar"><button className="icon-btn mobile-only" onClick={onMenu}><Menu size={20} /></button><div className="global-search"><Search size={17} /><input placeholder="Search products, orders, suppliers..." /></div><div className="nav-actions"><button className="icon-btn notification"><Bell size={19} /><i /></button><div className="profile" onClick={() => setOpen(!open)}><div className="avatar">AM</div><div className="profile-copy"><strong>{user?.name || 'Ava Morgan'}</strong><span>{user?.role || 'Administrator'}</span></div><ChevronDown size={16} />{open && <div className="profile-menu"><button><Settings size={15} /> Account settings</button><button onClick={logout}><LogOut size={15} /> Sign out</button></div>}</div></div></header>
}
