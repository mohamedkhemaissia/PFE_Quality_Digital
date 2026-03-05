# Comptes de Test - SMQ Digital

## 🔐 Comptes Utilisateur

| Rôle | Email | Mot de passe | Permissions |
|------|-------|-------------|-------------|
| **Administrateur** | admin@smq.tn | admin123 | ✏️ Créer, ✏️ Modifier, ✅ Valider, 🗂️ Archiver, 🗑️ Supprimer |
| **Validateur** | validateur@smq.tn | valid123 | ✏️ Créer, ✏️ Modifier, ✅ Valider/Rejeter |
| **Utilisateur** | user@smq.tn | user123 | ✏️ Créer, 📤 Demander validation |

## 🚀 Démarrage Rapide

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run dev
```

### URLs
- Frontend: http://localhost:5174/
- Backend: http://localhost:3000/

## 📋 Fonctionnalités par Rôle

### Administrateur
- Gestion complète des utilisateurs
- Validation et archivage des procédures
- Accès à tous les rapports et statistiques
- Suppression de procédures

### Validateur
- Révision des procédures en attente
- Validation ou rejet avec commentaires
- Archivage des procédures validées

### Utilisateur
- Création de nouvelles procédures
- Upload de documents PDF
- Suivi du statut des procédures
- Demande de validation

## 🔄 Workflow des Procédures

1. **Création** (Utilisateur) → Statut: Brouillon
2. **Demande de validation** (Utilisateur) → Statut: En validation
3. **Validation/Rejet** (Validateur/Admin) → Statut: Validé ou Brouillon
4. **Archivage** (Validateur/Admin) → Statut: Archivé

## 📊 Dashboard

- **KPIs en temps réel** : Total, Validés, En validation, Autres
- **Gestion documentaire** avec versioning
- **Chatbot IA** pour recherche de procédures
- **Historique** complet des modifications