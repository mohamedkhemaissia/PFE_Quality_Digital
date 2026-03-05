const mongoose = require('mongoose');
const User = require('./src/models/User');
const Department = require('./src/models/Department');

// Connexion à MongoDB
// Ne jamais laisser de credentials en dur dans ce fichier. L'URI doit
en être fourni via une variable d'environnement (MONGO_URI).
// Si vous travaillez en local, placez-la dans backend/.env et assurez‑vous que
// le fichier est listé dans .gitignore (c'est déjà le cas).
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('🚨 MONGO_URI non défini. Veuillez configurer la variable d\'environnement.');
  process.exit(1);
}

async function createTestUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // supprimer collections liées pour repartir proprement
    await User.deleteMany({});
    await Department.deleteMany({});
    console.log('🗑️ Collections `users` et `departments` vidées');

    // créer quelques départements professionnels
    const deptsData = [
      { nom: 'Qualité', description: 'Département qualité et conformité' },
      { nom: 'Production', description: 'Département production' },
      { nom: 'IT', description: 'Support et développement informatique' }
    ];

    const departements = [];
    for (const d of deptsData) {
      const dept = new Department(d);
      await dept.save();
      departements.push(dept);
      console.log(`🏢 Département créé : ${dept.nom}`);
    }

    // utilisateurs professionnels associés aux départements
    const users = [
      {
        nom: 'Amine Directeur',
        email: 'amine.directeur@smq.tn',
        motDePasse: 'Secret123!',
        role: 'admin',
        departement: departements.find(d => d.nom === 'Qualité')._id
      },
      {
        nom: 'Sara Validatrice',
        email: 'sara.validatrice@smq.tn',
        motDePasse: 'Valider456!',
        role: 'validateur',
        departement: departements.find(d => d.nom === 'Qualité')._id
      },
      {
        nom: 'Khaled Opérateur',
        email: 'khaled.operateur@smq.tn',
        motDePasse: 'Op3rateur!',
        role: 'utilisateur',
        departement: departements.find(d => d.nom === 'Production')._id
      },
      {
        nom: 'Leila IT',
        email: 'leila.it@smq.tn',
        motDePasse: 'ItSec789!',
        role: 'utilisateur',
        departement: departements.find(d => d.nom === 'IT')._id
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Utilisateur créé: ${userData.email}`);
    }

    console.log('🎉 Base professionnelle initialisée !');
    console.log('\n📋 Utilisateurs disponibles :');
    users.forEach(u => console.log(`${u.role}: ${u.email} / ${u.motDePasse}`));

  } catch (error) {
    console.error('❌ Erreur dans le seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

createTestUsers();