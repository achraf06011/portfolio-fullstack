import { motion } from 'framer-motion'

const skills = {
  'Frontend': ['React','React Native', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'JavaScript (ES6+)'],
  'Backend': ['Node.js', 'Express', 'Laravel', 'PHP', 'REST API'],
  'Base de données': ['MySQL', 'MongoDB'],
  'DevOps & Outils': ['Git',],
}

const timeline = [
  { year: '2026', title: 'Développeur Full Stack Senior', desc: 'Réalisation de projets web et mobiles avec React, React Native, Node.js, Express et MySQL.' },
  { year: '2025', title: 'Développeur Web & Mobile', desc: 'Conception et développement d’applications modernes dans le cadre de projets académiques et personnels.' },
  { year: '2024', title: 'Étudiant en Développement Informatique', desc: 'Formation en développement des applications Desktop, bases de données, programmation orientée objet et génie logiciel.' },
  { year: '2023', title: 'Apprentissage & Projets Personnels', desc: 'Découverte du développement web et création de premiers projets avec HTML, CSS, JavaScript et PHP.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }
  })
}

export default function About() {
  return (
    <main className="min-h-screen bg-void grid-bg pt-28 pb-20 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-accent opacity-8 -top-20 right-0" />
      <div className="orb w-64 h-64 bg-accent-2 opacity-6 bottom-40 left-0" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="section-number mb-4"><span className="text-accent">02</span> — À Propos</div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-6">
            <span className="gradient-text">Qui suis-je</span>
            <span className="text-white/40"> ?</span>
          </h1>
          <div className="line-accent" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="glass rounded-lg p-8 h-full">
              <h2 className="font-display text-3xl font-light mb-6 text-white">
                Développeur passionné
              </h2>
              <div className="space-y-4 text-muted leading-relaxed font-light">
               <p>
                Je suis <span className="text-white font-normal">Achraf Aachchak</span>, développeur Full Stack
                passionné par la création d'applications web et mobiles modernes, performantes et intuitives.
              </p>

              <p>
                Ma passion pour la technologie me pousse constamment à explorer de nouvelles approches,
                que ce soit pour l'architecture backend, l'expérience utilisateur ou l'optimisation des performances.
              </p>

              <p>
                Je maîtrise différentes technologies du développement web, notamment React, React Native,
                Node.js, Express et MySQL, tout en continuant à enrichir mes compétences à travers des projets
                concrets et l'apprentissage continu.
              </p>

              <p>
                Je reste constamment à jour avec les nouvelles technologies et les bonnes pratiques du secteur.
                Curieux et adaptable, je suis prêt à apprendre rapidement de nouveaux langages, frameworks ou
                outils afin de m'intégrer efficacement aux méthodes de travail et aux besoins de chaque entreprise.
              </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4">
                {[
                  { label: 'Localisation', value: 'Maroc' },
                  { label: 'Disponibilité', value: 'Freelance / CDI / CDD' },
                  { label: 'Email', value: 'aaachchak@gmail.com' },
                  { label: 'Langues', value: 'Arabe, Français, Anglais' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs font-mono text-muted/60 tracking-widest uppercase mb-1">{label}</div>
                    <div className="text-sm text-white/80">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h2 className="font-display text-2xl font-light mb-8 text-white/70">Parcours</h2>
            <div className="relative">
              <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/30 to-transparent" />
              <div className="space-y-8">
                {timeline.map(({ year, title, desc }, i) => (
                  <motion.div
                    key={year}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex gap-6 group"
                  >
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="font-mono text-sm text-accent">{year}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-void group-hover:scale-125 transition-transform" />
                      <div className="glass rounded-lg p-4 group-hover:border-accent/30 transition-colors">
                        <div className="text-sm font-semibold text-white mb-1">{title}</div>
                        <div className="text-xs text-muted leading-relaxed">{desc}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="section-number mb-4"><span className="text-accent">→</span> Compétences techniques</div>
          <h2 className="font-display text-4xl font-light text-white mb-12">Stack technologique</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, techs], i) => (
              <motion.div
                key={category}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="glass rounded-lg p-6 card-hover"
              >
                <h3 className="font-mono text-xs text-accent tracking-widest uppercase mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map(tech => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
