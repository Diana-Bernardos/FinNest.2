// src/controllers/analysisController.js
const Savings = require('../models/Savings');
const Expenses = require('../models/Expenses');
const { sequelize } = require('../config/database');

exports.getMonthlySummary = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;

    // Obtener gastos mensuales
    const monthlyExpenses = await Expenses.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpenses']
      ],
      where: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), currentMonth),
      group: [sequelize.literal('MONTH(date)')]
    });

    // Obtener ahorros totales
    const monthlySavings = await Savings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('current_amount')), 'totalSavings']
      ]
    });

    // Obtener desglose por categoría
    const categorySummary = await Expenses.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), currentMonth),
      group: ['category'],
      order: [[sequelize.col('totalAmount'), 'DESC']]
    });

    // Construir respuesta JSON
    res.json({
      monthlyExpenses: monthlyExpenses[0]?.get('totalExpenses') || 0,
      monthlySavings: monthlySavings[0]?.get('totalSavings') || 0,
      categoryBreakdown: categorySummary.map(item => ({
        category: item.get('category'),
        totalAmount: parseFloat(item.get('totalAmount')) || 0
      }))
    });
  } catch (error) {
    console.error('Error obteniendo análisis mensual:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.getYearlySummary = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Obtener gastos anuales
    const yearlyExpenses = await Expenses.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpenses']
      ],
      where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), currentYear)
    });

    // Obtener ahorros totales
    const yearlySavings = await Savings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('current_amount')), 'totalSavings']
      ]
    });

    // Construir respuesta JSON
    res.json({
      yearlyExpenses: yearlyExpenses[0]?.get('totalExpenses') || 0,
      yearlySavings: yearlySavings[0]?.get('totalSavings') || 0
    });
  } catch (error) {
    console.error('Error obteniendo análisis anual:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Obtener desglose por categoría
    const categoryBreakdown = await Expenses.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'transactionCount']
      ],
      where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), currentYear),
      group: ['category'],
      order: [[sequelize.col('totalAmount'), 'DESC']]
    });

    // Transformar datos para una estructura consistente
    res.json(
      categoryBreakdown.map(item => ({
        category: item.get('category'),
        totalAmount: parseFloat(item.get('totalAmount')) || 0,
        transactionCount: parseInt(item.get('transactionCount')) || 0
      }))
    );
  } catch (error) {
    console.error('Error obteniendo desglose por categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};