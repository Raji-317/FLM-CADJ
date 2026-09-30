const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || "+15705650979";

let client = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
  } catch (err) {
    console.error("Twilio client initialization error:", err.message);
  }
}

const sendOTP = async (phone, otp) => {
  try {
    if (!client) {
      console.log(`[UniSync OTP Alert] Simulated OTP for ${phone}: ${otp}`);
      return;
    }
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const message = await client.messages.create({
      body: `Your UniSync OTP is ${otp}`,
      from: twilioNumber,
      to: formattedPhone
    });
    console.log("OTP sent successfully:", message.sid);
  } catch (error) {
    console.error("Error sending OTP:", error.message);
  }
};

const sendSMS = async (phone, text) => {
  try {
    if (!client) {
      console.log(`[UniSync SMS Alert] Simulated SMS for ${phone}: ${text}`);
      return;
    }
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const message = await client.messages.create({
      body: text,
      from: twilioNumber,
      to: formattedPhone
    });
    console.log("Notification SMS sent successfully:", message.sid);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
};

module.exports = { sendOTP, sendSMS };