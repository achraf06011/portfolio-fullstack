# 🚀 Portfolio Achraf Aachchak

Portfolio professionnel Full Stack avec espace admin, upload vidéo et design premium.

---

## ✨ Fonctionnalités

- **Design premium** — fond sombre, glassmorphism, animations Framer Motion
- **4 pages publiques** — Accueil, À Propos, Projets, Contact
- **Authentification JWT** sécurisée
- **Dashboard Admin** — CRUD complet des projets
- **Upload vidéo** — MP4 jusqu'à 100MB, lecteur intégré
- **Base de données SQLite** — portable, sans configuration
- **Responsive** — mobile, tablette, desktop
- **Formulaire de contact** — messages sauvegardés en base

---

## 🛠 Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Backend | Node.js + Express |
| Base de données | SQLite (sql.js) |
| Auth | JWT + bcrypt |
| Upload | Multer |

---

## 📦 Installation

### Prérequis
- Node.js 18+ installé

### 1. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend (nouveau terminal)
cd frontend
npm install
```

### 2. Lancer le projet

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
# Démarre sur http://localhost:5000
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
# Démarre sur http://localhost:5173
```

### 3. Ouvrir le navigateur

```
http://localhost:5173
```

---

## 🔐 Connexion Admin

| Champ | Valeur |
|-------|--------|
| Email | aaachchak@gmail.com |
| Mot de passe | Achrafreali06 |
| URL Admin | http://localhost:5173/login |

> ⚠️ Le mot de passe est stocké haché avec **bcrypt** (12 rounds). Jamais en clair.

---

## 📁 Structure du projet

```
portfolio/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Login/JWT
│   │   ├── projects.js      # CRUD + upload
│   │   └── contact.js       # Formulaire contact
│   ├── middleware/
│   │   └── auth.js          # Vérification JWT
│   ├── uploads/             # Vidéos & images uploadées
│   ├── database.js          # SQLite (sql.js)
│   ├── server.js            # Point d'entrée Express
│   ├── .env                 # Variables d'environnement
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx     # Page d'accueil hero
│   │   │   ├── About.jsx    # À propos + skills
│   │   │   ├── Projects.jsx # Grille projets + vidéos
│   │   │   ├── Contact.jsx  # Formulaire contact
│   │   │   ├── Login.jsx    # Connexion admin
│   │   │   └── Admin.jsx    # Dashboard complet
│   │   ├── components/
│   │   │   └── Navbar.jsx   # Navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        # Design system
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🎨 Design System

| Variable | Couleur |
|----------|---------|
| Fond principal | `#050508` (void) |
| Surface | `#0f0f1a` |
| Accent principal | `#6c63ff` (violet) |
| Accent secondaire | `#ff6584` (rose) |
| Texte atténué | `#4a4a6a` |

**Fonts :**
- Display: *Cormorant Garamond* (titres)
- Sans: *Syne* (corps)
- Mono: *JetBrains Mono* (code/labels)

---

## 🔗 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Connexion admin |
| GET | `/api/auth/me` | Profil connecté |

### Projets (publics)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | Liste tous les projets |
| GET | `/api/projects/:id` | Un projet |

### Projets (admin — nécessite JWT)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/projects` | Créer un projet |
| PUT | `/api/projects/:id` | Modifier un projet |
| DELETE | `/api/projects/:id` | Supprimer un projet |

### Contact
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/contact` | Envoyer un message |
| GET | `/api/contact` | Lire messages (admin) |

---

## 📝 Personnalisation

### Modifier les infos personnelles
- **Nom, titre, bio** : `frontend/src/pages/Home.jsx` et `About.jsx`
- **Réseaux sociaux** : `Home.jsx` → tableau `socialLinks`
- **Photo de profil** : Remplacez le placeholder dans `Home.jsx` par une balise `<img>`

### Ajouter un CV
Placez votre fichier CV dans `frontend/public/cv-achraf-aachchak.pdf`

### Variables d'environnement
Modifiez `backend/.env` :
```env
PORT=5000
JWT_SECRET=votre_secret_fort_ici
```

---

## 🚀 Déploiement (Production)

### Build frontend
```bash
cd frontend
npm run build
# Le dossier dist/ est prêt pour l'hébergement
```

### Servir le frontend depuis Express
Ajoutez dans `backend/server.js` :
```javascript
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

---

## 💡 Notes importantes

- La base de données est un fichier `portfolio.db.json` créé automatiquement au démarrage
- Les uploads sont stockés dans `backend/uploads/`
- En production, pensez à déplacer uploads sur un CDN (AWS S3, Cloudflare R2)
- Le JWT expire après 7 jours

---

Fait avec ❤️ pour **Achraf Aachchak**
