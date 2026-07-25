import { logger } from "../lib/logger";

export class SmsService {
  /**
   * Sends an OTP code to a designated phone number.
   * Encapsulated to make it easy to move to an independent microservice later.
   * 
   * @param phone The recipient's phone number in E.164 format (e.g. +917994591023)
   * @param code The 6-digit verification code string
   * @returns A promise resolving to a boolean representing dispatch success status
   */
  async sendOtp(phone: string, code: string): Promise<boolean> {
    logger.info(`📱 [SMS Service] Dispatching OTP code: ${code} to phone number: ${phone}`);

    // =========================================================================
    // FUTURE PRODUCTION INTEGRATION STEPS (To move to a separate project):
    // =========================================================================
    // 
    // Option A: Twilio integration
    // ----------------------------
    // import twilio from "twilio";
    // const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilioClient.messages.create({
    //   body: `Your keralance HUB verification code is: ${code}. It expires in 5 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });
    //
    // Option B: MSG91 integration (Direct HTTP Fetch)
    // ------------------------------------------------
    // const response = await fetch("https://control.msg91.com/api/v5/otp", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "authkey": process.env.MSG91_AUTH_KEY as string,
    //   },
    //   body: JSON.stringify({
    //     template_id: process.env.MSG91_TEMPLATE_ID,
    //     mobile: phone.replace("+", ""),
    //     otp: code
    //   })
    // });
    // if (!response.ok) throw new Error("Gateway failed");
    //
    // =========================================================================

    // Simulated successful SMS dispatch for local development
    return true;
  }
}

export const smsService = new SmsService();
