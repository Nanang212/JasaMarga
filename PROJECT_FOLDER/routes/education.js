const express = require('express');
const router = express.Router();

const EducationController = require('../controllers/educationController');

// Routes
router.get('/', EducationController.all);
router.get('/:id', EducationController.detail);
router.post('/', EducationController.createValidation, EducationController.create);
router.put('/:id', EducationController.updateValidation, EducationController.update);
router.delete('/:id', EducationController.deleteValidation, EducationController.delete);

module.exports = router;
