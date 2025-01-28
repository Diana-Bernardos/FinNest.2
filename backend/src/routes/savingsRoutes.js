// src/routes/savingsRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Savings = require('../models/Savings');

// Middleware de validación
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

// Obtener todos los ahorros
router.get('/', 
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número entero mayor a 0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser un número entre 1 y 100')
  ]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Savings.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        total: count,
        page,
        limit,
        savings: rows
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener ahorros', error: error.message });
    }
  }
);

// Crear nuevo ahorro
router.post('/', 
  validate([
    body('goalName').notEmpty().withMessage('Nombre del objetivo es requerido'),
    body('targetAmount').isFloat({ min: 0 }).withMessage('Monto objetivo debe ser positivo'),
    body('currentAmount').optional().isFloat({ min: 0 }).withMessage('Monto actual debe ser positivo'),
    body('targetDate').isISO8601().toDate().withMessage('Fecha objetivo inválida')
  ]),
  async (req, res) => {
    try {
      const newSaving = await Savings.create(req.body);
      res.status(201).json(newSaving);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear ahorro', error: error.message });
    }
  }
);

// Actualizar ahorro
router.put('/:id', 
  validate([
    param('id').isUUID().withMessage('ID inválido'),
    body('goalName').optional().notEmpty().withMessage('Nombre del objetivo no puede estar vacío'),
    body('targetAmount').optional().isFloat({ min: 0 }).withMessage('Monto objetivo debe ser positivo'),
    body('currentAmount').optional().isFloat({ min: 0 }).withMessage('Monto actual debe ser positivo'),
    body('targetDate').optional().isISO8601().toDate().withMessage('Fecha objetivo inválida')
  ]),
  async (req, res) => {
    try {
      const [updated] = await Savings.update(req.body, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedSaving = await Savings.findByPk(req.params.id);
        res.json(updatedSaving);
      } else {
        res.status(404).json({ message: 'Ahorro no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar ahorro', error: error.message });
    }
  }
);

// Eliminar ahorro
router.delete('/:id', 
  validate([
    param('id').isUUID().withMessage('ID inválido')
  ]),
  async (req, res) => {
    try {
      const deleted = await Savings.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        res.json({ message: 'Ahorro eliminado correctamente' });
      } else {
        res.status(404).json({ message: 'Ahorro no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar ahorro', error: error.message });
    }
  }
);

module.exports = router;