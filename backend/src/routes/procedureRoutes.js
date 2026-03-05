const express = require('express');
const router = express.Router();
const multer = require('multer');
const procedureController = require('../controllers/procedureController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// Routes publiques (avec authentification)
router.get('/statistics', verifyToken, procedureController.getStatistics);
router.get('/', verifyToken, procedureController.getProcedures);
router.get('/:id', verifyToken, procedureController.getProcedureById);

// Routes pour création/modification (utilisateur authentifié)
router.post('/', verifyToken, upload.single('pdf'), procedureController.createProcedure);
router.put('/:id', verifyToken, upload.single('pdf'), procedureController.updateProcedure);
router.post('/:id/request-validation', verifyToken, procedureController.requestValidation);

// Routes de validation (admin/validateur seulement)
router.post('/:id/validate', verifyToken, verifyRole(['admin', 'validateur']), procedureController.validateProcedure);
router.post('/:id/archive', verifyToken, verifyRole(['admin', 'validateur']), procedureController.archiveProcedure);

// Routes de suppression (admin seulement)
router.delete('/:id', verifyToken, verifyRole(['admin']), procedureController.deleteProcedure);

module.exports = router;
