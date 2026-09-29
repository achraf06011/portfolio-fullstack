import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, Code2, Star } from 'lucide-react'
import axios from 'axios'
import { fallbackProjects } from '../data/fallbackProjects'
import { getVideoEmbed, getThumbnailUrl } from '../utils/projectMedia'
import Seo from '../components/Seo'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    axios.get(`/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => {
        const fallback = fallbackProjects.find(p => String(p.id) === String(id))
        if (fallback) setProject(fallback)
        else setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-void grid-bg pt-28 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (notFound || !project) {
    return (
      <main className="min-h-screen bg-void grid-bg pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted font-light mb-6">Projet introuvable.</p>
          <Link to="/projects" className="btn-outline inline-flex items-center gap-2">
            <ArrowLeft size={14} />
            <span>Retour aux projets</span>
          </Link>
        </div>
      </main>
    )
  }

  const techs = project.technologies ? project.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
  const thumbnailUrl = getThumbnailUrl(project.thumbnail)
  const embed = getVideoEmbed(project.video_url)

  return (
    <main className="min-h-screen bg-void grid-bg pt-28 pb-20 relative overflow-hidden">
      <Seo
        title={project.title}
        description={project.description}
        path={`/projects/${project.id}`}
        image={thumbnailUrl}
      />
      <div className="orb w-96 h-96 bg-accent opacity-8 -top-20 -right-20" />
      <div className="orb w-64 h-64 bg-accent-2 opacity-6 bottom-20 left-10" />

      <div className="max-w-5xl mx-auto px-6">
        <Link to="/projects" className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors duration-300 mb-8 text-sm tracking-widest uppercase">
          <ArrowLeft size={14} />
          <span>Retour aux projets</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Media */}
          <div className="relative rounded-lg overflow-hidden mb-10 glass">
            {embed ? (
              embed.type === 'iframe' ? (
                <iframe src={embed.src} className="w-full aspect-video" allowFullScreen allow="autoplay" />
              ) : (
                <video src={embed.src} controls className="w-full aspect-video object-contain bg-black" />
              )
            ) : thumbnailUrl ? (
              <img src={thumbnailUrl} alt={project.title} className="w-full aspect-video object-cover" />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-panel to-surface">
                <Code2 size={48} className="text-accent/30" />
              </div>
            )}
          </div>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              {project.featured && (
                <div className="tag inline-flex items-center gap-1 mb-3" style={{ borderColor: 'rgba(240,192,64,0.4)', color: '#f0c040' }}>
                  <Star size={10} fill="currentColor" />
                  <span>Favori</span>
                </div>
              )}
              <h1 className="font-display text-4xl lg:text-5xl font-light gradient-text mb-2">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 text-muted/60 text-sm font-mono">
                <Calendar size={12} />
                <span>{new Date(project.created_at).getFullYear()}</span>
              </div>
            </div>
          </div>

          <p className="text-muted text-lg leading-relaxed mb-8 max-w-3xl font-light">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-10">
            {techs.map((tech, i) => (
              <span key={`${tech}-${i}`} className="tag">{tech}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
            {project.website_url && (
              <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                <button className="btn-primary flex items-center gap-2">
                  <ExternalLink size={14} />
                  <span>Voir le site</span>
                </button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <button className="btn-outline flex items-center gap-2">
                  <Github size={14} />
                  <span>Voir le code</span>
                </button>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
