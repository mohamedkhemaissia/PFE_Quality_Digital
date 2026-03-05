const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mohamedkhemaissia_db_user:iMK7N9N97wel58Dp@cluster0.de1fogr.mongodb.net/?appName=Cluster0';

async function createTestUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les utilisateurs existants
    await User.deleteMany({});
    console.log('🗑️ Utilisateurs existants supprimés');

    // Créer les utilisateurs de test
    const users = [
      {
        nom: 'Admin SMQ',
        email: 'admin@smq.tn',
        motDePasse: 'admin123',
        role: 'admin'
      },
      {
        nom: 'Validateur Qualité',
        email: 'validateur@smq.tn',
        motDePasse: 'valid123',
        role: 'validateur'
      },
      {
        nom: 'Utilisateur Test',
        email: 'user@smq.tn',
        motDePasse: 'user123',
        role: 'utilisateur'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Utilisateur créé: ${userData.email}`);
    }

    console.log('🎉 Tous les utilisateurs de test ont été créés !');
    console.log('\n📋 Comptes disponibles :');
    console.log('Admin: admin@smq.tn / admin123');
    console.log('Validateur: validateur@smq.tn / valid123');
    console.log('Utilisateur: user@smq.tn / user123');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

createTestUsers();