// src/config/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');


// Importar rutas
const savingsRoutes = require('./routes/savingsRoutes');
const expensesRoutes = require('./routes/expensesRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Importar middlewares
const errorMiddleware = require('./middlewares/errorMiddleware');

const createServer = () => {
  const app = express();

  // Middlewares de seguridad y parseo
  app.use(helmet()); // Añade varios encabezados de seguridad HTTP
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Middlewares de logging y parsing
  app.use(morgan('combined')); // Logging de solicitudes
  app.use(express.json()); // Parseo de JSON
  app.use(express.urlencoded({ extended: true })); // Parseo de datos de formulario

  // Rutas
  app.use('/api/savings', savingsRoutes);
  app.use('/api/expenses', expensesRoutes);
  app.use('/api/analysis', analysisRoutes);

  // Ruta de health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      database: sequelize.isDefined ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  });

  // Middleware de manejo de errores
  app.use(errorMiddleware.notFound);
  app.use(errorMiddleware.errorHandler);

  // Función para iniciar el servidor
  const start = async (port = process.env.PORT || 4000) => {
    try {
      // Sincronizar modelos con la base de datos
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados con la base de datos');

      const server = app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en puerto ${port}`);
      });

      return server;
    } catch (error) {
      console.error('❌ Error al iniciar el servidor:', error);
      process.exit(1);
    }
  };

  return { app, start };
};

module.exports = createServer;