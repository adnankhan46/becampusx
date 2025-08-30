import { Webhook } from "standardwebhooks";
import logger from "../utils/logger.js";
import config from "../utils/config.js";
import Opportunity from "../model/opportunity.model.js";

const webhook = new Webhook(config.DODO_WEBHOOK_TOKEN);

/**
 *  WEBHOOK ------- Implementation --- 15 sec window limit
 */
export const dodoWebhook = async (req, res) => {
  console.log("WEBHOOK HIT!");

  try {
    const rawBody = req.body.toString("utf8");
    const headers = {
      "webhook-id": req.get("webhook-id") || "",
      "webhook-signature": req.get("webhook-signature") || "",
      "webhook-timestamp": req.get("webhook-timestamp") || "",
    };

    await webhook.verify(rawBody, headers);

    const event = JSON.parse(rawBody);
    // console.log("Full event:", JSON.stringify(event, null, 2));

    const { type, data, timestamp } = event;

    // const oppId = data.notes?.opportunityId;
    console.log("Meta Data: ", data.metadata);

    console.log("Payment Level: ", data.metadata.paymentLevel); // either 1 or 2
    const receivedPaymentLevel = data.metadata.paymentLevel;
    const oppId = data.metadata.oppId;

    if (type === "payment.succeeded") {
    //   console.log(`Payment succeeded for opportunity: ${oppId}`);
    logger.info(`[PAYMENT]: Payment Success for ${oppId} | Payment Level ${receivedPaymentLevel}`);
    
      // db operation for paymentLevel 1
      if(receivedPaymentLevel==="1") {
        await Opportunity.findByIdAndUpdate(oppId, {
          $set: { 
                  "paymentStatus.firstPayment": {
                    status: true,
                    date: String(timestamp)
                }
              }
        });
      }

      // db operation for paymentLevel 2
      if(receivedPaymentLevel==="2") {
        await Opportunity.findByIdAndUpdate(oppId, {
          $set: { 
                  "paymentStatus.secondPayment": {
                    status: true,
                    date: String(timestamp)
                }
              }
        });
        console.log("DO OPERATION FOR 2nd Payment | To send Selected Applicants to Admin"); // TODO: Send selected user to Admin
      }
    }

    if (type === "payment.cancelled") {
    //   console.log(`Payment Cancelled for opportunity: `);
      logger.warn(`[PAYMENT-WARN]: Payment Cancelled for ${oppId}`);
    }
    if (type === "payment.failed") {
    //   console.log(`Payment failed for opportunity: `);
      logger.error(`[PAYMENT-ERROR]: Payment Failed for ${oppId} | Payment Level ${receivedPaymentLevel}`);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(400);
  }
};