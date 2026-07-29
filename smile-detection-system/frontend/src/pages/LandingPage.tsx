import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const LandingPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_55%)] px-6 text-center">
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
      <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">AI-powered smile detection for modern teams</p>
      <h1 className="text-4xl font-semibold sm:text-6xl">Detect smiles from images and live camera feeds.</h1>
      <p className="mt-6 text-lg text-slate-400">Upload photos, run real-time webcam detection, and review your smiling history with polished analytics.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/register" className="rounded-full bg-white px-6 py-3 font-medium text-slate-950">Get Started</Link>
        <Link to="/login" className="rounded-full border border-white/10 px-6 py-3 font-medium">Login</Link>
      </div>
    </motion.div>
  </div>
)
