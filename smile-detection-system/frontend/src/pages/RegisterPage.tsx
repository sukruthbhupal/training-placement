import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await api.post('/auth/register', form)
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      login({ id: 1, name: form.name, email: form.email })
      toast.success('Account created')
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <p className="mt-2 text-sm text-slate-400">Start detecting smiles instantly.</p>
        <input className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="mt-6 w-full rounded-full bg-white px-4 py-3 font-medium text-slate-950">Register</button>
        <p className="mt-4 text-sm text-slate-400">Already have an account? <Link className="text-cyan-400" to="/login">Login</Link></p>
      </form>
    </div>
  )
}
