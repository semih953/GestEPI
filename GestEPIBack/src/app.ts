import express from 'express';
import cors from 'cors';
import routes from './routes';
import sequelize from './config/database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
});

export default app;