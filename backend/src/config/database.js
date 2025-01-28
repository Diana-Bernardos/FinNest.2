// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();


// Configuración de conexión a MySQL
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
      max: 5,     // máximo de conexiones en el pool
      min: 0,     // mínimo de conexiones en el pool
      acquire: 30000,  // tiempo máximo de espera para obtener conexión
      idle: 10000      // tiempo máximo de inactividad de una conexión
    },
    define: {
      timestamps: true,   // añade campos createdAt y updatedAt
      underscored: true,  // usa snake_case para nombres de columnas
      paranoid: true      // permite soft deletes
    },
    timezone: '-03:00'    // Zona horaria de Chile
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida exitosamente');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    throw error;
  }
};

// Función para sincronizar modelos
const syncDatabase = async () => {
  try {
    // Sincronización segura: no elimina datos existentes
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error sincronizando base de datos:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};