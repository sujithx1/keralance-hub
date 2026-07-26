import { env, isProduction } from "@/config/env";
import { logger } from "../lib/logger";

export interface OtpRecord {
  codeHash: string;
  expiresAt: Date;
  attempts: number;
}

export class SmsService {
  // In-memory cache to store OTPs without depending on PostgreSQL
  private otpCache = new Map<string, OtpRecord>();

  /**
   * Sends an OTP code to a designated phone number and saves it in the local cache.
   * Dispatches live Exotel REST calls in production if credentials are provided.
   * 
   * @param phone The recipient's phone number in E.164 format (e.g. +917994591023)
   * @param code The 6-digit verification code string
   * @param message Optional custom SMS message text body
   * @returns A promise resolving to a boolean representing dispatch success status
   */
  async sendOtp(phone: string, code: string, message?: string): Promise<boolean> {
    // Format to E.164 format: prepend '+91' (India) if '+' is missing
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }

    logger.info(`📱 [SMS Service] Dispatching OTP code: ${code} to phone number: ${formattedPhone}`);

    // Hash code using Argon2
    const codeHash = await Bun.password.hash(code, { algorithm: "argon2id" });
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes TTL

    // Invalidate previous active OTPs in cache
    this.otpCache.delete(formattedPhone);

    // Save active OTP to local cache
    this.otpCache.set(formattedPhone, {
      codeHash,
      expiresAt,
      attempts: 0,
    });

    const apiKey = env.EXOTEL_API_KEY;
    const apiToken = env.EXOTEL_API_TOKEN;
    const accountSid = env.EXOTEL_ACCOUNT_SID;
    const senderId = env.EXOTEL_SENDER_ID;
    const smsBody = message || `Your keralance HUB verification code is: ${code}. It expires in 5 minutes.`;

    // Only dispatch external SMS in production and if credentials exist
    if (isProduction && apiKey && apiToken && accountSid && senderId) {
      try {
        const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiToken}`).toString("base64")}`;
        const exotelUrl = `https://api.exotel.com/v1/Accounts/${accountSid}/Sms/send.json`;

        // URL encoded parameters
        const details = new URLSearchParams();
        details.append("From", senderId);
        details.append("To", formattedPhone);
        details.append("Body", smsBody);

        const response = await fetch(exotelUrl, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: details.toString(),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Exotel API returned status ${response.status}: ${errText}`);
        }

        logger.info(`✅ [SMS Service] Live Exotel SMS sent successfully to ${formattedPhone}`);
        return true;
      } catch (err: any) {
        logger.error(err, `❌ [SMS Service] Failed to send SMS via Exotel to ${formattedPhone}`);
        throw err;
      }
    } else {
      logger.warn(`⚠️ [SMS Service] Non-production or Exotel config missing. Local mock verification cached for ${formattedPhone}. Code: ${code}`);
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
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const record = this.otpCache.get(formattedPhone);

    if (!record) {
      logger.warn(`⚠️ [SMS Service] Verification failed. No OTP requested for ${formattedPhone}`);
      return false;
    }

    // Expiry verification
    if (new Date() > record.expiresAt) {
      logger.warn(`⚠️ [SMS Service] Verification failed. OTP expired for ${formattedPhone}`);
      this.otpCache.delete(formattedPhone);
      return false;
    }

    // Maximum attempts rate limiting (3 strikes)
    if (record.attempts >= 3) {
      logger.warn(`⚠️ [SMS Service] Verification failed. Too many attempts for ${formattedPhone}`);
      this.otpCache.delete(formattedPhone);
      return false;
    }

    // Verify hash
    const isValid = await Bun.password.verify(code, record.codeHash);
    
    if (!isValid) {
      record.attempts += 1;
      this.otpCache.set(formattedPhone, record); // Update attempt count in cache
      logger.warn(`⚠️ [SMS Service] Verification failed. Invalid code attempt count ${record.attempts} for ${formattedPhone}`);
      return false;
    }

    // Success - remove from cache
    this.otpCache.delete(formattedPhone);
    logger.info(`✅ [SMS Service] OTP verified successfully for ${formattedPhone}`);
    return true;
  }
}

export const smsService = new SmsService();
