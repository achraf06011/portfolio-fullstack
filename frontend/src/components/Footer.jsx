import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'À Propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
]

const socialLinks = [
  { icon: Github, href: 'https://github.com/achraf06011', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/achraf-aachchak-6a5578313', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:aaachchak@gmail.com', label: 'Email' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <span className="font-display text-lg font-light tracking-wider text-white">
            AA<span className="text-accent">.</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs tracking-widest uppercase text-muted hover:text-accent transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted hover:text-accent transition-all duration-300 hover:scale-110"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <span className="text-xs text-muted font-mono tracking-widest">
            © {year} Achraf Aachchak — Tous droits réservés
          </span>
        </div>
      </div>
    </footer>
  )
}
