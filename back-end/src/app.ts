import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();

// Security HTTP headers
app.use(helmet());

// Rate Limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Muitas requisições originadas deste IP, por favor tente novamente em 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api', limiter);
}

// Strict CORS for production (allowing localhost for dev)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.use('/api', routes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  // Avoid exposing stack trace in production
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({ error: 'Internal Server Error', details: isProd ? null : err.message });
});

export default app;
