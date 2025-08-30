import DodoPayments from 'dodopayments';
import dotenv from "dotenv";
import config from './config.js';

dotenv.config();

export const client = new DodoPayments({
  bearerToken: config.DODO_TOKEN,
  environment: 'test_mode' // or 'test_mode'
});

/**
 * will update test to live acc to node_env
 */