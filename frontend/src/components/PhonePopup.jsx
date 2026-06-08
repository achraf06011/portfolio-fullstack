import { useState, useRef, useEffect } from 'react'
import { Phone, MessageCircle, Copy, Check, X } from 'lucide-react'

const PHONE = '+212697601775'
const PHONE_DISPLAY = '+212 (0)697-601775'

export default function PhonePopup({ children }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function copy() {
    navigator.clipboard.writeText(PHONE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 text-muted hover:text-accent transition-all duration-300 group cursor-pointer">
        {children}
      </button>

      {open && (
        <div className="absolute bottom-full mb-3 left-0 z-50 glass-strong rounded-xl border border-accent/20 shadow-2xl p-4 min-w-[220px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-accent tracking-widest uppercase">Contact</span>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="text-xs text-white/60 font-mono mb-3">{PHONE_DISPLAY}</div>
          <div className="space-y-2">
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group/item"
            >
              <Phone size={15} className="text-accent" />
              <span className="text-sm text-white/80 group-hover/item:text-white">Appeler</span>
            </a>
            <a
              href={`https://wa.me/212697601775`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500/10 transition-colors group/item"
            >
              <MessageCircle size={15} className="text-green-400" />
              <span className="text-sm text-white/80 group-hover/item:text-white">WhatsApp</span>
            </a>
            <button
              onClick={copy}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group/item"
            >
              {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} className="text-muted" />}
              <span className="text-sm text-white/80 group-hover/item:text-white">
                {copied ? 'Copié !' : 'Copier le numéro'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
