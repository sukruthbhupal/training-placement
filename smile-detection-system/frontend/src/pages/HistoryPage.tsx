import { useEffect, useState } from 'react'
import api from '../services/api'
import type { DetectionItem } from '../types'

export const HistoryPage = () => {
  const [items, setItems] = useState<DetectionItem[]>([])
  useEffect(() => {
    const load = async () => {
      const response = await api.get('/history')
      setItems(response.data)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Detection History</h1>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/70 text-slate-400">
            <tr>
              <th className="px-4 py-3">Filename</th>
              <th className="px-4 py-3">Smile</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="px-4 py-3">{item.filename}</td>
                <td className="px-4 py-3">{item.smile ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">{item.confidence.toFixed(1)}%</td>
                <td className="px-4 py-3">{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
