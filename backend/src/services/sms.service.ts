import { logger } from "../lib/logger";
import twilio from "twilio";

export class SmsService {
  private client: any = null;

  constructor() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    
    if (sid && token) {
      try {
        this.client = twilio(sid, token);
        logger.info("📱 [SMS Service] Twilio client initialized successfully.");
      } catch (err: any) {
        logger.error(err, "⚠️ [SMS Service] Failed to initialize Twilio client with credentials.");
      }
    }
  }

  /**
   * Sends an OTP code to a designated phone number.
   * Activates live Twilio API calls if environment credentials are present.
   * 
   * @param phone The recipient's phone number in E.164 format (e.g. +917994591023)
   * @param code The 6-digit verification code string
   * @returns A promise resolving to a boolean representing dispatch success status
   */
  async sendOtp(phone: string, code: string): Promise<boolean> {
    logger.info(`📱 [SMS Service] Dispatching OTP code: ${code} to phone number: ${phone}`);

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (this.client && fromNumber) {
      try {
        await this.client.messages.create({
          body: `Your keralance HUB verification code is: ${code}. It expires in 5 minutes.`,
          from: fromNumber,
          to: phone,
        });
        logger.info(`✅ [SMS Service] Live Twilio SMS sent successfully to ${phone}`);
        return true;
      } catch (err: any) {
        logger.error(err, `❌ [SMS Service] Failed to send SMS via Twilio to ${phone}`);
        throw err;
      }
    } else {
      logger.warn(`⚠️ [SMS Service] Twilio credentials or phone number missing. Mocking success for code: ${code}`);
      return true;
    }
  }
}

export const smsService = new SmsService();
