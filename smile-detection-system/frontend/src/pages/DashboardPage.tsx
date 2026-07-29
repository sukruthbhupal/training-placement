import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import type { DashboardData, DetectionItem } from '../types'

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold">{value}</p>
  </div>
)

export const DashboardPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [history, setHistory] = useState<DetectionItem[]>([])

  useEffect(() => {
    const load = async () => {
      const [dashboardRes, historyRes] = await Promise.all([api.get('/dashboard'), api.get('/history')])
      setDashboard(dashboardRes.data)
      setHistory(historyRes.data)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-slate-400">Live view of your detection activity.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Uploads" value={dashboard?.total_uploads?.toString() ?? '0'} />
        <StatCard label="Total Smiles" value={dashboard?.total_smiles?.toString() ?? '0'} />
        <StatCard label="Average Confidence" value={`${dashboard?.average_confidence ?? 0}%`} />
        <StatCard label="Today's Detections" value={dashboard?.today_detections?.toString() ?? '0'} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <div className="mt-4 space-y-3">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                <div>
                  <p className="font-medium">{item.filename}</p>
                  <p className="text-sm text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.smile ? 'Smiling' : 'Neutral'}</p>
                  <p className="text-sm text-slate-400">{item.confidence.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-400">
            <p>• Responsive UI with premium dark/light themes.</p>
            <p>• Automated history tracking per detection.</p>
            <p>• Real-time webcam stream support.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
