// src/db/seedDatabase.js
const { sequelize } = require('../config/database');
const Savings = require('../models/Savings');
const Expenses = require('../models/Expenses');

const seedDatabase = async () => {
  try {
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada');

    // Datos de ejemplo para Ahorros
    const savingsData = [
      {
        goalName: 'Vacaciones de Verano',
        targetAmount: 500000,
        currentAmount: 250000,
        targetDate: new Date('2024-12-31'),
        description: 'Ahorro para unas vacaciones familiares'
      },
      {
        goalName: 'Fondo de Emergencia',
        targetAmount: 1000000,
        currentAmount: 500000,
        targetDate: new Date('2024-06-30'),
        description: 'Ahorro para imprevistos'
      },
      {
        goalName: 'Nueva Computadora',
        targetAmount: 250000,
        currentAmount: 100000,
        targetDate: new Date('2024-09-15'),
        description: 'Ahorro para una computadora nueva'
      }
    ];

    // Datos de ejemplo para Gastos
    const expensesData = [
      {
        amount: 50000,
        category: 'alimentación',
        description: 'Compra de supermercado',
        date: new Date('2024-02-15')
      },
      {
        amount: 30000,
        category: 'transporte',
        description: 'Bencina y estacionamiento',
        date: new Date('2024-02-20')
      },
      {
        amount: 25000,
        category: 'servicios',
        description: 'Pago de luz y agua',
        date: new Date('2024-02-25')
      },
      {
        amount: 40000,
        category: 'entretenimiento',
        description: 'Salida familiar',
        date: new Date('2024-03-01')
      },
      {
        amount: 15000,
        category: 'salud',
        description: 'Medicamentos',
        date: new Date('2024-03-05')
      }
    ];

    // Insertar datos de ejemplo
    await Savings.bulkCreate(savingsData);
    await Expenses.bulkCreate(expensesData);

    console.log('✅ Datos de ejemplo insertados correctamente');
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
    throw error;
  } finally {
    // Cerrar conexión
    await sequelize.close();
  }
};

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seedDatabase()
    .then(() => console.log('Sembrado de base de datos completado'))
    .catch(error => console.error('Error en sembrado:', error));
}

module.exports = seedDatabase;