// src/controllers/analysisController.js
const Savings = require('../models/Savings');
const Expenses = require('../models/Expenses');
const { sequelize } = require('../config/database');

exports.getMonthlySummary = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;

    const monthlyExpenses = await Expenses.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpenses']
      ],
      where: {
        [sequelize.literal](`MONTH(date) = ${currentMonth}`)
      },
      group: [sequelize.literal('MONTH(date)')]
    });

    const monthlySavings = await Savings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('currentAmount')), 'totalSavings']
      ]
    });

    const categorySummary = await Expenses.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: {
        [sequelize.literal](`MONTH(date) = ${currentMonth}`)
      },
      group: ['category']
    });

    res.json({
      monthlyExpenses: monthlyExpenses[0]?.get('totalExpenses') || 0,
      monthlySavings: monthlySavings[0]?.get('totalSavings') || 0,
      categoryBreakdown: categorySummary
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error en análisis mensual', 
      error: error.message 
    });
  }
};

exports.getYearlySummary = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const yearlyExpenses = await Expenses.findAll({
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpenses']
      ],
      where: {
        [sequelize.literal](`YEAR(date) = ${currentYear}`)
      },
      group: [sequelize.literal('YEAR(date)')]
    });

    const yearlySavings = await Savings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('currentAmount')), 'totalSavings']
      ]
    });

    res.json({
      yearlyExpenses: yearlyExpenses[0]?.get('totalExpenses') || 0,
      yearlySavings: yearlySavings[0]?.get('totalSavings') || 0
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error en análisis anual', 
      error: error.message 
    });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const categoryBreakdown = await Expenses.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'transactionCount']
      ],
      where: {
        [sequelize.literal](`YEAR(date) = ${currentYear}`)
      },
      group: ['category'],
      order: [[sequelize.col('totalAmount'), 'DESC']]
    });

    res.json(categoryBreakdown);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error en desglose por categoría', 
      error: error.message 
    });
  }
};