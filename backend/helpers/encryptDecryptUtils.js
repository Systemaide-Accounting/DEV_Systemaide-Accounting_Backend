import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.CRYPTO_SECRET;

// Encrypt TIN
export const encryptTIN = (tin) => {
  // return CryptoJS.AES.encrypt(tin, secretKey).toString();
  if (!tin) return "";
  try {
    return CryptoJS.AES.encrypt(tin, secretKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return tin; // Return the original value if encryption fails
  }
};

// Decrypt TIN
export const decryptTIN = (cipherText) => {
  // const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  // return bytes.toString(CryptoJS.enc.Utf8);
  if (!cipherText) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return cipherText; // Return the original value if decryption fails
  }
};
