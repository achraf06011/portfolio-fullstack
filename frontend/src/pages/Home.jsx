import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Download, ArrowDown, Code2, Zap, Globe, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import monCV from '../CV_ACHRAF_AACHCHAK_WITH_PORTFOLIO.pdf';

const socialLinks = [
  { icon: Github, href: 'https://github.com/achraf06011', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/achraf-aachchak-6a5578313', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:aaachchak@gmail.com', label: 'Email' },
  { icon: Phone, href: 'tel:+212697601775', label: '+212 697-601775' },
]

const stats = [
  { value: '2+', label: 'Années d\'expérience' },
  { value: '10+', label: 'Projets réalisés' },
  { value: '8+', label: 'Technologies' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-void grid-bg relative overflow-hidden">
      {/* Orbs */}
      <div className="orb w-96 h-96 bg-accent opacity-10 top-20 -left-20" />
      <div className="orb w-80 h-80 bg-accent-2 opacity-8 bottom-40 right-20" />
      <div className="orb w-64 h-64 bg-accent opacity-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

          {/* Left: Text content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="section-number mb-6"
            >
              <span className="text-accent">01</span> — Portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.05] mb-6"
            >
              <span className="gradient-text">Achraf</span>
              <br />
              <span className="text-white/90">Aachchak</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="line-accent" />
              <span className="font-mono text-sm tracking-widest text-accent uppercase">
                Développeur Full Stack
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted text-lg leading-relaxed mb-10 max-w-lg font-light"
            >
              Je conçois et développe des applications web modernes, performantes et élégantes.
              Passionné par l'architecture logicielle et l'expérience utilisateur.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link to="/projects">
                <button className="btn-primary flex items-center gap-2">
                  <span><Zap size={14} /></span>
                  <span>Voir mes projets</span>
                </button>
              </Link>
              <a 
                href={monCV} 
                download="CV_ACHRAF_AACHCHAK.pdf"
                className="btn-outline flex items-center gap-2"
              >
                <Download size={14} />
                <span>Télécharger CV</span>
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-accent transition-all duration-300 group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs tracking-widest uppercase hidden sm:block">{label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: Avatar + decoration */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              {/* Rotating ring */}
              <div className="absolute inset-0 -m-6 rounded-full border border-accent/20 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-0 -m-12 rounded-full border border-accent/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />

              {/* Avatar */}
              <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent-2/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full rounded-full glass-strong overflow-hidden border-2 border-accent/30 animate-float">
                  {/* Placeholder avatar */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-panel">
                    <div className="text-center">
                      <div className="font-display text-6xl font-light gradient-text">AA</div>
                      <div className="font-mono text-xs text-accent mt-2 tracking-widest">DEV</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass-strong rounded-lg px-4 py-2 flex items-center gap-2 glow-border"
              >
                <Code2 size={14} className="text-accent" />
                <span className="text-xs font-mono text-white/80">Full Stack</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-strong rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <Globe size={14} className="text-accent-2" />
                <span className="text-xs font-mono text-white/80">Web Dev</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-border"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl lg:text-5xl gradient-text font-light">{value}</div>
              <div className="text-xs text-muted tracking-widest uppercase mt-2 font-mono">{label}</div>
            </div>
          ))}
        </motion.div>

      
        
      </div>
    </main>
  )
}
