import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await api.post('/auth/login', form)
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      login({ id: 1, name: 'Demo User', email: form.email })
      toast.success('Logged in')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-400">Sign in to your smile workspace.</p>
        <input className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="mt-6 w-full rounded-full bg-white px-4 py-3 font-medium text-slate-950">Login</button>
        <p className="mt-4 text-sm text-slate-400">New here? <Link className="text-cyan-400" to="/register">Register</Link></p>
      </form>
    </div>
  )
}
