import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Play, X, Code2, Calendar, Star, AppWindow, Bot, ArrowLeft, ArrowRight } from 'lucide-react'
import axios from 'axios'
import { fallbackProjects } from '../data/fallbackProjects'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { getVideoEmbed, getThumbnailUrl } from '../utils/projectMedia'

function sortProjects(list) {
  return [...list].sort((a, b) => {
    const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    if (featuredDiff !== 0) return featuredDiff
    return new Date(b.created_at) - new Date(a.created_at)
  })
}

function VideoModal({ project, onClose }) {
  const embed = getVideoEmbed(project.video_url)
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
        {embed?.type === 'iframe' ? (
          <iframe
            src={embed.src}
            className="w-full aspect-video"
            allowFullScreen
            allow="autoplay"
          />
        ) : (
          <video
            src={embed?.src}
            controls
            autoPlay
            className="w-full max-h-[70vh] object-contain bg-black"
          />
        )}
      </motion.div>
    </motion.div>
  )
}

function ProjectCard({ project, index }) {
  const [showVideo, setShowVideo] = useState(false)
  const [showAllTechs, setShowAllTechs] = useState(false)
  const [thumbnailFailed, setThumbnailFailed] = useState(false)
  const techs = project.technologies ? project.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
  const visibleTechs = showAllTechs ? techs : techs.slice(0, 4)
  const hiddenTechsCount = techs.length - 4
  const thumbnailUrl = getThumbnailUrl(project.thumbnail)

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
          {thumbnailUrl && !thumbnailFailed ? (
            <img
              src={thumbnailUrl}
              alt={project.title}
              onError={() => setThumbnailFailed(true)}
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

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 tag flex items-center gap-1" style={{ borderColor: 'rgba(240,192,64,0.4)', color: '#f0c040' }}>
              <Star size={10} fill="currentColor" />
              <span>Favori</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <Link to={`/projects/${project.id}`}>
              <h3 className="font-display text-xl font-light text-white group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h3>
            </Link>
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
            {visibleTechs.map((tech, techIndex) => (
              <span key={`${tech}-${techIndex}`} className="tag">{tech}</span>
            ))}
            {hiddenTechsCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllTechs(current => !current)}
                className="tag hover:border-accent hover:text-white transition-colors"
                aria-expanded={showAllTechs}
                aria-label={showAllTechs ? 'Masquer les technologies' : `Afficher ${hiddenTechsCount} technologies supplémentaires`}
              >
                {showAllTechs ? 'Réduire' : `+${hiddenTechsCount}`}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Link to={`/projects/${project.id}`}>
              <button className="btn-outline flex items-center gap-2 text-xs px-4 py-2">
                <span>Voir les détails</span>
              </button>
            </Link>
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

const TECH_CASING = {
  css: 'CSS', css3: 'CSS3', html: 'HTML', html5: 'HTML5', sql: 'SQL', php: 'PHP',
  ajax: 'AJAX', gsap: 'GSAP', api: 'API', 'rest api': 'REST API', 'c#': 'C#', orm: 'ORM',
}

function normalizeTech(raw) {
  const cleaned = raw.trim().replace(/\.+$/, '').replace(/\s+/g, ' ')
  if (!cleaned) return ''
  const key = cleaned.toLowerCase()
  return TECH_CASING[key] || cleaned
}

function dedupeTechs(list) {
  const seen = new Map()
  for (const raw of list) {
    const cleaned = normalizeTech(raw)
    if (!cleaned) continue
    const key = cleaned.toLowerCase()
    if (!seen.has(key)) seen.set(key, cleaned)
  }
  return [...seen.values()]
}

function getProjectTechs(project) {
  return project.technologies ? dedupeTechs(project.technologies.split(',')) : []
}

function topTechsOf(list, limit) {
  const counts = new Map()
  for (const project of list) {
    for (const tech of getProjectTechs(project)) counts.set(tech, (counts.get(tech) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([tech]) => tech)
}

const CATEGORIES = [
  {
    id: 'application',
    label: 'Applications',
    icon: AppWindow,
    text: 'Sites web, applications web et mobiles que j\'ai développés.',
  },
  {
    id: 'ai-agent',
    label: 'Agents IA',
    icon: Bot,
    text: 'Agents intelligents qui automatisent des tâches : recherche d\'emploi, assistants et plus.',
  },
]

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTag, setActiveTag] = useState(null)
  const [showAllTags, setShowAllTags] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => setProjects(sortProjects(res.data)))
      .catch(() => {
        setProjects(sortProjects(fallbackProjects))
        setError(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const projectCategory = project => project.category || 'application'
  const categoryProjects = activeCategory
    ? projects.filter(project => projectCategory(project) === activeCategory)
    : []

  const tags = dedupeTechs(categoryProjects.flatMap(project => project.technologies ? project.technologies.split(',') : []))
    .sort((a, b) => a.localeCompare(b))
  const visibleTagsLimit = 14
  const visibleTags = showAllTags ? tags : tags.slice(0, visibleTagsLimit)
  const hiddenTagsCount = tags.length - visibleTagsLimit
  const filteredProjects = activeTag
    ? categoryProjects.filter(project => getProjectTechs(project).includes(activeTag))
    : categoryProjects

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setActiveTag(null)
    setShowAllTags(false)
  }

  return (
    <main className="min-h-screen bg-void grid-bg pt-28 pb-20 relative overflow-hidden">
      <Seo
        title="Projets"
        description="Découvrez les projets web et mobiles réalisés par Achraf Aachchak : React, Node.js, Laravel et plus."
        path="/projects"
      />
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

        {/* Étape 1 : choix de la catégorie */}
        {!loading && !error && projects.length > 0 && !activeCategory && (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {CATEGORIES.map((category, i) => {
              const Icon = category.icon
              const inCategory = projects.filter(project => projectCategory(project) === category.id)
              const count = inCategory.length
              const topTechs = topTechsOf(inCategory, 5)
              return (
                <motion.button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                  className="glass rounded-lg p-8 lg:p-10 text-left card-hover group relative overflow-hidden min-h-[340px] lg:min-h-[380px] flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute right-6 top-2 font-display font-light text-[7rem] lg:text-[9rem] leading-none text-accent/10 select-none pointer-events-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative flex flex-col flex-1">
                    <div className="w-16 h-16 rounded-lg border border-accent/40 bg-accent/10 flex items-center justify-center mb-6 text-accent">
                      <Icon size={30} />
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-light text-white group-hover:text-accent transition-colors duration-300 mb-4">
                      {category.label}
                    </h2>
                    <p className="text-muted text-base leading-relaxed max-w-md mb-6">{category.text}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {topTechs.map(tech => <span key={tech} className="tag">{tech}</span>)}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-border">
                      <span className="font-mono text-sm text-muted">{count} projet{count > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-3 text-accent font-mono text-xs tracking-widest uppercase">
                        Explorer
                        <span className="w-10 h-10 rounded-full border border-accent/50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                          <ArrowRight size={16} />
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Étape 2 : retour + catégorie choisie */}
        {!loading && !error && projects.length > 0 && activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <button
              type="button"
              onClick={() => handleCategoryChange(null)}
              className="flex items-center gap-2 text-xs text-muted hover:text-white transition-colors px-3 py-2 tracking-widest uppercase"
            >
              <ArrowLeft size={14} />
              <span>Retour</span>
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`tag-filter ${activeCategory === category.id ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
              >
                {category.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Tag filters */}
        {!loading && !error && activeCategory && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`tag-filter ${activeTag === null ? 'active' : ''}`}
            >
              Tous
            </button>
            {visibleTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(current => (current === tag ? null : tag))}
                className={`tag-filter ${activeTag === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
            {hiddenTagsCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllTags(current => !current)}
                className="tag-filter"
              >
                {showAllTags ? 'Réduire' : `+${hiddenTagsCount} de plus`}
              </button>
            )}
          </motion.div>
        )}

        {/* Content */}
        {!activeCategory && !loading ? null : loading ? (
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
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24">
            <Code2 size={48} className="text-muted/30 mx-auto mb-4" />
            <p className="text-muted font-light">
              {activeTag
                ? `Aucun projet avec la technologie "${activeTag}".`
                : 'Aucun projet dans cette catégorie pour l\'instant.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
