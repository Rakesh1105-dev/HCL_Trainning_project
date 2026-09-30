import Loader from './Loader'
import { Inbox } from 'lucide-react'

export default function Table({ columns, rows, loading = false, empty = 'No records found' }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={columns.length} className="empty"><Loader /></td></tr> : rows.length ? rows.map((row, index) => <tr key={row.id || index}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}</tr>) : <tr><td colSpan={columns.length} className="empty"><div className="table-empty"><Inbox size={21} strokeWidth={1.7} /><span>{empty}</span></div></td></tr>}</tbody></table></div>
}
