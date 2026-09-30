import { X } from 'lucide-react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>{children}</div></div>
}
