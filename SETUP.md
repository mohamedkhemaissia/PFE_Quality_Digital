# 🚀 Configuration du Projet PFE Quality Digital

## Variables d'environnement REQUISES

Le projet utilise des variables d'environnement. **Aucune valeur ne doit être hardcodée.**

### 1. Backend - `backend/.env`

```dotenv
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-recommended
```

**Où obtenir ces valeurs :**
- **MONGO_URI** : Allez à https://cloud.mongodb.com → Collections → Copy Connection String
- **JWT_SECRET** : Générez une chaîne aléatoire sécurisée (min 32 caractères)

### 2. Frontend - `frontend/.env`

```dotenv
VITE_API_URL=http://localhost:3000
```

Pour la production, remplacez par l'URL de votre API déployée.

### 3. Racine - `.env` (optionnel, pour certains scripts)

```dotenv
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority
VITE_API_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-recommended
PORT=3000
NODE_ENV=development
```

---

## 🔒 **⚠️ IMPORTANT : Sécurité**

- ❌ **Ne committez jamais** ces fichiers `.env` sur GitHub
- ✅ Déjà ajoutés à `.gitignore`
- ❌ **Ne copiez-collez pas** les credentials visibles ou exposées
- ✅ Changez votre mot de passe MongoDB Atlas immédiatement (vous avez un mail de MongoDB)

**Format URI MongoDB (ne pas paster d'exemple réel ici):**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true
```

Recherchez votre URI complète dans MongoDB Atlas → Connect → Drivers → Copy connection string.

## ▶️ Démarrer le projet

### Terminal 1 - Backend
```bash
cd backend
npm install    # première fois
npm start      # démarre sur port 3000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install    # première fois
npm run dev    # démarre sur http://localhost:5173 (ou autre port libre)
```

### Créer des utilisateurs de test (optionnel)
```bash
cd backend
node create-test-users.js
```

---

## ✅ Vérification

- [ ] Fichiers `.env` complétés avec vraies valeurs
- [ ] Backend démarre sans erreur (voir `✅ Connecté à MongoDB`)
- [ ] Frontend accessible à http://localhost:5173
- [ ] Console navigateur (F12) : aucune erreur de connexion
- [ ] MongoDB Atlas : vérifiez que votre utilisateur existe et les permissions sont correctes

---

## ❓ Troubleshooting

| Erreur | Cause | Solution |
|--------|-------|----------|
| `MONGO_URI est manquante` | Variable d'env non définie | Remplissez `.env` avec la vraie URI |
| `JWT_SECRET est manquant` | Variable d'env non définie | Remplissez `.env` avec une clé secrète |
| `Cannot POST /api/auth/login` | Frontend ne joint pas le backend | Vérifiez `VITE_API_URL` dans `frontend/.env` |
| `MongoError: authentication failed` | Mot de passe MongoDB incorrect | Vérifiez l'URI et le mot de passe |

---

## 🚀 Production

Avant de déployer :
- [ ] Changez `JWT_SECRET` avec une valeur sécurisée et longue
- [ ] Utilisez une base MongoDB Atlas sécurisée (IP whitelist, MFA)
- [ ] Mettez `NODE_ENV=production`
- [ ] Mettez à jour `VITE_API_URL` vers votre domaine API
