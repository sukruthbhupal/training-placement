import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

export const WebcamPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [result, setResult] = useState<any>(null)
  const [, setStreaming] = useState(false)

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setStreaming(true)
      }
    } catch {
      toast.error('Camera unavailable')
    }
  }

  const capture = async () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg')
    try {
      const response = await api.post('/detect/webcam', { image_base64: dataUrl })
      setResult(response.data)
      toast.success('Webcam detection complete')
    } catch {
      toast.error('Detection failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Webcam Detection</h1>
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <video ref={videoRef} className="w-full rounded-3xl border border-white/10 bg-slate-950" />
        <div className="mt-4 flex gap-3">
          <button onClick={startStream} className="rounded-full bg-white px-6 py-3 font-medium text-slate-950">Start Camera</button>
          <button onClick={capture} className="rounded-full border border-white/10 px-6 py-3 font-medium">Capture</button>
        </div>
      </div>
      {result && <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">{result.faces.map((face: any, index: number) => <p key={index}>{face.smile ? 'Smiling' : 'Neutral'} • {face.confidence.toFixed(1)}%</p>)}</div>}
    </div>
  )
}
