import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form.email, form.password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants invalides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-void grid-bg flex items-center justify-center px-6 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-accent opacity-10 top-0 right-0" />
      <div className="orb w-64 h-64 bg-accent-2 opacity-8 bottom-0 left-0" />

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          

          <div className="glass-strong rounded-lg p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-14 h-14 mx-auto mb-5 relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full animate-glow" />
                <div className="relative w-full h-full rounded-full glass flex items-center justify-center border border-accent/30">
                  <Lock size={20} className="text-accent" />
                </div>
              </div>
              <h1 className="font-display text-3xl font-light text-white mb-2">Administration</h1>
              <p className="text-muted text-sm">Accès réservé à l'administrateur</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label>Adresse email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="admin@email.com"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Mot de passe</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{ background: 'rgba(255, 101, 132, 0.1)', border: '1px solid rgba(255, 101, 132, 0.3)' }}
                >
                  <AlertCircle size={14} className="text-accent-2 flex-shrink-0" />
                  <span className="text-sm text-accent-2">{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                <span>
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Lock size={14} />
                  }
                </span>
                <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
