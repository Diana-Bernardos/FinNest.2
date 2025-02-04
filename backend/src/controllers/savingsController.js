// src/controllers/savingsController.js
const Savings = require('../models/Savings');

exports.getAllSavings = async (req, res) => {
  try {
    const savings = await Savings.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        deletedAt: null
      }
    });
    res.json(savings);
  } catch (error) {
    console.error('Error en getAllSavings:', error);
    res.status(500).json({ 
      message: 'Error recuperando ahorros', 
      error: error.message 
    });
  }
};

exports.createSaving = async (req, res) => {
  try {
    const { 
      goalName, 
      targetAmount, 
      currentAmount = 0, 
      targetDate,
      description = '' 
    } = req.body;

    const newSaving = await Savings.create({
      goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      targetDate: new Date(targetDate),
      description
    });

    res.status(201).json(newSaving);
  } catch (error) {
    console.error('Error en createSaving:', error);
    res.status(400).json({ 
      message: 'Error creando meta de ahorro', 
      error: error.message 
    });
  }
};

exports.updateSaving = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      goalName, 
      targetAmount, 
      currentAmount, 
      targetDate,
      description 
    } = req.body;

    const saving = await Savings.findByPk(id);
    if (!saving) {
      return res.status(404).json({ message: 'Ahorro no encontrado' });
    }

    const updatedSaving = await saving.update({
      goalName, 
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      targetDate: new Date(targetDate),
      description
    });

    res.json(updatedSaving);
  } catch (error) {
    console.error('Error en updateSaving:', error);
    res.status(400).json({ 
      message: 'Error actualizando meta de ahorro', 
      error: error.message 
    });
  }
};

exports.deleteSaving = async (req, res) => {
  try {
    const { id } = req.params;
    const saving = await Savings.findByPk(id);

    if (!saving) {
      return res.status(404).json({ message: 'Ahorro no encontrado' });
    }

    await saving.destroy();
    res.json({ message: 'Ahorro eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteSaving:', error);
    res.status(500).json({ 
      message: 'Error eliminando meta de ahorro', 
      error: error.message 
    });
  }
};