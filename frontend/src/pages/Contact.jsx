import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Github, Linkedin, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await axios.post('/api/contact', form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-void grid-bg pt-28 pb-20 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-accent opacity-10 top-20 left-0" />
      <div className="orb w-64 h-64 bg-accent-2 opacity-8 bottom-20 right-0" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="section-number mb-4"><span className="text-accent">04</span> — Contact</div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-4">
            <span className="gradient-text">Travaillons</span>
            <br />
            <span className="text-white/80">ensemble</span>
          </h1>
          <div className="line-accent mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="text-muted text-lg font-light leading-relaxed">
              Vous avez un projet en tête ? Je serais ravi d'en discuter. N'hésitez pas à me contacter,
              je réponds généralement dans les 24 heures.
            </p>

            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'aaachchak@gmail.com', href: 'mailto:aaachchak@gmail.com' },
                { icon: MapPin, label: 'Localisation', value: 'Maroc', href: null },
                { icon: Github, label: 'GitHub', value: 'github.com/achraf', href: 'https://github.com/achraf' },
                { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/achraf', href: 'https://linkedin.com/in/achraf' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg glass flex items-center justify-center border border-accent/20 group-hover:border-accent/50 transition-colors">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted/60 tracking-widest uppercase">{label}</div>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-white/80 hover:text-accent transition-colors">{value}</a>
                    ) : (
                      <div className="text-sm text-white/80">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Availability badge */}
            <div className="glass rounded-lg p-5 flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-50" />
              </div>
              <div>
                <div className="text-sm text-white font-medium">Disponible pour de nouvelles opportunités</div>
                <div className="text-xs text-muted">Freelance ou CDI — Réponse sous 24h</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="glass-strong rounded-lg p-8">
              <h2 className="font-display text-2xl font-light text-white mb-8">Envoyer un message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label>Votre nom</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Prénom Nom"
                    required
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div>
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet ou votre demande..."
                    rows={6}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-lg"
                    style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)' }}
                  >
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-sm text-green-400">Message envoyé avec succès !</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-lg"
                    style={{ background: 'rgba(255, 101, 132, 0.1)', border: '1px solid rgba(255, 101, 132, 0.3)' }}
                  >
                    <AlertCircle size={16} className="text-accent-2" />
                    <span className="text-sm text-accent-2">Erreur lors de l'envoi. Réessayez.</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </span>
                  <span>{loading ? 'Envoi...' : 'Envoyer le message'}</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
