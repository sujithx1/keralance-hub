import { env } from "@/config/env";
import { logger } from "../lib/logger";
import twilio from "twilio";

export interface OtpRecord {
  codeHash: string;
  expiresAt: Date;
  attempts: number;
}

export class SmsService {
  private client: any = null;
  // In-memory cache to store OTPs without depending on PostgreSQL
  private otpCache = new Map<string, OtpRecord>();

  constructor() {
    const sid = env.TWILIO_ACCOUNT_SID;
    const token = env.TWILIO_AUTH_TOKEN;
    
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
   * Sends an OTP code to a designated phone number and saves it in the local cache.
   * 
   * @param phone The recipient's phone number in E.164 format (e.g. +917994591023)
   * @param code The 6-digit verification code string
   * @param message Optional custom SMS message text body
   * @returns A promise resolving to a boolean representing dispatch success status
   */
  async sendOtp(phone: string, code: string, message?: string): Promise<boolean> {
    logger.info(`📱 [SMS Service] Dispatching OTP code: ${code} to phone number: ${phone}`);

    // Hash code using Argon2
    const codeHash = await Bun.password.hash(code, { algorithm: "argon2id" });
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes TTL

    // Invalidate previous active OTPs in cache
    this.otpCache.delete(phone);

    // Save active OTP to local cache
    this.otpCache.set(phone, {
      codeHash,
      expiresAt,
      attempts: 0,
    });

    const fromNumber = env.TWILIO_PHONE_NUMBER;
    const smsBody = message || `Your keralance HUB verification code is: ${code}. It expires in 5 minutes.`;

    if (this.client && fromNumber) {
      try {
        await this.client.messages.create({
          body: smsBody,
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

  /**
   * Verifies the OTP code for a designated phone number against the local cache.
   * 
   * @param phone The recipient's phone number
   * @param code The 6-digit code entered by the user
   * @returns A promise resolving to a boolean representing verification success status
   */
  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const record = this.otpCache.get(phone);

    if (!record) {
      logger.warn(`⚠️ [SMS Service] Verification failed. No OTP requested for ${phone}`);
      return false;
    }

    // Expiry verification
    if (new Date() > record.expiresAt) {
      logger.warn(`⚠️ [SMS Service] Verification failed. OTP expired for ${phone}`);
      this.otpCache.delete(phone);
      return false;
    }

    // Maximum attempts rate limiting (3 strikes)
    if (record.attempts >= 3) {
      logger.warn(`⚠️ [SMS Service] Verification failed. Too many attempts for ${phone}`);
      this.otpCache.delete(phone);
      return false;
    }

    // Verify hash
    const isValid = await Bun.password.verify(code, record.codeHash);
    
    if (!isValid) {
      record.attempts += 1;
      this.otpCache.set(phone, record); // Update attempt count in cache
      logger.warn(`⚠️ [SMS Service] Verification failed. Invalid code attempt count ${record.attempts} for ${phone}`);
      return false;
    }

    // Success - remove from cache
    this.otpCache.delete(phone);
    logger.info(`✅ [SMS Service] OTP verified successfully for ${phone}`);
    return true;
  }
}

export const smsService = new SmsService();
