// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'family_budget_db', 
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || 'Dianaleire-1', 
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    },
    timezone: '-03:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      useUTC: false
    }
  }
);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida exitosamente');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados con la base de datos');
    }
  } catch (error) {
    console.error('❌ Error en la inicialización de la base de datos:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  initializeDatabase
};