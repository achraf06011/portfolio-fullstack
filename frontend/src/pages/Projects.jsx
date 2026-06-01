import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Play, X, Code2, Calendar } from 'lucide-react'
import axios from 'axios'

function VideoModal({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 5, 8, 0.95)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="glass-strong rounded-lg overflow-hidden max-w-4xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-xl text-white">{project.title}</h3>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <video
          src={project.video_url}
          controls
          autoPlay
          className="w-full max-h-[70vh] object-contain bg-black"
        />
      </motion.div>
    </motion.div>
  )
}

function ProjectCard({ project, index }) {
  const [showVideo, setShowVideo] = useState(false)
  const techs = project.technologies ? project.technologies.split(',').map(t => t.trim()) : []

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="glass rounded-lg overflow-hidden card-hover group"
      >
        {/* Thumbnail or placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-panel to-surface overflow-hidden">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Code2 size={32} className="text-accent/30 mx-auto mb-2" />
                <span className="font-mono text-xs text-muted/50">Project Preview</span>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 grid-bg opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />
            </div>
          )}

          {/* Video play button */}
          {project.video_url && (
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-14 h-14 rounded-full glass flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                <Play size={20} className="text-white ml-1" fill="white" />
              </div>
            </button>
          )}

          {/* Video badge */}
          {project.video_url && (
            <div className="absolute top-3 right-3 tag flex items-center gap-1">
              <Play size={10} />
              <span>Vidéo</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-display text-xl font-light text-white group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>
            <div className="flex items-center gap-1 text-muted/50 text-xs font-mono whitespace-nowrap">
              <Calendar size={10} />
              <span>{new Date(project.created_at).getFullYear()}</span>
            </div>
          </div>

          <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {techs.slice(0, 4).map(tech => (
              <span key={tech} className="tag">{tech}</span>
            ))}
            {techs.length > 4 && (
              <span className="tag">+{techs.length - 4}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {project.video_url && (
              <button
                onClick={() => setShowVideo(true)}
                className="btn-primary flex items-center gap-2 text-xs px-4 py-2"
              >
                <span><Play size={12} /></span>
                <span>Voir la démo</span>
              </button>
            )}
            {project.website_url && (
              <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                <button className="btn-outline flex items-center gap-2 text-xs px-4 py-2">
                  <ExternalLink size={12} />
                  <span>Voir le site</span>
                </button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 text-xs text-muted hover:text-white transition-colors px-3 py-2">
                  <Github size={14} />
                  <span className="tracking-widest uppercase">Code</span>
                </button>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showVideo && <VideoModal project={project} onClose={() => setShowVideo(false)} />}
      </AnimatePresence>
    </>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(() => setError('Impossible de charger les projets'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-void grid-bg pt-28 pb-20 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-accent opacity-8 -top-20 -right-20" />
      <div className="orb w-64 h-64 bg-accent-2 opacity-6 bottom-20 left-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="section-number mb-4"><span className="text-accent">03</span> — Projets</div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-4">
            <span className="gradient-text">Mes réalisations</span>
          </h1>
          <p className="text-muted text-lg font-light max-w-xl">
            Une sélection de projets que j'ai développés, reflétant mon expertise technique et créative.
          </p>
          <div className="line-accent mt-6" />
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-xs text-muted">Chargement...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <div className="text-accent-2 font-mono text-sm">{error}</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <Code2 size={48} className="text-muted/30 mx-auto mb-4" />
            <p className="text-muted font-light">Aucun projet pour l'instant.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
