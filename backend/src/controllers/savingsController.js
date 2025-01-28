const Savings = require('../models/Savings');

exports.getAllSavings = async (req, res) => {
  try {
    const savings = await Savings.findAll();
    res.json(savings);
  } catch (error) {
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
      currentAmount, 
      targetDate 
    } = req.body;

    const newSaving = await Savings.create({
      goalName,
      targetAmount,
      currentAmount,
      targetDate
    });

    res.status(201).json(newSaving);
  } catch (error) {
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
      targetDate 
    } = req.body;

    const saving = await Savings.findByPk(id);
    if (!saving) {
      return res.status(404).json({ message: 'Ahorro no encontrado' });
    }

    await saving.update({
      goalName, 
      targetAmount, 
      currentAmount, 
      targetDate
    });

    res.json(saving);
  } catch (error) {
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
    res.status(500).json({ 
      message: 'Error eliminando meta de ahorro', 
      error: error.message 
    });
  }
};