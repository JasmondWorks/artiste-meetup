import crypto from "crypto";

/**
 * Generates a cryptographically random 6-digit OTP string.
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * One-way SHA-256 hash of an OTP for safe DB storage.
 * Fast enough for short-lived codes; use bcrypt for passwords.
 */
export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
