import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'

export const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await api.post('/detect/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(response.data)
      toast.success('Detection complete')
    } catch {
      toast.error('Upload failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Image Upload</h1>
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-dashed border-white/20 bg-slate-950/50 p-8" />
        <button onClick={handleUpload} className="mt-4 rounded-full bg-white px-6 py-3 font-medium text-slate-950">Run Detection</button>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Detection Result</h2>
          <p className="mt-2 text-slate-400">Timestamp: {result.timestamp}</p>
          {result.faces.map((face: any, index: number) => (
            <div key={index} className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p>{face.smile ? 'Smiling' : 'Neutral'} • Confidence {face.confidence.toFixed(1)}%</p>
              <p className="text-sm text-slate-400">Bounding box: {face.bounding_box.join(', ')}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
