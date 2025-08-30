import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const config = {
  MONGO: process.env.MONGO,
  JWT_SECRET: process.env.JWT_SECRET,
  DODO_TOKEN: process.env.DODO_TOKEN,
  DODO_WEBHOOK_TOKEN: process.env.DODO_WEBHOOK_TOKEN,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  PRODUCT_ID: process.env.PRODUCT_ID
};

// ENV Validation

const requiredVars = [
  'MONGO',
  'JWT_SECRET', 
  'DODO_TOKEN', 
  'DODO_WEBHOOK_TOKEN',
  'FRONTEND_ORIGIN',
  'PRODUCT_ID'
];

const missingVars = requiredVars.filter(key => !config[key]);

if (missingVars.length > 0) {
  const errorMessage = `[ENV-ERROR]: Missing required env: ${missingVars.join(', ')}`;
  logger.error(errorMessage);
  process.exit(1); 
}

logger.info('[ENV]: All env are properly defined');

export default config;