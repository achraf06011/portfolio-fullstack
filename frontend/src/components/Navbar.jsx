import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'À Propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-accent rounded-sm rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
            <div className="absolute inset-1 bg-void rounded-sm rotate-45" />
          </div>
          <span className="font-display text-xl font-light tracking-wider text-white">
            AA<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm tracking-widest uppercase font-sans transition-colors duration-300 group ${
                location.pathname === link.to ? 'text-white' : 'text-muted hover:text-white'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {admin ? (
            <>
              <Link to="/admin">
                <button className="btn-outline flex items-center gap-2 text-xs">
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </button>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted hover:text-accent-2 transition-colors duration-300">
                <LogOut size={14} />
                <span className="text-xs tracking-widest uppercase">Déconnexion</span>
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="btn-primary flex items-center gap-2">
                <span><LogIn size={14} /></span>
                <span>Connexion</span>
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm tracking-widest uppercase ${
                    location.pathname === link.to ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {admin ? (
                <>
                  <Link to="/admin" className="text-sm tracking-widest uppercase text-accent">Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-sm tracking-widest uppercase text-accent-2">Déconnexion</button>
                </>
              ) : (
                <Link to="/login" className="text-sm tracking-widest uppercase text-accent">Connexion</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
