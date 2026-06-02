import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Play, Link, Github, Image, LogOut, MessageSquare, FolderOpen, Eye } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const emptyForm = {
  title: '', description: '', technologies: '',
  website_url: '', github_url: '',
  video_url: '', thumbnail: ''
}

function ProjectForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial || emptyForm)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label>Nom du projet *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Mon super projet" required />
        </div>
        <div>
          <label>Technologies * (séparées par virgule)</label>
          <input value={form.technologies} onChange={e => set('technologies', e.target.value)} placeholder="React, Node.js, MySQL" required />
        </div>
      </div>

      <div>
        <label>Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Décrivez le projet..." rows={4} required style={{ resize: 'vertical' }} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="flex items-center gap-2"><Link size={10} />URL du site (facultatif)</label>
          <input value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="flex items-center gap-2"><Github size={10} />URL GitHub (facultatif)</label>
          <input value={form.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
        </div>
      </div>

      {/* Video URL */}
      <div>
        <label className="flex items-center gap-2"><Play size={10} />URL de la vidéo (facultatif)</label>
        <input
          value={form.video_url}
          onChange={e => set('video_url', e.target.value)}
          placeholder="https://... (lien direct MP4, Google Drive, etc.)"
        />
        {form.video_url && (
          <video src={form.video_url} className="mt-2 max-h-32 rounded w-full" controls />
        )}
      </div>

      {/* Thumbnail URL */}
      <div>
        <label className="flex items-center gap-2"><Image size={10} />URL de l'image miniature (facultatif)</label>
        <input
          value={form.thumbnail}
          onChange={e => set('thumbnail', e.target.value)}
          placeholder="https://... (lien direct vers une image)"
        />
        {form.thumbnail && (
          <img src={form.thumbnail} className="mt-2 max-h-24 rounded object-cover" alt="preview" />
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <span><Save size={14} /></span>
          <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
        <button type="button" onClick={onCancel} className="btn-outline flex items-center gap-2">
          <X size={14} />
          <span>Annuler</span>
        </button>
      </div>
    </form>
  )
}

export default function Admin() {
  const [projects, setProjects] = useState([])
  const [messages, setMessages] = useState([])
  const [tab, setTab] = useState('projects')
  const [modal, setModal] = useState(null) // null | 'add' | project object (edit)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const load = () => {
    axios.get('/api/projects').then(r => setProjects(r.data))
    axios.get('/api/contact').then(r => setMessages(r.data)).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const handleSave = async (form) => {
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        technologies: form.technologies,
        website_url: form.website_url || null,
        github_url: form.github_url || null,
        video_url: form.video_url || null,
        thumbnail: form.thumbnail || null,
      }
      if (modal === 'add') {
        await axios.post('/api/projects', payload)
      } else {
        await axios.put(`/api/projects/${modal.id}`, payload)
      }
      load()
      setModal(null)
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde'
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await axios.delete(`/api/projects/${deleteId}`)
      load()
      setDeleteId(null)
    } catch {
      alert('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  const editInitial = modal && modal !== 'add' ? {
    ...modal,
    videoPreview: null,
    thumbPreview: null
  } : null

  return (
    <main className="min-h-screen bg-void grid-bg pt-20 pb-16">
      <div className="orb w-80 h-80 bg-accent opacity-6 top-0 right-0" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10 pt-8"
        >
          <div>
            <div className="section-number mb-2"><span className="text-accent">Admin</span> — Dashboard</div>
            <h1 className="font-display text-4xl font-light text-white">Tableau de bord</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted hover:text-accent-2 transition-colors text-sm">
            <LogOut size={14} />
            <span className="font-mono text-xs tracking-widest uppercase">Déconnexion</span>
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: FolderOpen, label: 'Projets', value: projects.length, color: 'accent' },
            { icon: Play, label: 'Avec vidéo', value: projects.filter(p => p.video_url).length, color: 'accent' },
            { icon: Link, label: 'En ligne', value: projects.filter(p => p.website_url).length, color: 'accent-2' },
            { icon: MessageSquare, label: 'Messages', value: messages.length, color: 'gold' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <Icon size={14} className={`text-${color}`} />
                <span className="text-xs font-mono text-muted tracking-widest uppercase">{label}</span>
              </div>
              <div className="font-display text-3xl font-light text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 glass-strong rounded-lg p-1 w-fit">
          {['projects', 'messages'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded text-xs font-mono tracking-widest uppercase transition-all duration-200 ${
                tab === t ? 'bg-accent text-white' : 'text-muted hover:text-white'
              }`}
            >
              {t === 'projects' ? 'Projets' : 'Messages'}
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {tab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-light text-white">Gestion des projets</h2>
              <button
                onClick={() => setModal('add')}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <span><Plus size={14} /></span>
                <span>Nouveau projet</span>
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="glass rounded-lg p-16 text-center">
                <FolderOpen size={40} className="text-muted/30 mx-auto mb-4" />
                <p className="text-muted">Aucun projet. Créez-en un !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-lg p-5 flex items-center gap-5 group hover:border-accent/30 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded flex-shrink-0 overflow-hidden"
                      style={{ background: 'rgba(108,99,255,0.1)' }}>
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FolderOpen size={14} className="text-accent/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium text-white truncate">{p.title}</span>
                        {p.video_url && (
                          <span className="tag flex items-center gap-1 text-xs">
                            <Play size={8} /> Vidéo
                          </span>
                        )}
                        {p.website_url && (
                          <span className="tag flex items-center gap-1 text-xs" style={{ borderColor: 'rgba(255,101,132,0.3)', color: '#ff9ab0' }}>
                            <Eye size={8} /> Live
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted truncate">{p.description}</div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setModal(p)}
                        className="w-8 h-8 rounded glass flex items-center justify-center text-muted hover:text-accent transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="w-8 h-8 rounded glass flex items-center justify-center text-muted hover:text-accent-2 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages tab */}
        {tab === 'messages' && (
          <div>
            <h2 className="font-display text-2xl font-light text-white mb-6">Messages reçus</h2>
            {messages.length === 0 ? (
              <div className="glass rounded-lg p-16 text-center">
                <MessageSquare size={40} className="text-muted/30 mx-auto mb-4" />
                <p className="text-muted">Aucun message pour l'instant.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-sm font-semibold text-white">{m.name}</span>
                        <span className="text-xs text-muted ml-2">{m.email}</span>
                      </div>
                      <span className="text-xs font-mono text-muted/50">
                        {new Date(m.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{m.message}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 overflow-y-auto"
            style={{ background: 'rgba(5, 5, 8, 0.9)' }}
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-lg p-8 w-full max-w-2xl mb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-light text-white">
                  {modal === 'add' ? 'Nouveau projet' : `Modifier: ${modal.title}`}
                </h2>
                <button onClick={() => setModal(null)} className="text-muted hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <ProjectForm
                initial={editInitial}
                onSave={handleSave}
                onCancel={() => setModal(null)}
                loading={saving}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5, 5, 8, 0.9)' }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-lg p-8 max-w-sm w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 mx-auto mb-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 101, 132, 0.15)', border: '1px solid rgba(255,101,132,0.3)' }}>
                <Trash2 size={20} className="text-accent-2" />
              </div>
              <h3 className="font-display text-xl text-white mb-2">Supprimer le projet ?</h3>
              <p className="text-sm text-muted mb-8">Cette action est irréversible. Les fichiers associés seront également supprimés.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-6 py-2 rounded text-sm font-mono tracking-widest uppercase text-white transition-colors disabled:opacity-50"
                  style={{ background: 'rgba(255, 101, 132, 0.3)', border: '1px solid rgba(255, 101, 132, 0.5)' }}
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
                <button onClick={() => setDeleteId(null)} className="btn-outline text-sm px-5 py-2">
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
