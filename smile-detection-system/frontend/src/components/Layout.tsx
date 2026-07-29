import { NavLink } from 'react-router-dom'
import { FaHome, FaImages, FaCamera, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FaHome },
  { to: '/upload', label: 'Upload', icon: FaImages },
  { to: '/webcam', label: 'Webcam', icon: FaCamera },
  { to: '/history', label: 'History', icon: FaHistory },
  { to: '/settings', label: 'Settings', icon: FaCog },
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-slate-900/70 p-4 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">Smile AI</p>
              <p className="text-sm text-slate-400">Detection Studio</p>
            </div>
            <button onClick={toggleTheme} className="rounded-full border border-white/10 px-3 py-2 text-sm">{theme === 'dark' ? '☀️' : '🌙'}</button>
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
          <button onClick={logout} className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-left text-slate-300">
            <FaSignOutAlt />
            Logout
          </button>
        </aside>
        <main className="flex-1 p-4 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
