import express from "express";
import dotenv from "dotenv";
import http from 'http';
import cors from 'cors';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import setupSocket from './socket.js';
import bodyParser from "body-parser";
import morgan from "morgan"
import logger from "./utils/logger.js";
import config from "./utils/config.js";
// DODO webhook
import { dodoWebhook } from "./webhook/dodo.webhook.js";

// import routes
import opportunityRoutes from "./route/company.route.js";
import authRoutes from "./route/auth.route.js";
import PostRoutes from "./route/post.route.js";
import CommentRoutes from "./route/comment.route.js";
import NotificationRoutes from "./route/notification.route.js";
import applicantRouter from "./route/applicant.route.js"
import companyRoutes from "./route/company.route.js";
import adminRoutes from "./route/admin.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const httpserver = http.createServer(app);

// Socket.io (notification system)
setupSocket(httpserver);

app.use(morgan((tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = parseInt(tokens.status(req, res));
  const time = tokens['response-time'](req, res);
  
  const message = `${method} '${url}' - ${status} (${time}ms)`;
  
  if (status >= 500) {
    logger.error(message);  // Server errors
  } else if (status >= 400) {
    logger.warn(message);   // Client errors
  } else {
    logger.info(message);   // Success responses
  }
  
  return null;
}));

const TURSTED_ORIGIN = ['http://localhost:5173', process.env.FRONTEND_ORIGIN]

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', TURSTED_ORIGIN],
  credentials: true
}));

// DODO-PAYMENT
app.use("/webhook/dodo-payments", bodyParser.raw({ type: "*/*" }), dodoWebhook);
// DODO-PAYMENT
app.use(express.json());
app.use(cookieParser());


// Registered Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/comment", CommentRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/company", companyRoutes); 
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applicants", applicantRouter);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});

// ######################################### MongoDB Connection
const dbURI = config.MONGO;
if (!dbURI) {
  console.error('Error: MONGO environment variable is not defined.');
  process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => {
    // console.log("Connected to MongoDB");
    logger.info(`[CONNECTION]: MongoDB Connected`)
  })
  .catch((err) => {
    // console.error("MongoDB connection error:", err);
        logger.error(`[CONNECTION-ERR]: MongoDB Connected | ${err}`)

  });

  // test routes
  app.get('/api/front', (req, res) => {
    res.json('Hello World!');
  });
  
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

   // check memory usage (local-dev)
   const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
   const memoryData = process.memoryUsage();
   const memoryUsage = {
     rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
     heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
     heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
     external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
   };
   
   console.log(memoryUsage);

httpserver.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
  logger.info(`[CONNECTION]: Server Connected at PORT ${port}`)
});
