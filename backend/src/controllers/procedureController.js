const Procedure = require('../models/Procedure');
const ProcedureVersion = require('../models/ProcedureVersion');
const ProcedureHistory = require('../models/ProcedureHistory');
const User = require('../models/User');

// Créer une procédure
exports.createProcedure = async (req, res) => {
  try {
    const { titre, description, domaine } = req.body;

    const procedure = new Procedure({
      titre,
      description,
      domaine,
      auteur: req.userId,
      fichierUrl: req.file ? req.file.path : null
    });

    await procedure.save();

    // Ajouter à l'historique
    await ProcedureHistory.create({
      procedure: procedure._id,
      action: 'Créé',
      utilisateur: req.userId,
      details: `Procédure "${titre}" créée`
    });

    res.status(201).json(procedure);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création', error: err.message });
  }
};

// Récupérer toutes les procédures
exports.getProcedures = async (req, res) => {
  try {
    const procedures = await Procedure.find()
      .populate('auteur', 'nom email')
      .populate('validateur', 'nom email')
      .sort({ dateCreation: -1 });
    res.json(procedures);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une procédure par ID
exports.getProcedureById = async (req, res) => {
  try {
    const procedure = await Procedure.findById(req.params.id)
      .populate('auteur', 'nom email')
      .populate('validateur', 'nom email')
      .populate('versionsAntérieures')
      .populate('historique');
    
    if (!procedure) {
      return res.status(404).json({ message: 'Procédure non trouvée' });
    }

    res.json(procedure);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une procédure
exports.updateProcedure = async (req, res) => {
  try {
    const { titre, description, domaine } = req.body;
    const procedure = await Procedure.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ message: 'Procédure non trouvée' });
    }

    // Vérifier que c'est l'auteur ou un admin
    if (procedure.auteur.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Sauvegarder la version précédente
    if (procedure.statut === 'Brouillon') {
      const version = new ProcedureVersion({
        procedure: procedure._id,
        version: procedure.version,
        fichierUrl: procedure.fichierUrl,
        auteur: req.userId
      });
      await version.save();
      procedure.versionsAntérieures.push(version._id);
    }

    procedure.titre = titre || procedure.titre;
    procedure.description = description || procedure.description;
    procedure.domaine = domaine || procedure.domaine;
    procedure.dateModification = new Date();

    if (req.file) {
      procedure.fichierUrl = req.file.path;
    }

    await procedure.save();

    // Ajouter à l'historique
    await ProcedureHistory.create({
      procedure: procedure._id,
      action: 'Modifié',
      utilisateur: req.userId,
      details: `Procédure "${titre}" modifiée`
    });

    res.json(procedure);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
  }
};

// Demander la validation
exports.requestValidation = async (req, res) => {
  try {
    const procedure = await Procedure.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ message: 'Procédure non trouvée' });
    }

    if (procedure.auteur.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    procedure.statut = 'En validation';
    await procedure.save();

    await ProcedureHistory.create({
      procedure: procedure._id,
      action: 'Modifié',
      utilisateur: req.userId,
      details: 'Demande de validation envoyée'
    });

    res.json({ message: 'Demande de validation envoyée', procedure });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Valider une procédure (admin/validateur seulement)
exports.validateProcedure = async (req, res) => {
  try {
    const { approuver, commentaires } = req.body;
    const procedure = await Procedure.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ message: 'Procédure non trouvée' });
    }

    if (approuver) {
      procedure.statut = 'Validé';
      procedure.validateur = req.userId;
      procedure.dateValidation = new Date();
    } else {
      procedure.statut = 'Brouillon';
    }

    procedure.commentairesValidation = commentaires;
    await procedure.save();

    await ProcedureHistory.create({
      procedure: procedure._id,
      action: approuver ? 'Validé' : 'Modifié',
      utilisateur: req.userId,
      details: `Procédure ${approuver ? 'validée' : 'rejetée'}. Commentaires: ${commentaires}`
    });

    res.json(procedure);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Archiver une procédure
exports.archiveProcedure = async (req, res) => {
  try {
    const procedure = await Procedure.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ message: 'Procédure non trouvée' });
    }

    procedure.statut = 'Archivé';
    await procedure.save();

    await ProcedureHistory.create({
      procedure: procedure._id,
      action: 'Archivé',
      utilisateur: req.userId,
      details: 'Procédure archivée'
    });

    res.json({ message: 'Procédure archivée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une procédure
exports.deleteProcedure = async (req, res) => {
  try {
    const procedure = await Procedure.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ message: 'Procédure non trouvée' });
    }

    if (procedure.auteur.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Procedure.findByIdAndDelete(req.params.id);
    res.json({ message: 'Procédure supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les statistiques
exports.getStatistics = async (req, res) => {
  try {
    const stats = {
      totalProcedures: await Procedure.countDocuments(),
      validees: await Procedure.countDocuments({ statut: 'Validé' }),
      enValidation: await Procedure.countDocuments({ statut: 'En validation' }),
      brouillons: await Procedure.countDocuments({ statut: 'Brouillon' }),
      archivees: await Procedure.countDocuments({ statut: 'Archivé' })
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
