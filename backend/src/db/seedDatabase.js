// src/scripts/seedDb.js
const { Expenses } = require('../models/Expenses');
const { Savings } = require('../models/Savings');
const { sequelize } = require('./config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Sembrando datos de prueba...');

    // Crear algunos gastos de ejemplo
    await Expenses.bulkCreate([
      {
        amount: 50000,
        category: 'alimentación',
        description: 'Compra supermercado',
        date: new Date()
      },
      {
        amount: 30000,
        category: 'transporte',
        description: 'Gasolina',
        date: new Date()
      }
    ]);

    // Crear algunas metas de ahorro de ejemplo
    await Savings.bulkCreate([
      {
        goal_name: 'Vacaciones',
        target_amount: 1000000,
        current_amount: 250000,
        target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días en el futuro
        description: 'Ahorro para vacaciones de verano'
      },
      {
        goal_name: 'Fondo de emergencia',
        target_amount: 2000000,
        current_amount: 500000,
        target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días en el futuro
        description: 'Fondo para emergencias'
      }
    ]);

    console.log('✅ Datos de prueba creados');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    process.exit(1);
  }
};

seedDatabase();