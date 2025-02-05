const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { initializeDatabase } = require('./config/database');
const { Savings } = require('./models/Savings'); // Agregamos la importación del modelo

// Importar rutas
const expensesRoutes = require('./routes/expensesRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Crear aplicación Express
const app = express();

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware de logging
app.use(morgan('dev'));

// Middleware para parsear JSON y form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de FinNest',
    version: '1.0.0',
    endpoints: {
      expenses: '/api/expenses',
      savings: '/api/savings',
      analysis: '/api/analysis'
    }
  });
});



// Ruta de POST savings
app.post('/api/savings', async (req, res) => {
  try {
    const { goal_name, target_amount, current_amount, target_date } = req.body;

    if (!goal_name || !target_amount || !target_date) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        details: {
          goal_name: !goal_name ? 'El nombre es requerido' : null,
          target_amount: !target_amount ? 'El monto objetivo es requerido' : null,
          target_date: !target_date ? 'La fecha objetivo es requerida' : null
        }
      });
    }

    if (typeof target_amount !== 'number' || target_amount <= 0) {
      return res.status(400).json({ 
        error: 'El monto objetivo debe ser un número positivo' 
      });
    }

    if (current_amount && (typeof current_amount !== 'number' || current_amount < 0)) {
      return res.status(400).json({ 
        error: 'El monto actual debe ser un número no negativo' 
      });
    }

    // Crear el registro en la base de datos
    const newSaving = await Savings.create({
      goal_name,
      target_amount,
      current_amount: current_amount || 0,
      target_date: new Date(target_date)
    });

    res.status(201).json(newSaving);
  } catch (error) {
    console.error('Error al crear meta de ahorro:', error);
    res.status(500).json({ 
      error: 'Error al crear la meta de ahorro',
      details: error.message 
    });
  }
});




// Rutas de la API
app.use('/api/expenses', expensesRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/analysis', analysisRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Error de validación',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Función para iniciar el servidor
const startServer = async (port = process.env.PORT || 3001) => {
  try {
    await initializeDatabase();
    
    const server = app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });

    return server;
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Si el archivo es ejecutado directamente
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };