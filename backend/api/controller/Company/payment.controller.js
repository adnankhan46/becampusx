import Opportunity from "../../model/opportunity.model.js";
import { errorHandler } from "../../middlewares/error.js";
import { client } from "../../utils/paymentConfig.js";
import config from "../../utils/config.js";
/** 
 * @Info
 * paymentLevel: 1 -> for 1st payment (default)
 *               2 -> for 2nd payment
 */

export const MakePayment = async (req, res, next) => {
  const { oppId } = req.params;
  try {
    const opportunity = await Opportunity.findById(oppId).populate('createdBy.id').exec();
    console.log("ID: ",opportunity.createdBy.id);

    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }

    if (!opportunity.isPaid) {
      return next(errorHandler(401, "FREEE")); // Not Paid Opp
    }

    // MUST: Converting Mongoose Obj to Plain Obj
    const plainObject = opportunity.toObject();
console.log('FirstPayment from plain object:', plainObject.paymentStatus);
console.log(`${Boolean(plainObject.paymentStatus.firstPayment.status) ? "TRUE": "FALSE"}`);

    let paymentLevel = "1"; // by default level is 1 for 1st payment

   if (Boolean(plainObject.paymentStatus.firstPayment.status)) {
    paymentLevel = "2" // if 1st payment true, then  it is for second payment
}

    const paymentAmount = opportunity.amount;

    // company information
    const companyEmail =  opportunity.createdBy.id.email || "email";
    const companyName = opportunity.createdBy.id.username || "Comp Name";

    
    // Treat This Specific Opportunity as the 'Product'
    const productCart = [
      {
        product_id: config.PRODUCT_ID,
        product_name: `Cx_op`,
        quantity: 1,
        amount: paymentAmount * 0.5 * 100, // 50% upfront
      },
    ];
    console.log("opp id::: ", String(opportunity._id));

    const payment_order = await client.payments.create({
      payment_link: true,
      billing: {
        city: "SampleCity",
        country: "IN",
        state: "SampleState",
        street: "Sample Street",
        zipcode: "123456",
      },
      customer: { email: companyEmail, name: companyName },
      // amount: 15*100,
      currency: "INR",
      metadata: {
        type: `First Payment [${companyName}]`,
        msg: `First Payment has been done`,
        oppId: String(opportunity._id),
        paymentLevel: String(paymentLevel)
      },
      notes: {
        type: `First Payment [${companyName}]`,
        msg: `Payment has been done`
      },
      product_cart: productCart,
    });

    res.status(200).json({
      link: payment_order.payment_link,
      company: companyName,
      message: `Payment Link is sent, kindly make your ${paymentLevel=="1"? "first" : "second"} payment`,
      paymentLevel: paymentLevel
    });
  } catch (error) {
    next(error);
  }
};